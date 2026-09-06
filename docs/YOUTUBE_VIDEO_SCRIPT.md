# YouTube script: deploy a Next.js app to a VPS, from localhost to live

This is the recording script. It pairs with two other files:

- `docs/YOUTUBE_VIDEO_RUNBOOK.md` holds the confirmed setup, the safety rules, the demo route and the troubleshooting cues.
- `docs/VPS_DEPLOYMENT_GUIDE.md` is the command reference. Every command below is copied from it. If the guide changes, change this file.

## How to read this script

- **Target runtime:** 39 minutes. Times are targets for the final edit, not the raw recording. Expect the raw footage to run closer to 70 minutes before cuts.
- **Format:** screen capture with voiceover. No face cam. The narration carries the energy, so read it at a steady pace and let the terminal breathe between commands.
- Each chapter is a sequence of beats. **On screen** describes what the viewer sees. **Say** is narration, word for word. Read it as written on the first take, then loosen it on the second if it sounds stiff.
- `CUT` marks what to remove or speed up in the edit.
- `KEEP` marks a wait, a failure or a detour that stays in because it teaches something.
- The story has four checkpoints. Each proves one layer works before the next layer goes on top. Show a title card at each one: **Checkpoint 1 of 4** and so on. The checkpoints are the spine of the video; if you have to cut for time, cut explanation, never a checkpoint.

## Fixed values

```text
Domain:             eclarkhalid.com
Server IP:          SERVER_IP (203.0.113.10 in the guide)
Local SSH alias:    portfolio-prod
Repository:         https://github.com/Eclarkhalid/portfolio (public)
Application dir:    /var/www/eclarkhalid.com/app
Deployment user:    deploy
systemd service:    eclarkhalid
```

## Running order

| Time | Chapter | Purpose |
| ----- | ---------------------------------------------- | ------------------------------------------ |
| 0:00 | Cold open: this only runs on my laptop | Hook and promise |
| 0:45 | The architecture in sixty seconds | Mental model before any command |
| 2:00 | Buy the VPS and point the domain at it | Provider, DNS, verified with dig |
| 5:00 | Connect and create a deploy user | SSH, non-root user, second-terminal proof |
| 8:30 | Update, base packages, firewall | apt, Nginx present, UFW with lockout warning |
| 11:30 | Install Node.js 24 | Download-then-read pattern |
| 13:30 | Push, clone and create the environment file | GitHub as the bridge, secrets never shown |
| 17:00 | Build and test Next.js on its own | **Checkpoint 1** |
| 21:00 | Keep it running with systemd | **Checkpoint 2**, includes the crash demo |
| 24:30 | Put Nginx in front | **Checkpoint 3**, includes the deliberate 502 |
| 28:30 | HTTPS with Certbot | **Checkpoint 4**, staging dry run first |
| 32:30 | Verify production and survive a reboot | Routes, headers, reboot |
| 35:00 | Optional: Claude Code as a guarded assistant | Short, clearly optional |
| 37:30 | Deploy an update and wrap up | The loop viewers will actually repeat |

---

## 0:00 Cold open: this only runs on my laptop

**On screen:** Terminal in the portfolio repository on your laptop. Run `npm run dev`. Browser opens `http://localhost:3000`. Click Home, Products, one case study, Contact. Keep the tour under thirty seconds.

**Say:**

> This is my portfolio. It is a Next.js 16 app, and right now it exists in exactly one place: on this laptop, at localhost 3000. Nobody else can see it.
>
> By the end of this video it will be live at eclarkhalid dot com, over HTTPS, on a Linux server that I control. Not Vercel. Not Netlify. A plain Ubuntu machine, with Nginx in front of it, systemd keeping it alive, and a free certificate that renews itself.
>
> I am going to build this in layers and test every layer before I add the next one. Something will break along the way. When it does, you will see exactly how I work out which layer broke. That skill is worth more than any single command in this video.

`CUT` Trim the page tour to the three most visual pages.

`EDIT` Optional result-first hook. After the final chapter is recorded, cut five seconds of the live HTTPS site with the padlock into the very first frames, before "This is my portfolio". It is the strongest hook available and costs nothing extra to record.

---

## 0:45 The architecture in sixty seconds

**On screen:** A plain text diagram, either typed live or shown as a title card.

```text
Visitor
  -> HTTPS on ports 80 and 443
  -> Nginx reverse proxy
  -> Next.js standalone server on 127.0.0.1:3000
  -> systemd keeps the Node.js process running
```

**Say:**

