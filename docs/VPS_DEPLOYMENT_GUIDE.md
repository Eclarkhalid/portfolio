# Deploy this Next.js portfolio to a VPS

This guide deploys the portfolio as a Next.js standalone Node.js server behind Nginx, managed by systemd, with HTTPS from Certbot.

It is written for a single Ubuntu 24.04 LTS VPS and the production domain `eclarkhalid.com`. Replace placeholder values before running commands.

## What the final architecture looks like

```text
Visitor
  -> HTTPS on ports 80 and 443
  -> Nginx reverse proxy
  -> Next.js standalone server on 127.0.0.1:3000
  -> systemd keeps the Node.js process running
```

The Next.js process is not exposed directly to the internet. Nginx receives public traffic, terminates HTTPS, forwards trusted proxy headers, and passes requests to the application on localhost.

> **The four moving parts, in plain terms:**
>
> - **Nginx** is a web server acting here as a *reverse proxy*: it accepts requests from the public internet and forwards them to a program running privately on the same machine. It is the only piece the outside world talks to.
> - **The Next.js standalone server** is your site, running as a Node.js process. It listens on `127.0.0.1:3000`, an address reachable only from inside the server itself.
> - **systemd** is the Linux service manager. It starts your app at boot, restarts it if it crashes, and captures its logs.
> - **Certbot** obtains and renews the TLS certificate that makes HTTPS work.

## Why this is not a static export

Most pages are statically generated, but the contact form uses a Server Action and `next/image` performs runtime image optimization. A Node.js deployment preserves those features. Do not change this project to `output: "export"` for this tutorial.

The repository provides:

- `npm run build:vps`, which creates `.next/standalone` and copies `public` plus `.next/static` into the runtime bundle
- `deploy/systemd/eclarkhalid.service`, a production process definition
- `deploy/nginx/eclarkhalid.com.conf`, the Nginx reverse proxy configuration

> **What "standalone" means:** a normal Next.js build expects the whole project, including `node_modules`, to be present at runtime. Standalone output traces exactly which files the server actually needs and copies them into `.next/standalone`, producing a self-contained bundle that runs with a plain `node server.js`. It is smaller and does not require `npm` on the running server.

## 1. Buy the VPS

Choose any reputable provider. The provider does not change the Linux deployment steps.

> **What a VPS is:** a virtual private server, meaning a slice of a physical machine in a data centre that behaves like your own dedicated Linux computer, with its own public IP address and full root access.

Recommended specification for a smooth on-camera build:

- Ubuntu 24.04 LTS, 64-bit
- 2 virtual CPUs
- 4 GB RAM
- 40 GB or more SSD storage
- A public IPv4 address
- A region reasonably close to the expected audience

A 2 GB server can run this portfolio, but building Next.js on the server may require swap. A 4 GB server is less likely to interrupt the recording with an out-of-memory build.

> **Why LTS:** Long Term Support releases receive security updates for five years. A non-LTS Ubuntu stops receiving them in nine months, which is not a sensible base for a production site.

During checkout:

1. Select Ubuntu 24.04 LTS.
2. Add your SSH public key if the provider supports it.
3. Set a clear server name, for example `portfolio-prod`.
4. Finish the purchase and copy the public IP address.
5. Do not show the root password, recovery token, API token, or private SSH key in the video.

Use these placeholders in the guide:

```text
SERVER_IP=203.0.113.10
GITHUB_REPOSITORY=Eclarkhalid/REPLACE_WITH_REPOSITORY
```

## 2. Point the domain to the server

At the DNS provider for `eclarkhalid.com`, create:

| Type | Name  | Value                 | Purpose     |
| ---- | ----- | --------------------- | ----------- |
| A    | `@`   | Your VPS IPv4 address | Apex domain |
| A    | `www` | Your VPS IPv4 address | `www` host  |

> **What this does:** an `A` record maps a hostname to an IPv4 address. `@` means the domain itself (`eclarkhalid.com`) and `www` means the `www.eclarkhalid.com` subdomain. Until these point at your VPS, nothing you do on the server can make the domain work.

