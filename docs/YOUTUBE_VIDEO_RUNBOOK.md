# YouTube runbook: deploy a Next.js app to a VPS

Use this for recording setup and safety. The word-for-word chapter script lives in `docs/YOUTUBE_VIDEO_SCRIPT.md`, and the exact copyable commands live in `docs/VPS_DEPLOYMENT_GUIDE.md`.

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
- [ ] Open `docs/YOUTUBE_VIDEO_SCRIPT.md` on a second monitor, with `docs/VPS_DEPLOYMENT_GUIDE.md` behind it.

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

## Chapter flow

The chapter script, target timings, checkpoint cards, narration and cut notes live in `docs/YOUTUBE_VIDEO_SCRIPT.md`. Record from that file. The video opens on the app running locally and ends with it live over HTTPS; there is no deployed version before recording starts.

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