> Four moving parts.
>
> Nginx is the only thing the internet talks to. It accepts requests on ports 80 and 443 and forwards them to a program running privately on the same machine.
>
> That program is the Next.js server, running as an ordinary Node process. It listens on 127.0.0.1, port 3000. That address is only reachable from inside the server itself, so nothing can hit the app directly.
>
> systemd is the Linux service manager. It starts the app at boot, restarts it if it crashes, and captures the logs.
>
> And Certbot gets the TLS certificate that makes the padlock appear.
>
> Two things I am deliberately not doing. I am not running the dev server in production. `next dev` is for editing, not for traffic. And I am not doing a static export, because this site has a contact form that runs a Server Action, and image optimisation that needs a Node runtime. Most of the pages are static, but the app still needs a server behind it. That is what we are building.

`CUT` Nothing. This chapter should stay tight.

---

## 2:00 Buy the VPS and point the domain at it

### Beat 1: checkout

**On screen:** Provider checkout, cropped so account and billing details never appear. Select Ubuntu 24.04 LTS, 2 vCPU, 4 GB RAM, a nearby region. Add the SSH public key if the provider offers it. Name the server `portfolio-prod`. Copy the IP.

**Say:**

> A VPS is a slice of a physical machine in a data centre that behaves like your own Linux computer, with its own public IP address and full root access. Any reputable provider works. The Linux steps are identical.
>
> Ubuntu 24.04, because it is a long term support release and receives security updates for five years. Two CPUs and four gigabytes of memory. The finished site runs in far less than that, but building Next.js on the server needs memory, and I would rather not have the build killed on camera.
>
> Copy the public IP address. That is the one thing you need from this page.

`CUT` Payment and confirmation screens entirely. Blur the IP if you do not want it public forever.

### Beat 2: DNS records

**On screen:** DNS provider. Add two A records: `@` and `www`, both pointing at SERVER_IP, TTL 300.

**Say:**

> Two A records. An A record maps a hostname to an IPv4 address. The at sign means the bare domain, and www means the www subdomain.
>
> I am setting the TTL to 300 seconds. TTL is how long other DNS servers are allowed to cache an answer before asking again. A short TTL means my changes become visible faster while I am setting this up.

### Beat 3: verify properly

**On screen:** Local terminal.

```bash
dig +short NS eclarkhalid.com
dig +short @$(dig +short NS eclarkhalid.com | head -1) eclarkhalid.com A
dig +short @1.1.1.1 eclarkhalid.com A
dig +short @8.8.8.8 eclarkhalid.com A
```

**Say:**

> Do not trust a single lookup from your laptop. It asks whichever resolver your machine happens to use, and that resolver may be serving a cached answer from before you made the change.
>
> The first command finds the authoritative nameservers, the machines that hold the real answer for this domain. The second asks one of them directly, bypassing every cache in between. The last two ask Cloudflare and Google, which is a good proxy for what visitors and Let's Encrypt will see.
>
> All four print my server's IP. If the authoritative answer is correct, DNS is correct, whatever any individual cache says. And we do not request a certificate until this is true.

`CUT` If propagation is slow, cut the wait and say in one sentence that you waited.

---

## 5:00 Connect and create a deploy user

### Beat 1: first connection

**On screen:** Local terminal.

```bash
ssh portfolio-prod
hostname
whoami
cat /etc/os-release
```

**Say:**

> SSH is Secure Shell: an encrypted remote login. Everything I type goes to the server and the output comes back over an encrypted channel.
>
> I am connecting through an alias I set up beforehand. The alias points at the server's IP and uses a dedicated private key on this laptop, with the matching public key on the server. Key-based login is both easier and far safer than a password.
>
> Right now this alias logs me in as root. That is fine for setup. It is not fine for running a website, and I will fix it in a moment.

### Beat 2: why not root

**On screen:**

```bash
adduser deploy
usermod -aG sudo,www-data deploy
```

**Say:**

> Root can destroy the system with a single mistyped command, and anything root runs inherits that power. So I am creating a dedicated `deploy` account for the application.
>
> Two groups. `sudo` lets it escalate deliberately when it needs to. `www-data` is the group Nginx runs as, which keeps file permissions simple between the two.

`CUT` The password prompts in `adduser`. Never show the password being typed, even as asterisks.

### Beat 3: copy the SSH keys

**On screen:**

```bash
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
```

**Say:**

> This creates the ssh directory readable only by its owner, copies the public keys that were already trusted for root, and locks the file down to owner read and write.
>
> The permissions are not optional. SSH deliberately refuses to use these files if anyone else can read them.

### Beat 4: prove it in a second terminal

**On screen:** Open a second terminal side by side. Keep the root session visible.

```bash
ssh deploy@portfolio-prod
sudo whoami
```

Then, on the laptop, edit `~/.ssh/config` and change `User root` to `User deploy` under `Host portfolio-prod`. Then:

```bash
ssh portfolio-prod
whoami
```

**Say:**

> This is the rule for the whole video: never close a working session until the new one is proven. In the second terminal I log in as deploy, and `sudo whoami` prints root, so escalation works.
>
> Now I flip the alias on my laptop from root to deploy. From here on, `ssh portfolio-prod` lands me in the deploy account, and root is only for emergencies.