Use a short TTL such as 300 seconds while recording. DNS can still take time to propagate.

> **What TTL is:** Time To Live, the number of seconds other DNS servers are allowed to cache an answer before asking again. A high TTL means a change you make now may not be visible elsewhere for hours. Lowering it to 300 before you make changes shortens that window.

### Verify the records properly

A single `nslookup` is not enough, because it asks whichever resolver your machine happens to use, and that resolver may be serving a cached answer. Check the authoritative source and a well-known public resolver as well:

```bash
dig +short NS eclarkhalid.com
dig +short @$(dig +short NS eclarkhalid.com | head -1) eclarkhalid.com A
dig +short @1.1.1.1 eclarkhalid.com A
dig +short @8.8.8.8 eclarkhalid.com A
```

> **What this does:** the first command finds the *authoritative* nameservers, the machines that hold the real answer for your domain. The second asks one of them directly, bypassing every cache in between. The last two ask Cloudflare and Google, which is a good proxy for what visitors and Let's Encrypt will see. If the authoritative answer is correct, your DNS is correct, regardless of what any individual cache says.

All of them should print your VPS IP address before you continue.

Do not request the HTTPS certificate until both names resolve to this VPS and port 80 is reachable.

## 3. Connect over SSH

From your computer:

```bash
ssh root@SERVER_IP
```

If the provider created an `ubuntu` user instead:

```bash
ssh ubuntu@SERVER_IP
```

> **What SSH is:** Secure Shell, an encrypted remote login. Everything you type goes to the server and its output comes back, over an encrypted channel. Key-based authentication uses a private key on your laptop and a matching public key on the server, which is both easier and far safer than a password.

Confirm the operating system:

```bash
cat /etc/os-release
uname -a
```

### If you have rebuilt or reinstalled this server

A fresh operating system generates a new SSH host key, so your laptop will refuse to connect and print `REMOTE HOST IDENTIFICATION HAS CHANGED`. Clear the stale entry before recording:

```bash
ssh-keygen -R SERVER_IP
ssh-keygen -R your-ssh-alias
```

> **What this does:** your laptop remembers each server's host key in `~/.ssh/known_hosts` so it can detect impersonation. After a legitimate reinstall the key genuinely changed, so removing the old record is correct. Never do this to silence the warning on a server you did not just rebuild.

## 4. Create a non-root deployment user

If the provider already supplied a non-root sudo user, you may use that account and skip user creation.

> **Why not just use root:** root can destroy the system with a single mistyped command, and any process it runs inherits that power. A dedicated `deploy` user that can escalate through `sudo` when needed keeps normal work inside safe limits and leaves an audit trail.

As root:

```bash
adduser deploy
usermod -aG sudo,www-data deploy
```

> **What this does:** creates the `deploy` account, then adds it to two groups. `sudo` grants the ability to run privileged commands deliberately. `www-data` is the group Nginx runs as, which keeps file permissions straightforward between the two.

Copy the existing authorized SSH keys when the root account already uses key authentication:

```bash
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
```

> **What this does:** creates `/home/deploy/.ssh` readable only by its owner (mode 700), copies the public keys that were already trusted for root, and locks the file to owner-read-write only (mode 600). SSH deliberately refuses to use these files if they are readable by anyone else.

Open a second terminal and verify the new login before continuing:

```bash
ssh deploy@SERVER_IP
sudo whoami
```

Expected output from the final command is `root`.

Do not disable root or password authentication during the recording unless the new key-based login has already been tested in a second terminal.

## 5. Update the server and install base packages

