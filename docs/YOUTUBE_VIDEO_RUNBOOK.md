# YouTube runbook: deploy a Next.js app to a VPS

Use this as the filming outline. The exact copyable commands live in `docs/VPS_DEPLOYMENT_GUIDE.md`.

## Confirmed setup for this recording

Use these values throughout the demonstration:

```text
Local VPS alias: portfolio-prod
GitHub repository: https://github.com/Eclarkhalid/portfolio
Repository visibility: public
Application directory: /var/www/eclarkhalid.com/app
Deployment user: deploy
systemd service: eclarkhalid
```

There are three separate authentication boundaries:

1. Your local Ubuntu terminal connects to the VPS using the dedicated `portfolio_deploy` SSH key and the `portfolio-prod` alias.
2. The VPS clones the public GitHub repository over HTTPS without a username, password, token, or GitHub SSH key.
3. Claude Code authenticates separately through the Claude login flow.

GitHub account passwords are not used for Git operations. If the repository becomes private later, use the read-only GitHub deploy-key procedure in `docs/VPS_DEPLOYMENT_GUIDE.md`.

## Video promise

By the end of the video, the viewer will have purchased an Ubuntu VPS, deployed a real Next.js 16 application, kept it running with systemd, placed Nginx in front of it, connected a domain, and enabled HTTPS.

## Suggested title

**Deploy a Next.js App to a VPS, Complete Beginner Guide with Nginx and HTTPS**

Alternatives:

- **Next.js VPS Deployment from Zero to Production**
- **How to Self-Host Next.js on Ubuntu with Nginx, systemd and SSL**

## Suggested thumbnail words

Keep the thumbnail shorter than the title:

```text
NEXT.JS TO VPS
ZERO TO LIVE
```

Show the finished portfolio on one side and a terminal or server icon on the other. Avoid filling the thumbnail with command text.

## Before recording

- [ ] Decide which VPS provider will be shown.
- [ ] Confirm the provider offers Ubuntu 24.04 LTS and a public IPv4 address.
- [ ] Confirm the GitHub repository exists and contains the final commit.
- [ ] Confirm `https://github.com/Eclarkhalid/portfolio` is public and opens in a signed-out browser.
- [ ] Confirm `ssh portfolio-prod` connects using the dedicated SSH key.
- [ ] Prepare the Claude Code login before recording, or pause the recording during authentication.
- [ ] Confirm `eclarkhalid.com` DNS can be edited during the recording.
- [ ] Log out of unrelated dashboards and close private browser tabs.
- [ ] Increase terminal font size and browser zoom for viewers.
- [ ] Turn off desktop notifications.
- [ ] Prepare placeholder text so no password, token, API key, or private SSH key appears on screen.
- [ ] Keep a second SSH session open before changing firewall or SSH settings.
- [ ] Open `docs/VPS_DEPLOYMENT_GUIDE.md` on a second monitor.

## Recording safety

Safe to show:

- The VPS public IP if you are comfortable with it being permanently public
- A public SSH key
- The repository URL
- Nginx and systemd configuration
- Public DNS records

Do not show:

- Root or user passwords
- VPS provider API keys
- GitHub personal access tokens
- Private SSH keys
- Resend API keys
- The real contents of `.env.production`
- Recovery codes or billing information
- Claude login URLs, authorization codes, session credentials, or account details

Use the provider console only when required. Crop or blur billing and account details.

## Suggested chapter flow

### 00:00 Show the result first

Open `https://eclarkhalid.com` and explain:

- This is a real Next.js 16 portfolio.
- Most pages are statically generated for speed and SEO.
- The contact form and image optimization still require the Node.js server.
- The final stack will be Ubuntu, Node.js, systemd, Nginx, and HTTPS.

Keep this preview under one minute. Viewers should immediately understand what they will build.

### 00:50 Explain the architecture

Draw or state the request path:

```text
Browser -> Nginx -> Next.js on localhost:3000
```

Key teaching point: never expose the Next.js development server to production traffic. Build the application, run the production server, and put a reverse proxy in front of it.

### 02:30 Buy the VPS

Show:

1. Select Ubuntu 24.04 LTS.
2. Select 2 vCPUs and 4 GB RAM for a smooth server-side build.
3. Choose a nearby region.
4. Add an SSH key if available.
5. Purchase the VPS and copy the IP address.

Explain that a smaller server may run the finished app, but the build process needs more memory than steady-state traffic.

### 06:00 Configure DNS