`KEEP` The side-by-side terminals. It is the visual for "prove it before you rely on it."

---

## 8:30 Update Ubuntu, install packages, turn on the firewall

### Beat 1: update and install

**On screen:**

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y ca-certificates curl git nginx snapd
sudo systemctl status nginx --no-pager
```

**Say:**

> `apt update` refreshes the catalogue of available packages. It changes nothing on disk. `apt upgrade` then installs the newer versions, which is how you pick up security fixes.
>
> Then the tools this deployment needs: certificates so the server can validate HTTPS connections, curl, git to fetch the code, Nginx as the web server, and snapd because Certbot ships as a snap.
>
> Nginx is already running. Ubuntu starts it on install. We will replace its default site later.

`CUT` The upgrade output. Speed-ramp or jump-cut to the finished prompt.

### Beat 2: check the server's own resolver

**On screen:**

```bash
resolvectl status | grep -i "current dns"
getent hosts eclarkhalid.com
dig +short @1.1.1.1 eclarkhalid.com A
```

**Say:**

> One check that saves a lot of confusion later. Some providers give the server their own DNS resolver, and those are occasionally stale. That does not affect visitors, but it makes every test I run from this machine fail for no obvious reason.
>
> `getent` is what this server thinks the domain resolves to. The `dig` at Cloudflare is what the rest of the world thinks. They agree, so I move on. If they disagree, the fix is in the guide, and it is a one-line `resolvectl` change.

`CUT` If they agree, cut this beat to ten seconds. If they disagree, `KEEP` it and apply the fix from the guide on camera.

### Beat 3: firewall

**On screen:**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

**Say:**

> UFW is Ubuntu's simplified firewall. Once enabled it denies every incoming connection by default, so I must allow what I need before I turn it on. OpenSSH opens port 22 so I do not lock myself out. Nginx Full is a shorthand for ports 80 and 443.
>
> Order matters here. Allow SSH first, enable second. And keep your provider's web console open until you have confirmed you can still connect, because that console is your only way back in if this goes wrong.
>
> Notice there is no rule for port 3000. The Next.js process listens on the loopback address, which was never reachable from outside. There is nothing for the firewall to block.

`KEEP` The `ufw status verbose` output on screen for a beat. It is the proof.

---

## 11:30 Install Node.js 24

**On screen:**

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/nodesource_setup.sh
less /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs
node --version
npm --version
which node
```

**Say:**

> This project needs Node 20.9 or newer. I am using the current Node 24 LTS line.
>
> You have probably seen the one-liner that pipes a download straight into `sudo bash`. That runs a script from the internet as root without you ever seeing it. I download it first, open it, and then run it. Same result, but I got to look at what I was trusting.
>
> The script adds NodeSource's package repository and signing key. After that, `apt install nodejs` pulls Node from there instead of Ubuntu's older default.
>
> And `which node` prints `/usr/bin/node`. That path matters, because the systemd service file we install later hardcodes it. If your path differs, edit the service file before you install it.

`CUT` Scrolling through the script in `less`. Show the top, scroll once, quit. Cut the apt output.

---

## 13:30 Push, clone and create the environment file

### Beat 1: push from the laptop

**On screen:** Local terminal in the repository.

```bash
git status --short --branch
git log --oneline -3
git push
```

Then open `https://github.com/Eclarkhalid/portfolio` in a signed-out browser tab and show the latest commit.

**Say:**

> The server is never going to pull from my laptop. GitHub is the bridge. So the first step in getting code onto the server is making sure the code is on GitHub.
>
> Clean working tree, latest commit, push. And there it is in a signed-out browser, which also proves the repository is public.

### Beat 2: clone on the server

**On screen:** Server terminal as deploy.

```bash
sudo mkdir -p /var/www/eclarkhalid.com
sudo chown deploy:www-data /var/www/eclarkhalid.com
cd /var/www/eclarkhalid.com
git clone https://github.com/Eclarkhalid/portfolio.git app
cd app
git remote -v
git status --short --branch
```

**Say:**

> I create the parent directory as root, hand it to the deploy user and the www-data group so deploy can write there without sudo, then clone.
>
> The directory name is not a style choice. It has to be `app`, because the systemd unit in this repository hardcodes the path `/var/www/eclarkhalid.com/app`. Clone it anywhere else and the service will not start until you edit the unit to match.
>
> This repository is public, so cloning over HTTPS needs no credentials at all. GitHub stopped accepting account passwords for Git years ago anyway. If your repository is private, use a read-only deploy key. That is a key registered against one repository, so a compromised server exposes that one repository and nothing else. The exact steps are in the guide.

### Beat 3: the environment file

**On screen:**

```bash
install -m 600 /dev/null .env.production
nano .env.production
```

Type the template. Leave the Resend values blank on camera.