Run as the non-root sudo user:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y ca-certificates curl git nginx snapd
```

> **What this does:** `apt update` refreshes the catalogue of available packages, it does not change anything installed. `apt upgrade -y` then installs the newer versions, which is how you pick up security fixes. The final line installs the tools this guide needs: `ca-certificates` so the server can validate HTTPS connections, `curl` for making requests, `git` to fetch your code, `nginx` as the web server, and `snapd` because Certbot is distributed as a snap.

Check Nginx:

```bash
sudo systemctl status nginx --no-pager
```

> **What this does:** `systemctl status` reports whether a service is running, whether it starts at boot, and shows its recent log lines. `--no-pager` prints the output directly instead of opening a scrolling viewer, which matters when you are recording.

### Check the server's DNS resolver

Some providers assign their own DNS resolvers, and those resolvers are occasionally slow to pick up record changes or get stuck serving a stale answer. This does not affect your visitors, but it makes every verification command you run *on the server* fail confusingly. Check it early:

```bash
resolvectl status | grep -i "current dns"
getent hosts eclarkhalid.com
dig +short @1.1.1.1 eclarkhalid.com A
```

If `getent` disagrees with `1.1.1.1`, the server's resolver is stale. Point it at a public resolver for the session:

```bash
ip -br link
sudo resolvectl dns eth0 1.1.1.1 8.8.8.8
sudo resolvectl flush-caches
getent hosts eclarkhalid.com
```

> **What this does:** `ip -br link` prints your network interface names, since it is not always `eth0`. `resolvectl dns` sets the DNS servers for that interface at runtime, and `flush-caches` discards answers already cached locally. This change is not written to disk, so it reverts on reboot. To make it permanent, set `DNS=` in `/etc/systemd/resolved.conf` instead.
>
> **Risk:** if you mistype the resolver addresses, name resolution breaks for `apt` and Certbot until you run `sudo resolvectl revert eth0` or reboot.

## 6. Configure the firewall

If SSH uses port 22:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

> **What this does:** `ufw` is Ubuntu's simplified firewall. It denies all incoming connections by default once enabled, so you must explicitly allow what you need *before* enabling it. `OpenSSH` opens port 22 so you do not lose your own connection. `Nginx Full` is a shorthand profile covering ports 80 (HTTP) and 443 (HTTPS).

If the provider uses a custom SSH port, allow that port before enabling UFW. Keep the provider console open until the SSH rule is verified so you do not lock yourself out.

> **Warning:** `sudo ufw --force reset` wipes every rule including the SSH allow. Do not run it on a server you are connected to remotely unless you have working console access through your provider's panel.

Only SSH, HTTP, and HTTPS should be public. Port 3000 stays bound to `127.0.0.1` and is not added to UFW.

> **Why port 3000 needs no rule:** the Next.js process listens on `127.0.0.1`, the loopback address, which is only reachable from within the server itself. There is nothing for the firewall to block because the port was never exposed in the first place.

## 7. Install Node.js 24 LTS

This project requires Node.js 20.9 or newer. The tutorial uses the current Node.js 24 LTS line.

Download the NodeSource setup script first instead of piping it directly into a shell:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/nodesource_setup.sh
less /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs
```

> **What this does and why it is split up:** the widely-copied `curl ... | sudo bash` pattern executes a script from the internet as root without you ever seeing it. Downloading first, reading it with `less`, then running it deliberately is the same outcome with the opportunity to check what you are about to trust. The script adds NodeSource's package repository and signing key, after which `apt install nodejs` pulls Node from that repository rather than Ubuntu's older default.

Verify the runtime:

```bash
node --version
npm --version
which node
```

The service template expects Node at `/usr/bin/node`. Confirm that `which node` prints that path. If it prints a different path, update `ExecStart` in the service file before installing it.

## 8. Give the VPS read access to GitHub

> **Directory naming matters here.** Clone into a directory named `app`, so the application ends up at `/var/www/eclarkhalid.com/app`. The systemd unit in `deploy/systemd/eclarkhalid.service` hardcodes that path. If you clone into a differently named directory, the service will not start until you edit the unit to match.

### Public repository

A public repository can be cloned over HTTPS without credentials:

```bash
sudo mkdir -p /var/www/eclarkhalid.com
sudo chown deploy:www-data /var/www/eclarkhalid.com
cd /var/www/eclarkhalid.com
git clone https://github.com/GITHUB_REPOSITORY.git app
```

> **What this does:** creates the parent directory as root, hands ownership to the `deploy` user and the `www-data` group so `deploy` can write there without `sudo`, then clones the repository into `app`.

### Private repository

Use a read-only GitHub deploy key. Do not paste a personal access token into the terminal or video.