Create the apex and `www` A records. Explain that HTTPS issuance must wait until DNS points to the new server.

Use:

```bash
nslookup eclarkhalid.com
nslookup www.eclarkhalid.com
```

### 08:00 Connect and create a safer user

Connect using the alias already configured on the local Ubuntu terminal:

```bash
ssh portfolio-prod
```

The alias initially logs in as `root` using `~/.ssh/portfolio_deploy`. Confirm the server and current user:

```bash
hostname
whoami
lsb_release -a
```

Create the application user if it does not exist:

```bash
adduser deploy
usermod -aG sudo deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
```

Keep the root session open. In a second local terminal, test the same key as `deploy`:

```bash
ssh deploy@portfolio-prod
sudo whoami
```

The final command should print `root`. After that succeeds, change `User root` to `User deploy` under `Host portfolio-prod` in the local `~/.ssh/config`, then verify:

```bash
ssh portfolio-prod
whoami
```

The final command should now print `deploy`.

Teaching point: use root for initial setup only. Run the application as a non-root user.

### 12:00 Update Ubuntu and configure the firewall

Install Nginx, Git, Curl, and Snap. Open SSH plus Nginx in UFW.

Teaching point: do not open port 3000 publicly. Nginx is the only public entry point for the app.

### 16:00 Install Node.js 24 LTS

Download and inspect the NodeSource setup script, then install Node.js.

Show:

```bash
node --version
npm --version
which node
```

Explain that this Next.js version requires Node.js 20.9 or newer and the tutorial standardizes on Node.js 24 LTS.

### 19:00 Clone from GitHub

This portfolio repository is public, so clone it over HTTPS without credentials:

```bash
sudo mkdir -p /var/www/eclarkhalid.com
sudo chown deploy:www-data /var/www/eclarkhalid.com
cd /var/www/eclarkhalid.com
git clone https://github.com/Eclarkhalid/portfolio.git app
cd app
git remote -v
git status --short --branch
```

Narration:

> GitHub account passwords are no longer accepted for authenticated Git operations. This repository is public, so HTTPS cloning and pulling require no credentials. For a private production repository, use a separate read-only deploy key instead of a personal password or token.

Do not reuse `~/.ssh/portfolio_deploy` for GitHub. That key connects the local computer to the VPS. A private repository would receive a separate server-to-GitHub key.

Teaching point: never paste a personal access token into a recorded terminal. A deploy key can be limited to one repository and kept read-only.

### 23:00 Install Claude Code as a guarded debugging assistant

Run Claude Code as `deploy`, never as `root`. First confirm Node.js and npm are available:

```bash
node --version
npm --version
```

Configure a user-owned npm location and install Claude Code without `sudo`:

```bash
mkdir -p "$HOME/.local/npm"
npm config set prefix "$HOME/.local/npm"
echo 'export PATH="$HOME/.local/npm/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/.local/npm/bin:$PATH"
npm install -g @anthropic-ai/claude-code
claude doctor
```

Start Claude Code from the portfolio checkout:

```bash
cd /var/www/eclarkhalid.com/app
claude
```

Pause or crop the recording during Claude authentication. Do not expose the login URL, authorization code, account details, or stored credentials.

Paste this production-safe instruction as the first prompt:

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

Claude is a backup debugging assistant, not part of the application runtime. The portfolio must continue running normally when Claude Code is closed.

### 27:00 Configure environment variables

Create `.env.production` without revealing real values.

Explain the two categories:

- `RESEND_API_KEY` and `CONTACT_FROM` are used by the contact Server Action at runtime.
- Search-engine verification tokens influence generated metadata and must exist before the build.

### 30:00 Run the quality gates

```bash
npm ci
npm run typecheck
npm run lint
npm run build:vps
```

Explain what `build:vps` does:

1. Requests Next.js standalone output.
2. Runs the production build and content validation.
3. Copies `public` and `.next/static` into the standalone runtime.

Show the route table from the build. Point out static pages, SSG detail routes, and the contact/server execution boundary.

### 35:00 Test the standalone server

Run `server.js` in the foreground and test it from a second SSH session with Curl.

Teaching point: verify each layer before adding the next one. Test Next.js before systemd, systemd before Nginx, and HTTP before HTTPS.

### 38:00 Keep the app running with systemd

Install the supplied service file, enable it, and inspect logs.

Show:

```bash
sudo systemctl status eclarkhalid --no-pager
sudo journalctl -u eclarkhalid -n 50 --no-pager
```