```dotenv
RESEND_API_KEY=
CONTACT_FROM="Eclar Khalid <contact@eclarkhalid.com>"
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
```

Save, then:

```bash
stat -c '%a %U %G %n' .env.production
```

**Say:**

> `install -m 600 /dev/null` creates an empty file that only its owner can read or write, in one step. The secrets I am about to add are never, even briefly, readable by anyone else.
>
> Two kinds of value live here. The Resend key and sender are read at runtime by the contact form's Server Action. The search engine verification tokens are baked into the HTML at build time, so they have to exist before we build.
>
> I am leaving Resend blank for now. This site is designed so that when email is not configured, the contact form shows my direct address instead of failing silently. Fail visibly, never lose a lead. When I add the key later, I restart the service and it picks it up.
>
> And `stat` confirms mode 600, owned by deploy. That is how you check a secret file on camera. Never `cat` it.

`CUT` Nothing that shows values. If you accidentally paste a real key, stop the recording and rotate the key.

---

## 17:00 Build and test Next.js on its own. Checkpoint 1

### Beat 1: install and gates

**On screen:**

```bash
npm ci
npm run typecheck
npm run lint
```

**Say:**

> `npm ci` installs the exact versions recorded in the lockfile and deletes node_modules first. Unlike `npm install` it will not silently upgrade anything, so the server gets precisely what I tested on my laptop.
>
> Then the project's two quality gates. Typecheck runs the TypeScript compiler without emitting files. Lint runs ESLint. If either fails, I stop here. A broken commit should fail fast, not after a five minute build.

`CUT` The `npm ci` progress bar. Jump to "added N packages".

### Beat 2: the standalone build

**On screen:**

```bash
npm run build:vps
```

Let the route table land on screen and pause on it.

```bash
test -f .next/standalone/server.js && echo "server.js ready"
test -d .next/standalone/public && echo "public assets ready"
test -d .next/standalone/.next/static && echo "Next static assets ready"
```

**Say:**

> This is a normal Next.js production build, with one flag set: standalone output. A normal build expects the whole project, including node_modules, to be present at runtime. Standalone traces exactly which files the server actually needs and copies them into `.next/standalone`, a self-contained bundle that runs with a plain `node server.js`.
>
> Look at the route table. Almost every page is static, prerendered at build time. The dynamic entries are the content editor routes, which return 404 in production. That is the boundary: static everywhere, a Node process only where a user action genuinely needs one.
>
> Next.js deliberately does not copy `public` or the static assets into the standalone folder, because many hosts serve those from a CDN. On a plain VPS we need them locally, and the `build:vps` script handles that copy. The three checks confirm all of it is in place.

`CUT` The compile wait. `KEEP` the route table for a full five seconds; it is the most informative frame in the chapter.

### Beat 3: run it by hand

**On screen:** First terminal.

```bash
cd /var/www/eclarkhalid.com/app/.next/standalone
HOSTNAME=127.0.0.1 PORT=3000 node server.js
```

Second terminal:

```bash
curl -I http://127.0.0.1:3000
curl -I http://127.0.0.1:3000/products
curl http://127.0.0.1:3000/robots.txt
```

Back to the first terminal, Ctrl+C.

**Say:**

> Before systemd, before Nginx, before the domain, I run the server by hand. `HOSTNAME=127.0.0.1` binds it to loopback only. `PORT=3000` is what Nginx will forward to later.
>
> From the second terminal, `curl -I` asks for headers only, so I see the status code without a screen full of HTML. 200 on the home page. 200 on products. And robots.txt comes back as real text.
>
> **Checkpoint one.** The application runs on this machine. Nothing else is involved yet. If this had failed, I would know the problem is in the app, not in the infrastructure, and that is the whole point of testing one layer at a time.

`KEEP` The moment the first 200 appears.

---

## 21:00 Keep it running with systemd. Checkpoint 2

### Beat 1: read the unit, then install it

**On screen:**

```bash
cd /var/www/eclarkhalid.com/app
cat deploy/systemd/eclarkhalid.service
```

Pause on the file. Then:

```bash
sudo cp deploy/systemd/eclarkhalid.service /etc/systemd/system/eclarkhalid.service
sudo systemctl daemon-reload
sudo systemctl enable --now eclarkhalid
sudo systemctl status eclarkhalid --no-pager
```

**Say:**

> The repository ships a service file. Four lines worth reading before you install anything. `User=deploy`, so it never runs as root. `Restart=always`, so it comes back if it crashes. `EnvironmentFile` points at the secrets file we just created. And the Protect lines restrict what the process can touch on the filesystem even if it is compromised.
>
> Copy it into the directory systemd reads. `daemon-reload` tells systemd to re-read its configuration. `enable --now` does two things at once: starts it immediately, and registers it to start at boot. Skip `enable` and the site dies at the first reboot.
>
> Active, running, and the log shows the same startup line we saw by hand.