> **What a deploy key is:** an SSH key registered against one single repository rather than your whole GitHub account. If the server is ever compromised, the attacker gains read access to that one repository and nothing else. A personal access token, by contrast, typically unlocks everything you own.

Generate the key as the deployment user:

```bash
ssh-keygen -t ed25519 -C "eclarkhalid-vps-deploy" -f ~/.ssh/github_eclarkhalid -N ""
cat ~/.ssh/github_eclarkhalid.pub
```

> **What this does:** generates a modern Ed25519 key pair. `-f` names the files, `-C` adds a comment so you can recognise it later in GitHub's key list, and `-N ""` sets an empty passphrase because an unattended server cannot type one. Only the `.pub` file is shown, which is safe to display. The file without `.pub` is the private key and must never appear on camera.

In GitHub:

1. Open the repository.
2. Go to Settings, Deploy keys.
3. Select Add deploy key.
4. Give it a name such as `portfolio production VPS`.
5. Paste the public key.
6. Leave write access disabled.

Configure SSH to use that key:

```bash
cat <<'EOF' >> ~/.ssh/config
Host github.com-eclarkhalid
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_eclarkhalid
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
ssh -T git@github.com-eclarkhalid
```

> **What this does:** defines a named SSH shortcut. Whenever you use the host `github.com-eclarkhalid`, SSH connects to the real `github.com` but presents this specific key. `IdentitiesOnly yes` stops SSH from offering every other key it can find, which otherwise causes confusing authentication failures.

GitHub may report that shell access is unavailable. That is expected if authentication succeeded.

Clone the private repository:

```bash
sudo mkdir -p /var/www/eclarkhalid.com
sudo chown deploy:www-data /var/www/eclarkhalid.com
cd /var/www/eclarkhalid.com
git clone git@github.com-eclarkhalid:GITHUB_REPOSITORY.git app
```

## 9. Create the production environment file

Move into the application:

```bash
cd /var/www/eclarkhalid.com/app
```

Create a production environment file that is ignored by Git:

```bash
install -m 600 /dev/null .env.production
nano .env.production
```

> **What this does:** `install -m 600 /dev/null` creates an empty file with owner-only read and write permissions in a single step, so the secrets you are about to paste are never briefly world-readable. Environment variables are how configuration and secrets reach the application without ever being committed to the repository.

Use this template:

```dotenv
RESEND_API_KEY=
CONTACT_FROM="Eclar Khalid <contact@eclarkhalid.com>"
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
```

Notes:

- Leave `RESEND_API_KEY` and `CONTACT_FROM` blank if email delivery is not ready. The site displays the direct email fallback.
- `CONTACT_FROM` must be a sender verified in Resend.
- The webmaster verification values affect statically generated metadata, so they must exist before the build.
- Never commit `.env.production` or show real secret values in the recording.

Confirm permissions without printing the values:

```bash
stat -c '%a %U %G %n' .env.production
```

Expected mode is `600`.

> **What this does:** prints the permission mode, owner, group and name, and nothing else. Use this rather than `cat` whenever you need to check a secret file on camera.

## 10. Install dependencies and run release checks

```bash
npm ci
npm run typecheck
npm run lint
```

> **What this does:** `npm ci` installs the exact dependency versions recorded in `package-lock.json`, deleting `node_modules` first. Unlike `npm install`, it will not silently upgrade anything, so the server gets precisely what you tested locally. The two checks after it are the project's quality gates: `typecheck` runs the TypeScript compiler without emitting files, and `lint` runs ESLint.

Build the standalone VPS runtime:

```bash
npm run build:vps
```

The command performs a production Next.js build with standalone output, then copies the public and static assets required by the minimal server.

> **Why the copy step exists:** Next.js writes the traced server bundle to `.next/standalone`, but deliberately does not copy `public/` or `.next/static/` into it, because many hosts serve those from a CDN instead. Running from a plain VPS means you need them locally, which is what `scripts/build-vps.mjs` handles.

Verify the runtime files:

