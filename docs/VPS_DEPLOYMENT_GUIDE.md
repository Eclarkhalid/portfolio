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

## Why this is not a static export

Most pages are statically generated, but the contact form uses a Server Action and `next/image` performs runtime image optimization. A Node.js deployment preserves those features. Do not change this project to `output: "export"` for this tutorial.

The repository provides:

- `npm run build:vps`, which creates `.next/standalone` and copies `public` plus `.next/static` into the runtime bundle
- `deploy/systemd/eclarkhalid.service`, a production process definition
- `deploy/nginx/eclarkhalid.com.conf`, the Nginx reverse proxy configuration

## 1. Buy the VPS

Choose any reputable provider. The provider does not change the Linux deployment steps.

Recommended specification for a smooth on-camera build:

- Ubuntu 24.04 LTS, 64-bit
- 2 virtual CPUs
- 4 GB RAM
- 40 GB or more SSD storage
- A public IPv4 address
- A region reasonably close to the expected audience

A 2 GB server can run this portfolio, but building Next.js on the server may require swap. A 4 GB server is less likely to interrupt the recording with an out-of-memory build.

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

Use a short TTL such as 300 seconds while recording. DNS can still take time to propagate.

Check from your computer:

```bash
nslookup eclarkhalid.com
nslookup www.eclarkhalid.com
```

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

Confirm the operating system:

```bash
cat /etc/os-release
uname -a
```

## 4. Create a non-root deployment user

If the provider already supplied a non-root sudo user, you may use that account and skip user creation.

As root:

```bash
adduser deploy
usermod -aG sudo,www-data deploy
```

Copy the existing authorized SSH keys when the root account already uses key authentication:

```bash
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
```

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

Check Nginx:

```bash
sudo systemctl status nginx --no-pager
```

## 6. Configure the firewall

If SSH uses port 22:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

If the provider uses a custom SSH port, allow that port before enabling UFW. Keep the provider console open until the SSH rule is verified so you do not lock yourself out.

Only SSH, HTTP, and HTTPS should be public. Port 3000 stays bound to `127.0.0.1` and is not added to UFW.

## 7. Install Node.js 24 LTS

This project requires Node.js 20.9 or newer. The tutorial uses the current Node.js 24 LTS line.

Download the NodeSource setup script first instead of piping it directly into a shell:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/nodesource_setup.sh
less /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs
```

Verify the runtime:

```bash
node --version
npm --version
which node
```

The service template expects Node at `/usr/bin/node`. Confirm that `which node` prints that path. If it prints a different path, update `ExecStart` in the service file before installing it.

## 8. Give the VPS read access to GitHub

### Public repository

A public repository can be cloned over HTTPS without credentials:

```bash
sudo mkdir -p /var/www/eclarkhalid.com
sudo chown deploy:www-data /var/www/eclarkhalid.com
cd /var/www/eclarkhalid.com
git clone https://github.com/GITHUB_REPOSITORY.git app
```

### Private repository

Use a read-only GitHub deploy key. Do not paste a personal access token into the terminal or video.

Generate the key as the deployment user:

```bash
ssh-keygen -t ed25519 -C "eclarkhalid-vps-deploy" -f ~/.ssh/github_eclarkhalid -N ""
cat ~/.ssh/github_eclarkhalid.pub
```

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

## 10. Install dependencies and run release checks

```bash
npm ci
npm run typecheck
npm run lint
```

Build the standalone VPS runtime:

```bash
npm run build:vps
```

The command performs a production Next.js build with standalone output, then copies the public and static assets required by the minimal server.

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

In a second SSH terminal:

```bash
curl -I http://127.0.0.1:3000
curl -I http://127.0.0.1:3000/products
curl http://127.0.0.1:3000/robots.txt
```

Stop the foreground process with `Ctrl+C` after the checks pass.

## 12. Install the systemd service

From the repository root:

```bash
cd /var/www/eclarkhalid.com/app
sudo cp deploy/systemd/eclarkhalid.service /etc/systemd/system/eclarkhalid.service
sudo systemctl daemon-reload
sudo systemctl enable --now eclarkhalid
```

Check the service:

```bash
sudo systemctl status eclarkhalid --no-pager
sudo journalctl -u eclarkhalid -n 50 --no-pager
curl -I http://127.0.0.1:3000
```

The application should now restart automatically after a crash or server reboot.

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

Disable the default site if it is still enabled:

```bash
sudo unlink /etc/nginx/sites-enabled/default
```

Validate before reloading:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Test through Nginx before DNS or HTTPS is complete:

```bash
curl -I http://127.0.0.1 -H 'Host: eclarkhalid.com'
```

Then test the public domain:

```bash
curl -I http://eclarkhalid.com
```

## 14. Enable HTTPS with Certbot

Certbot's Nginx flow expects the domain to resolve to this server and port 80 to be publicly reachable.

Install Certbot with Snap:

```bash
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/local/bin/certbot
```

Request and install a certificate:

```bash
sudo certbot --nginx \
  -d eclarkhalid.com \
  -d www.eclarkhalid.com \
  --redirect
```

Test automatic renewal:

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

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

Check the process after a reboot:

```bash
sudo reboot
```

Reconnect and verify:

```bash
sudo systemctl is-active eclarkhalid
sudo systemctl is-active nginx
curl -I https://eclarkhalid.com
```

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

### Nginx returns 502 Bad Gateway

Check the application first:

```bash
sudo systemctl status eclarkhalid --no-pager
sudo journalctl -u eclarkhalid -n 100 --no-pager
curl -I http://127.0.0.1:3000
```

A 502 normally means Nginx is running but the Node.js service is not reachable.

### The service cannot find `server.js`

Confirm:

```bash
ls -la /var/www/eclarkhalid.com/app/.next/standalone/server.js
systemctl cat eclarkhalid
```

Re-run `npm run build:vps` if the standalone directory is missing.

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

### Contact email does not send

Check that `RESEND_API_KEY` and `CONTACT_FROM` are present in `.env.production`, that the sender domain is verified, and that the service was restarted after the values changed:

```bash
sudo systemctl restart eclarkhalid
sudo journalctl -u eclarkhalid -n 50 --no-pager
```

Do not print the environment file during a recording.

## Production checklist

- [ ] Non-root SSH login works.
- [ ] UFW allows only required public services.
- [ ] Node.js 24 LTS is installed.
- [ ] GitHub access does not expose a personal token.
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
- [GitHub deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys)