### Beat 2: confirm it is really systemd

**On screen:**

```bash
sudo journalctl -u eclarkhalid -n 50 --no-pager
curl -I http://127.0.0.1:3000
systemctl is-active eclarkhalid
ss -ltnp | grep :3000
```

**Say:**

> `journalctl` is the query tool for systemd's logs. Anything the app writes to stdout or stderr lands here automatically, and the `-u` flag filters to this one service.
>
> And `ss` shows who owns port 3000. It should be the service, not a forgotten foreground process from the last chapter. If it were the wrong one, the reboot test at the end would fail and you would not know why.

### Beat 3: crash it on purpose

**On screen:**

```bash
systemctl show -p MainPID --value eclarkhalid
sudo kill -9 $(systemctl show -p MainPID --value eclarkhalid)
systemctl is-active eclarkhalid
sleep 6
systemctl is-active eclarkhalid
curl -I http://127.0.0.1:3000
```

**Say:**

> Now the part that matters. I am going to kill the Node process the hard way, signal nine, no chance to clean up. That is what a crash looks like.
>
> Immediately after, the service reports it is activating. Five seconds later, it is active again, with a new process ID, and the site answers.
>
> **Checkpoint two.** The app survives a crash without me touching it.

`KEEP` The whole beat. Do not cut the six second wait; let the viewer see `activating` turn into `active`.

---

## 24:30 Put Nginx in front. Checkpoint 3

### Beat 1: read the config, then install it

**On screen:**

```bash
cat deploy/nginx/eclarkhalid.com.conf
```

Pause. Then:

```bash
sudo cp deploy/nginx/eclarkhalid.com.conf /etc/nginx/sites-available/eclarkhalid.com
sudo ln -s /etc/nginx/sites-available/eclarkhalid.com /etc/nginx/sites-enabled/eclarkhalid.com
sudo unlink /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

**Say:**

> The Nginx config is short. It listens on port 80 for both hostnames, and everything under slash is proxied to 127.0.0.1 3000. It forwards the original host, the client IP and the protocol so the app knows who is really asking. And proxy buffering is off so Next.js streaming still works.
>
> Nginx keeps every site in `sites-available` and activates one by symlinking it into `sites-enabled`. Then I remove the default site, because it claims the default server slot and would answer requests mine should handle.
>
> `nginx -t` parses the config and reports errors without applying it. Always run it before a reload. And reload, not restart: reload starts fresh workers while existing connections finish, so no request is dropped.

### Beat 2: the loopback test

**On screen:**

```bash
curl -I http://127.0.0.1 -H 'Host: eclarkhalid.com'
```

**Say:**

> This is the single most useful command in the video. I connect to Nginx on this machine while claiming to be asking for eclarkhalid dot com. Nginx picks the server block from that Host header, so this proves the configuration works with no dependency on DNS at all.
>
> 200. Nginx is talking to Next.js.

### Beat 3: break it on purpose

**On screen:**

```bash
sudo systemctl stop eclarkhalid
curl -I http://127.0.0.1 -H 'Host: eclarkhalid.com'
sudo systemctl start eclarkhalid
curl -I http://127.0.0.1 -H 'Host: eclarkhalid.com'
```

**Say:**

> Let me show you the error you will meet most often. I stop the app and ask Nginx again.
>
> 502 Bad Gateway. Read that as: Nginx accepted the request and got nothing usable from the thing behind it. The visitor-facing layer is healthy. The application is not. So when you see a 502, you check the app first, every time. Start it again, and we are back to 200.

`KEEP` The 502. It is a planned failure and the most searchable moment in the video.

### Beat 4: the public domain

**On screen:**

```bash
curl -I http://eclarkhalid.com
```

Then open `http://eclarkhalid.com` in a browser. It will show the site over plain HTTP.

**Say:**

> Now the real thing, through DNS and the firewall. 200. And in a browser, there is the portfolio, on the real domain, for the first time.
>
> **Checkpoint three.** Requests from the internet reach the app. No padlock yet. That is next.
>
> If the loopback test passed but this one cannot connect, your server is fine and the problem is DNS or the firewall. The guide has a six-command diagnosis for exactly that, and the trick is reading how fast it fails. Refused in a few hundred milliseconds means something answered and rejected you, usually the wrong host. A timeout after several seconds means packets are being dropped, which points at a firewall.

---

## 28:30 HTTPS with Certbot. Checkpoint 4

### Beat 1: install and rehearse

**On screen:**

```bash
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/local/bin/certbot
sudo certbot --nginx -d eclarkhalid.com -d www.eclarkhalid.com --redirect --dry-run
```

**Say:**