```bash
test -f .next/standalone/server.js && echo "server.js ready"
test -d .next/standalone/public && echo "public assets ready"
test -d .next/standalone/.next/static && echo "Next static assets ready"
```

## 11. Test the standalone server directly

Start it temporarily in the foreground:

```bash
cd /var/www/eclarkhalid.com/app/.next/standalone
HOSTNAME=127.0.0.1 PORT=3000 node server.js
```

> **What this does and why it comes first:** runs the app by hand before involving systemd or Nginx. If something is broken, you see the error immediately in your terminal rather than having to dig through service logs. `HOSTNAME=127.0.0.1` binds it to loopback only, and `PORT=3000` matches what Nginx will forward to. Testing one layer at a time is what makes the next failure easy to locate.

In a second SSH terminal:

```bash
curl -I http://127.0.0.1:3000
curl -I http://127.0.0.1:3000/products
curl http://127.0.0.1:3000/robots.txt
```

> **What this does:** `curl -I` requests only the response headers, so you see the status code without a screen full of HTML. `200` means success.

Stop the foreground process with `Ctrl+C` after the checks pass.

## 12. Install the systemd service

From the repository root:

```bash
cd /var/www/eclarkhalid.com/app
sudo cp deploy/systemd/eclarkhalid.service /etc/systemd/system/eclarkhalid.service
sudo systemctl daemon-reload
sudo systemctl enable --now eclarkhalid
```

> **What this does:** copies the service definition into the directory systemd reads, tells systemd to re-read its configuration (`daemon-reload`), then `enable --now` both starts the service immediately and registers it to start automatically at boot. Without `enable`, the site would not come back after a reboot.
>
> **Worth reading in that unit file:** `Restart=always` brings the app back if it crashes, `User=deploy` means it does not run as root, `EnvironmentFile` loads your secrets, and `ProtectHome`/`NoNewPrivileges` restrict what the process can reach even if it is compromised.

Check the service:

```bash
sudo systemctl status eclarkhalid --no-pager
sudo journalctl -u eclarkhalid -n 50 --no-pager
curl -I http://127.0.0.1:3000
```

> **What `journalctl` is:** the query tool for systemd's log store. `-u eclarkhalid` filters to this one service and `-n 50` shows the last fifty lines. Anything your app writes to stdout or stderr is captured here automatically.

The application should now restart automatically after a crash or server reboot.

To confirm the app is genuinely managed by systemd rather than still running from a forgotten foreground terminal:

```bash
systemctl is-active eclarkhalid
ss -ltnp | grep :3000
```

The process on port 3000 should belong to the service. If it does not, the reboot test later will fail.

Useful commands:

```bash
sudo systemctl restart eclarkhalid
sudo systemctl stop eclarkhalid
sudo systemctl start eclarkhalid
sudo journalctl -u eclarkhalid -f
```

## 13. Configure Nginx

Install the supplied configuration:

```bash
cd /var/www/eclarkhalid.com/app
sudo cp deploy/nginx/eclarkhalid.com.conf /etc/nginx/sites-available/eclarkhalid.com
sudo ln -s /etc/nginx/sites-available/eclarkhalid.com /etc/nginx/sites-enabled/eclarkhalid.com
```

> **What this does:** Nginx keeps every site definition in `sites-available` and activates a site by symlinking it into `sites-enabled`. Separating the two lets you disable a site by removing one link, without deleting its configuration.

Disable the default site if it is still enabled:

```bash
sudo unlink /etc/nginx/sites-enabled/default
```

> **Why:** the stock Ubuntu site claims the default server slot and would answer requests that your configuration should handle.

Validate before reloading:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

> **What this does:** `nginx -t` parses the configuration and reports errors without applying it. Always run it first. `reload` then applies the new configuration by starting fresh worker processes while existing connections finish, so no request is dropped. This is different from `restart`, which stops everything and briefly refuses connections.

Test through Nginx before DNS or HTTPS is complete:

```bash
curl -I http://127.0.0.1 -H 'Host: eclarkhalid.com'
```

> **What this does:** connects to Nginx on this machine while claiming to be asking for `eclarkhalid.com`. Nginx picks the server block by that `Host` header, so this proves your configuration works without depending on DNS at all. It is the single most useful command for separating "my server is broken" from "my DNS is wrong".