Explain that systemd starts the app after reboot and restarts it after a crash.

### 42:00 Put Nginx in front

Install the supplied Nginx configuration, run `nginx -t`, and reload.

Teaching points:

- Nginx listens publicly on ports 80 and 443.
- Next.js listens only on `127.0.0.1:3000`.
- Nginx forwards the host, client IP, and protocol.
- The configuration disables proxy buffering so App Router streaming remains possible.

### 46:00 Add HTTPS

Install Certbot through Snap and request certificates for the apex and `www` names.

Run the renewal dry test. Explain that HTTPS is not finished until automatic renewal is verified.

### 50:00 Production verification

Show the live portfolio and test the technical endpoints:

- `/robots.txt`
- `/sitemap.xml`
- `/rss.xml`
- a missing URL for the custom 404
- browser response headers

Submit the contact form only if Resend is configured. Otherwise demonstrate the direct-email fallback and explain why graceful failure is better than silently losing a lead.

### 54:00 Show how to deploy an update

Walk through:

```bash
git pull --ff-only
npm ci
npm run typecheck
npm run lint
npm run build:vps
sudo systemctl restart eclarkhalid
```

Explain why the app is rebuilt before the service restart. Mention that a later video can introduce release directories, health-checked switching, and automated CI/CD.

### 57:00 Closing summary

Recap:

- VPS purchased
- DNS connected
- Server secured
- Node.js installed
- Repository cloned
- Production build created
- systemd configured
- Nginx configured
- HTTPS enabled
- Deployment verified

Suggested closing line:

> You now have a real Next.js application running on infrastructure you control. In the next video, we can automate this deployment so a GitHub push updates the VPS safely.

## Portfolio demo route

Use this after deployment to show the application without wandering.

### 1. Home

Point out:

- The senior engineer and product founder positioning
- The blue-to-violet wave artwork
- The selected SpyGlow and Ryterr product stories
- The engineering decisions and writing sections
- The desktop sidebar and restrained visual system

### 2. Products

Open `/products`.

Point out:

- SpyGlow and Ryterr are active products.
- Product metadata and stack are content-driven.
- Shotsfolio appears only under Previous products.

Open one product detail page to show generated metadata and structured content.

### 3. Case studies

Open `/work`, then one case study.

Narrative:

- The site presents decisions and constraints, not a list of framework badges.
- The detail routes are generated at build time.

### 4. Writing

Open `/writing`, then one article.

Show:

- Build-time MDX content
- Article metadata
- Related content
- The generated social image route if useful

### 5. Experience and About

Open `/experience` and `/about` briefly. Keep the focus on evergreen technical leadership and product ownership.

### 6. Contact

Open `/contact`.

Explain:

- Validation runs through a Server Action.
- Basic bot and timing controls are included.
- Resend handles delivery when configured.
- A direct email fallback appears when the email provider is not configured.

Do not submit real personal data while recording unless the test is intentional.

### 7. SEO and operations

Open:

```text
/robots.txt
/sitemap.xml
/rss.xml
```

Then show:

```bash
sudo systemctl status eclarkhalid --no-pager
sudo journalctl -u eclarkhalid -n 20 --no-pager
```

This closes the loop between frontend presentation, search visibility, and production operation.

## Fast troubleshooting cues for the recording

| Symptom                         | First check                                        |
| ------------------------------- | -------------------------------------------------- |
| SSH fails after UFW             | Provider console, SSH rule, correct port           |
| Build is killed                 | `free -h`, VPS memory, swap                        |
| systemd fails                   | `journalctl -u eclarkhalid` and `which node`       |
| Nginx shows 502                 | `curl http://127.0.0.1:3000`                       |
| Domain shows default Nginx page | Enabled site, `server_name`, default site symlink  |
| Certbot fails                   | DNS, port 80, UFW, `nginx -t`                      |
| CSS or images are missing       | Standalone `public` and `.next/static` directories |
| Contact does not send           | Resend sender verification and runtime environment |

If a command fails, keep the failure in the video when it teaches a clear diagnostic. Cut secrets, long downloads, and irrelevant waiting.

## Follow-up video ideas

- Deploy Next.js automatically from GitHub Actions
- Add release directories and near-zero-downtime switching
- Dockerize the same Next.js standalone build
- Add uptime monitoring and log rotation
- Put Cloudflare in front of the VPS
- Host multiple Next.js apps behind one Nginx server
- Back up and restore a production VPS