> Certbot ships as a snap so it stays current independently of Ubuntu's release cycle. The classic flag gives it the access it needs to edit Nginx configuration.
>
> Here is how a free certificate works. Let's Encrypt needs proof I control this domain. Certbot places a file on my server, and Let's Encrypt fetches it over plain HTTP. That is why DNS had to be right and port 80 had to be open before this step. It is also why the earlier loopback test is not enough: validation happens from their infrastructure, not mine.
>
> And before I ask for a real certificate, I rehearse. Let's Encrypt rate-limits duplicate certificates for the same hostnames per week. If you fumble this step a few times on camera, you can lock yourself out for days. The dry run proves DNS, firewall and Nginx are all correct against their staging servers, without spending any of that allowance.

`CUT` The snap download.

### Beat 2: the real certificate

**On screen:**

```bash
sudo certbot --nginx \
  -d eclarkhalid.com \
  -d www.eclarkhalid.com \
  --redirect
```

Answer the email and terms prompts. Then:

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

Open `https://eclarkhalid.com` in the browser and click the padlock.

**Say:**

> Same command without the dry run. Certbot obtains one certificate covering both hostnames, writes a port 443 server block into my Nginx config, and with the redirect flag sends all plain HTTP traffic to HTTPS.
>
> One side effect to remember. Certbot has just rewritten the Nginx file on this server. It no longer matches the template in the repository. Do not blindly copy the repository version over it later, or you will delete your TLS configuration.
>
> Certificates last ninety days. The snap installed a timer that tries renewal twice a day and only acts when expiry is near. The dry run proves that mechanism works now, instead of finding out it does not in three months.
>
> **Checkpoint four.** The padlock. Valid certificate, both names, automatic renewal verified.

`KEEP` The padlock click and the certificate details.

---

## 32:30 Verify production and survive a reboot

### Beat 1: the checklist

**On screen:**

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

Then, in the browser: open `/this-page-does-not-exist` to show the custom 404, open the contact page to show the direct-email fallback, and open the browser's network panel on the home page to show the response headers.

**Say:**

> A deployment is not done when the home page loads. Every important route, a real 404 with the custom page, robots, sitemap, the RSS feed. In the browser, the contact form shows my direct email, because Resend is not configured yet. That is the graceful fallback doing its job.
>
> And the response headers: strict transport security, a content security policy, no frame embedding, and no `X-Powered-By` announcing the framework. Those come from the app itself, not from Nginx, so they travel with the code.
>
> Also notice that the earlier loopback test would now return 301 instead of 200. That is the HTTPS redirect working, not a regression.

`CUT` Collapse the nine curls into a fast sequence. Show the codes, not the full output.

### Beat 2: reboot

**On screen:**

```bash
sudo reboot
```

Wait. Try `ssh portfolio-prod` once too early so it prints `Connection refused`. Then reconnect:

```bash
sudo systemctl is-active eclarkhalid
sudo systemctl is-active nginx
curl -I https://eclarkhalid.com
uptime -p
```

**Say:**

> The final test for any server: turn it off and on again, and see what comes back on its own.
>
> For the first thirty seconds or so, SSH will say connection refused. That is normal. The network stack comes up before the SSH daemon does. And the wording matters. Refused means the machine answered and nothing is listening yet. Timed out would mean nothing answered at all.
>
> Back in. The app is active. Nginx is active. The site answers over HTTPS. And uptime says this machine has been up for under a minute. Nobody started anything by hand.

`KEEP` The refused attempt. `CUT` the rest of the wait.

---

## 35:00 Optional: Claude Code as a guarded debugging assistant

Say clearly on screen and in the narration that this chapter is optional. A viewer who skips it loses nothing from the deployment.

### Beat 1: install as deploy, never root

**On screen:**

```bash
mkdir -p "$HOME/.local/npm"
npm config set prefix "$HOME/.local/npm"
echo 'export PATH="$HOME/.local/npm/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/.local/npm/bin:$PATH"
npm install -g @anthropic-ai/claude-code
claude doctor
cd /var/www/eclarkhalid.com/app
claude
```

**Say:**

> This part is optional. If you only came for the deployment, you already have it. Skip to the next chapter.
>
> I keep an AI assistant on the server for one job: helping me read logs and diagnose problems when something breaks at an inconvenient hour. It is not part of the site. The site runs exactly the same when this is closed.
>
> Two rules before it goes anywhere near production. It runs as the deploy user, never root, installed into a user-owned npm directory so nothing needs sudo. And the very first thing I paste is a set of constraints.

`CUT` The entire authentication flow. Pause the recording, sign in, resume. Never show the login URL, the code, or account details.

### Beat 2: the constraints

**On screen:** Paste this as the first prompt. Show it on screen long enough to read the numbered rules.