Then test the public domain:

```bash
curl -I http://eclarkhalid.com
```

If the loopback test returns `200` but this one cannot connect, the problem is DNS or the firewall, not your server. See the troubleshooting entry below.

## 14. Enable HTTPS with Certbot

Certbot's Nginx flow expects the domain to resolve to this server and port 80 to be publicly reachable.

> **How certificate issuance works:** Let's Encrypt needs proof you control the domain. Certbot places a file on your server, then Let's Encrypt fetches it over plain HTTP at `http://eclarkhalid.com/.well-known/acme-challenge/...`. This is the HTTP-01 challenge, and it is why DNS must already be correct and port 80 open. Validation runs from Let's Encrypt's own infrastructure, so a stale resolver on your VPS does not affect it.

Install Certbot with Snap:

```bash
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/local/bin/certbot
```

> **What this does:** installs Certbot as a snap, which stays current independently of Ubuntu's release cycle. `--classic` grants it the system access it needs to edit Nginx configuration. The symlink puts it on the default `PATH` so `sudo certbot` works.

### Rehearse before issuing a real certificate

Let's Encrypt enforces rate limits, including a cap on duplicate certificates for the same set of hostnames within a rolling week. Repeated takes of this step during a recording can exhaust that allowance and lock you out for days. Rehearse against the staging environment first:

```bash
sudo certbot --nginx -d eclarkhalid.com -d www.eclarkhalid.com --redirect --dry-run
```

> **What this does:** performs the entire issuance flow against Let's Encrypt's staging servers, proving your DNS, firewall and Nginx setup are correct, without consuming any rate-limit allowance and without installing a certificate. Check the current limits at <https://letsencrypt.org/docs/rate-limits/>.

Request and install the real certificate:

```bash
sudo certbot --nginx \
  -d eclarkhalid.com \
  -d www.eclarkhalid.com \
  --redirect
```

> **What this does:** obtains a certificate covering both hostnames, writes it under `/etc/letsencrypt/live/`, edits your Nginx configuration to add a port 443 server block referencing it, and with `--redirect` adds a rule sending all HTTP traffic to HTTPS. Certbot will prompt for an email address and ToS agreement.
>
> **Important side effect:** Certbot rewrites `/etc/nginx/sites-available/eclarkhalid.com` in place. That file now differs from `deploy/nginx/eclarkhalid.com.conf` in the repository. Do not blindly re-copy the repository version over it later, or you will delete your TLS configuration.

Test automatic renewal:

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

> **What this does:** certificates last 90 days. The snap installs a timer that attempts renewal twice daily and acts only when expiry is near. The dry run proves that mechanism works now, rather than discovering it does not in three months.

Open the site:

```text
https://eclarkhalid.com
```

## 15. Verify the production deployment

Run server-side checks:

```bash
curl -I https://eclarkhalid.com
curl -I https://eclarkhalid.com/products
curl -I https://eclarkhalid.com/work
curl -I https://eclarkhalid.com/writing
curl -I https://eclarkhalid.com/contact
curl -I https://eclarkhalid.com/this-page-does-not-exist
curl https://eclarkhalid.com/robots.txt
curl https://eclarkhalid.com/sitemap.xml
curl https://eclarkhalid.com/rss.xml
```

Confirm:

- HTTP redirects to HTTPS.
- The apex and `www` names have valid certificates.
- The homepage and key routes return 200.
- A missing route returns 404 and shows the custom page.
- `robots.txt`, `sitemap.xml`, and `rss.xml` load.
- Images load through `/_next/image`.
- The contact form either sends successfully or shows the expected direct-email fallback.
- The response includes the configured security headers.

> **Expected change after `--redirect`:** the earlier test `curl -I http://127.0.0.1 -H 'Host: eclarkhalid.com'` now returns `301`, not `200`. That is the redirect working correctly, not a regression. Use the `https://` URLs from this point on.

If the server's own resolver is stale and these fail while the site works in a browser, pin the address to prove the request reaches this machine:

```bash
curl -I --resolve eclarkhalid.com:443:SERVER_IP https://eclarkhalid.com
```

Check the process after a reboot:

```bash
sudo reboot
```

Reconnect and verify:

```bash
sudo systemctl is-active eclarkhalid
sudo systemctl is-active nginx
curl -I https://eclarkhalid.com
uptime -p
```

> **Expect a brief refusal.** For roughly the first 30 to 60 seconds after `sudo reboot`, `ssh` will report `Connection refused`. That is normal: the network stack comes up before `sshd` does, so the connection is actively refused rather than ignored. The distinction is worth knowing generally. *Connection refused* means the machine answered and nothing is listening on that port. *Connection timed out* means nothing answered at all, which points at a firewall or a host that is down.

## 16. Deploy future updates

```bash
ssh deploy@SERVER_IP
cd /var/www/eclarkhalid.com/app
git status --short
git pull --ff-only
npm ci
npm run typecheck
npm run lint
npm run build:vps
sudo systemctl restart eclarkhalid
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000
curl -fsS -o /dev/null -w '%{http_code}\n' https://eclarkhalid.com
```

> **What this does:** `git status --short` first, so you notice any accidental edits made on the server before they are destroyed. `--ff-only` refuses to merge, so the pull either fast-forwards cleanly or stops and tells you something needs attention. The checks run before the build so a broken commit fails fast. `restart` is required because the running process holds the old build in memory.

Do not run `git reset --hard` as a routine deployment step. If `git pull --ff-only` refuses because the server has local changes, inspect them instead of deleting them.

## 17. Roll back to a known commit

Find the last known good commit:

```bash
cd /var/www/eclarkhalid.com/app
git log --oneline -10
```

Build a specific commit without rewriting branch history:

```bash
git switch --detach COMMIT_SHA
npm ci
npm run build:vps
sudo systemctl restart eclarkhalid
```

> **What `--detach` does:** checks out that exact commit without moving any branch pointer. The repository enters "detached HEAD" state, which sounds alarming but simply means you are viewing a specific commit rather than the tip of a branch. Nothing is lost and the branch is untouched.

Return to the deployment branch later:

```bash
git switch main
git pull --ff-only
npm ci
npm run build:vps
sudo systemctl restart eclarkhalid
```

## Troubleshooting

### `npm run build:vps` is killed

The VPS likely ran out of memory. Check:

```bash
free -h
dmesg -T | grep -i -E 'killed process|out of memory'
```

Use a 4 GB VPS or add temporary swap before rebuilding.

> **What happened:** Linux terminates the largest process when memory is exhausted, and a Next.js build is usually the largest thing running. The build is not at fault, the machine simply ran out of room.

### The domain does not connect, but `127.0.0.1` works

Symptom: `curl -I http://127.0.0.1 -H 'Host: eclarkhalid.com'` returns `200`, while `curl -I http://eclarkhalid.com` fails to connect.

Your server is fine. The request is leaving the machine and going somewhere else, or not being allowed back in. Work through it in this order:

```bash
curl -4 -fsS https://ifconfig.me; echo          # what IP this server actually has
getent hosts eclarkhalid.com                    # what this server resolves it to
dig +short @1.1.1.1 eclarkhalid.com A           # what the rest of the world resolves it to
dig +short @$(dig +short NS eclarkhalid.com | head -1) eclarkhalid.com A   # the authoritative answer
sudo ufw status verbose                         # is 80/443 allowed
ss -ltnp | grep -E ':80|:443'                   # is Nginx listening on all interfaces
```

Interpreting the result:

- **Authoritative answer is wrong:** your DNS records are genuinely wrong. Fix them at the DNS provider.
- **Authoritative answer is right but `getent` disagrees:** only this server's resolver is stale. Visitors are unaffected. Apply the resolver fix in step 5, or verify with `curl --resolve` instead.
- **DNS is right everywhere and it still fails fast:** check the firewall and whether Nginx is bound to `0.0.0.0` rather than only loopback.