```text
You are inside the production VPS checkout for eclarkhalid.com.

Your role is to help diagnose deployment issues safely. Read AGENTS.md and docs/VPS_DEPLOYMENT_GUIDE.md before advising.

Production safety rules:

1. Begin with read-only investigation.
2. Never read, print, copy, summarize, or expose .env.production, any .env file, credentials, private SSH keys, tokens, or secrets.
3. Do not edit files or run commands that change the server unless I explicitly approve the exact action.
4. Do not run git pull, git reset, git checkout, npm install, apt commands, systemctl restart, nginx reload, firewall commands, chmod, or chown without approval.
5. Do not push commits from this production server.
6. Before proposing a fix, explain the evidence, likely cause, affected service, exact command, risk, and rollback.
7. Prefer read-only checks such as git status, git log, version checks, systemctl status, journalctl logs, nginx configuration tests, process inspection, disk and memory usage, and localhost HTTP checks.
8. Never use dangerously-skip-permissions.

Acknowledge these rules and wait for a debugging issue.
```

**Say:**

> Read-only first. Never touch the secrets file. Nothing that changes the server without my explicit approval of the exact command. And before any fix, it has to show me the evidence, the risk and the rollback. An assistant on a production box is only as safe as the rules you give it, so the rules go in before the first question.

### Beat 3: one read-only question

**On screen:** Ask:

```text
Check whether the eclarkhalid service is healthy and summarise the last 20 log lines. Read-only only.
```

Let it run `systemctl status` and `journalctl`, and read its summary.

**Say:**

> One question, read-only. It checks the service, reads the journal, and tells me what it sees in plain language. That is the whole use case: a second pair of eyes on the logs, with the guardrails on. When I close it, nothing on this server has changed.

`CUT` Any long thinking pauses. Keep the commands it runs visible.

---

## 37:30 Deploy an update and wrap up

### Beat 1: a real change, on the laptop

**On screen:** Local editor. Open one article, for example `content/articles/static-first-professional-sites.mdx`, and add an `updated` line to the frontmatter under `published`:

```yaml
updated: 2026-09-06
```

Then:

```bash
npm run typecheck
git add content/articles/static-first-professional-sites.mdx
git commit -m "content: mark static-first article as updated"
git push
```

**Say:**

> Deploying once is a milestone. Deploying the tenth time is the workflow. So here is the loop.
>
> A small, real change: I mark one article as updated. That single line changes the article page, the sitemap and the feed, because on this site all of that is derived from the content file. Commit, push. GitHub has it.

### Beat 2: pull, gate, build, restart

**On screen:** Server terminal.

```bash
ssh portfolio-prod
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

Open the article in the browser and show the "Updated" line under the title.

**Say:**

> `git status` first, so I notice any accidental edits made on the server before they get destroyed. `pull --ff-only` refuses to merge: either it fast-forwards cleanly or it stops and tells me something needs attention. I never run `git reset --hard` as a routine step. If the pull refuses, I look at why.
>
> Then the same gates and the same build as the first time. Restart, because the running process holds the old build in memory. Two curls, one at the app and one at the public domain, both 200.
>
> And in the browser, the article now shows its updated date. Laptop to live, in one loop, with the checks in the right order.

`CUT` The `npm ci` and build waits, again.

### Beat 3: close

**On screen:** The live site on the home page. Then a simple recap card.

```text
VPS purchased
DNS connected
Server secured
Node.js installed
Repository cloned
Production build created
systemd configured
Nginx configured
HTTPS enabled
Deployment verified
```

**Say:**

> At the start of this video, this site existed on one laptop. Now it runs on infrastructure I control, restarts itself if it crashes, comes back after a reboot, serves HTTPS with a certificate that renews on its own, and updates with one predictable loop.
>
> And every layer was tested before the next one went on. Next.js before systemd. systemd before Nginx. HTTP before HTTPS. If you remember one thing, remember that order. It is how you turn "the site is down" into "I know exactly which layer to look at."
>
> In the next video, I will automate this loop so a push to GitHub deploys to the VPS safely, with the same gates in front of it. The full command reference is linked below. Thanks for watching.

`EDIT` End screen: the next-video placeholder on the right, the repository link on the left, twenty seconds.

---

## Publishing package

### Title

Primary:

**Deploy a Next.js App to a VPS from Localhost to HTTPS (Beginner Guide)**

Alternates:

- Deploy a Next.js App to a VPS, Complete Beginner Guide with Nginx and HTTPS
- Self-Host Next.js on Ubuntu: systemd, Nginx and Free SSL, Step by Step
- Next.js VPS Deployment: Local to Live with Nginx and HTTPS

### Thumbnail

Left: the terminal with `localhost:3000`. Right: the live site with the padlock. Text, two lines, shorter than the title:

```text
LOCALHOST TO LIVE
NEXT.JS ON A VPS
```

Avoid command text on the thumbnail. One face-free composition is fine for this channel.

### Description

```text
Take a Next.js 16 app from localhost to a live HTTPS site on a plain Ubuntu VPS, with no platform in between. We build it in layers and test each one: Next.js on its own, then systemd to keep it alive, then Nginx in front, then a free Let's Encrypt certificate that renews itself. Two failures are left in on purpose so you see how to diagnose them.

Chapters
0:00 This only runs on my laptop
0:45 The architecture in sixty seconds
2:00 Buy the VPS and point the domain at it
5:00 Connect and create a deploy user
8:30 Update Ubuntu, packages and firewall
11:30 Install Node.js 24
13:30 Push, clone and create the environment file
17:00 Build and test Next.js on its own (Checkpoint 1)
21:00 Keep it running with systemd (Checkpoint 2)
24:30 Put Nginx in front (Checkpoint 3)
28:30 HTTPS with Certbot (Checkpoint 4)
32:30 Verify production and survive a reboot
35:00 Optional: Claude Code as a guarded debugging assistant
37:30 Deploy an update and wrap up

Command reference (every command in the video, in order):
https://github.com/Eclarkhalid/portfolio/blob/main/docs/VPS_DEPLOYMENT_GUIDE.md

The site: https://eclarkhalid.com
Source: https://github.com/Eclarkhalid/portfolio

References
Next.js self-hosting: https://nextjs.org/docs/app/guides/self-hosting
Next.js standalone output: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
NodeSource distributions: https://github.com/nodesource/distributions
Certbot for Nginx: https://certbot.eff.org/instructions?os=snap&ws=nginx
Let's Encrypt rate limits: https://letsencrypt.org/docs/rate-limits/
GitHub deploy keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys
```

### Pinned comment

```text
Every command, in order, with a "what this does" note under each one:
https://github.com/Eclarkhalid/portfolio/blob/main/docs/VPS_DEPLOYMENT_GUIDE.md

Three things people get wrong most often:
1. Enabling UFW before allowing SSH. Allow first, enable second, keep the provider console open.
2. Requesting the real certificate before DNS is right. Run the --dry-run first; Let's Encrypt rate-limits retries.
3. Cloning into a directory that is not named "app". The systemd unit hardcodes the path.

Got a 502? Check the app before Nginx: sudo journalctl -u eclarkhalid -n 100 --no-pager
```

### Tags

```text
next.js, nextjs deploy, deploy nextjs vps, self host nextjs, nextjs ubuntu, nginx reverse proxy, systemd node, certbot nginx, lets encrypt, nextjs 16, nextjs standalone, vps deployment, ubuntu 24.04, node.js 24, nextjs production
```

### End screen

Right: next video placeholder, "Deploy Next.js automatically from GitHub Actions". Left: this video's repository link card. Twenty seconds over the recap card.

---

## Pre-recording checklist

Do these before the first take. The full list with rationale is in `docs/YOUTUBE_VIDEO_RUNBOOK.md`.

- [ ] Local `main` is reconciled with `origin/main` and pushed. The server clones from GitHub, so the commit you demo must already be there.
- [ ] `https://github.com/Eclarkhalid/portfolio` opens in a signed-out browser and shows that commit.
- [ ] `npm run dev` works locally for the cold open.
- [ ] `ssh portfolio-prod` connects with the dedicated key as root, and the alias is ready to flip to deploy.
- [ ] DNS for `eclarkhalid.com` and `www` can be edited during the recording.
- [ ] Terminal font and browser zoom are large enough for 1080p. Desktop notifications are off.
- [ ] A second SSH terminal is open before any firewall or SSH change.
- [ ] Placeholder values are prepared so no password, token, API key or private key appears on screen.
- [ ] Claude Code login is prepared so the recording can pause cleanly during authentication.
- [ ] This script is open on a second monitor.

### Never on screen

- Root or user passwords, including asterisks while typing
- Provider API keys, billing or account pages
- GitHub personal access tokens
- Private SSH keys, `~/.ssh/config` contents beyond the one alias block
- Resend API keys or the real contents of `.env.production`
- Claude login URLs, authorization codes or account details
- Recovery codes

---

## Edit notes

Cut list, in priority order:

1. Every install and build wait: `apt upgrade`, `npm ci`, `npm run build:vps`, `snap install`. Jump-cut to the finished prompt or speed-ramp with a short label.
2. Provider payment and confirmation screens.
3. Scrolling through the NodeSource script. Top, one scroll, quit.
4. The Claude Code authentication flow, in full.
5. DNS propagation, if it is slow.
6. The reboot wait after the first `Connection refused`.

Keep list, never cut:

1. The four checkpoint moments and their title cards.
2. The second-terminal proof of the deploy login.
3. The kill-and-restart demo, including the six second wait.
4. The deliberate 502 and its recovery.
5. The first `Connection refused` after reboot.
6. The route table after `build:vps`, held for five seconds.

If the edit runs long, shorten narration in chapters 2, 8 and 11 first. Do not shorten 17, 21, 24 or 28.