> **Read the failure speed.** A refusal in a few hundred milliseconds means something answered and rejected the connection, which usually means you reached the wrong host. A hang of several seconds ending in a timeout means packets are being silently discarded, which points at a firewall.

### Nginx returns 502 Bad Gateway

Check the application first:

```bash
sudo systemctl status eclarkhalid --no-pager
sudo journalctl -u eclarkhalid -n 100 --no-pager
curl -I http://127.0.0.1:3000
```

A 502 normally means Nginx is running but the Node.js service is not reachable.

> **What 502 tells you:** Nginx accepted the visitor's request but got nothing usable back from the thing it proxies to. The visitor-facing layer is healthy and the application behind it is not, which is why you always check the app first.

### The service cannot find `server.js`

Confirm:

```bash
ls -la /var/www/eclarkhalid.com/app/.next/standalone/server.js
systemctl cat eclarkhalid
```

Re-run `npm run build:vps` if the standalone directory is missing.

> **Common cause:** the repository was cloned into a directory not named `app`. The unit file's `WorkingDirectory` is an absolute path and does not adapt. Either clone to `app` or edit the unit to match, then `sudo systemctl daemon-reload`.

### CSS or images are missing

Confirm that the VPS build script copied both directories:

```bash
ls -la .next/standalone/public
ls -la .next/standalone/.next/static
```

### Certbot cannot issue the certificate

Check:

```bash
nslookup eclarkhalid.com
nslookup www.eclarkhalid.com
sudo ufw status
sudo nginx -t
curl -I http://eclarkhalid.com
```

Both DNS records must point at this VPS, port 80 must be reachable, and Nginx must answer for both hostnames.

> **If you have retried several times,** you may have hit a rate limit rather than a configuration fault. Read the error text carefully, and use `--dry-run` for further attempts until it succeeds.

### SSH is refused after a reboot or reinstall

- **Immediately after `sudo reboot`:** wait 30 to 60 seconds. `sshd` starts after networking.
- **After an operating system reinstall:** the host key changed, so clear the old entry with `ssh-keygen -R SERVER_IP`. See step 3.

### Contact email does not send

Check that `RESEND_API_KEY` and `CONTACT_FROM` are present in `.env.production`, that the sender domain is verified, and that the service was restarted after the values changed:

```bash
sudo systemctl restart eclarkhalid
sudo journalctl -u eclarkhalid -n 50 --no-pager
```

Do not print the environment file during a recording.

> **Why a restart is required:** systemd reads `EnvironmentFile` when the process starts. Editing the file has no effect on an already-running service.

## Production checklist

- [ ] Non-root SSH login works.
- [ ] UFW allows only required public services.
- [ ] Node.js 24 LTS is installed.
- [ ] The server's DNS resolver returns the correct address.
- [ ] GitHub access does not expose a personal token.
- [ ] The repository is cloned to `/var/www/eclarkhalid.com/app`.
- [ ] `.env.production` is untracked and mode 600.
- [ ] Typecheck and lint pass.
- [ ] `npm run build:vps` succeeds.
- [ ] The standalone server responds on `127.0.0.1:3000`.
- [ ] systemd starts and restarts the application.
- [ ] Nginx configuration passes `nginx -t`.
- [ ] HTTPS and renewal checks pass.
- [ ] Main pages, 404, robots, sitemap, RSS, images, and contact state are verified.
- [ ] The application survives a VPS reboot.

## Official references

- [Next.js self-hosting guide](https://nextjs.org/docs/app/guides/self-hosting)
- [Next.js standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Node.js 24 LTS releases](https://nodejs.org/en/blog/release/v24.18.0)
- [NodeSource Debian and Ubuntu distributions](https://github.com/nodesource/distributions)
- [Ubuntu Nginx installation](https://documentation.ubuntu.com/server/how-to/web-services/install-nginx/)
- [Ubuntu firewall guide](https://documentation.ubuntu.com/server/how-to/security/firewalls/)
- [Certbot Nginx instructions](https://certbot.eff.org/instructions?os=snap&ws=nginx)
- [Let's Encrypt rate limits](https://letsencrypt.org/docs/rate-limits/)
- [GitHub deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys)
