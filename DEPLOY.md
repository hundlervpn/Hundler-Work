# Deploying Hundler Work

Target server: **38.244.142.43** — this box is now **dedicated to Hundler Work**. The old
Hundler VPN NL node that used to run here has been decommissioned, so the server can be wiped
and repurposed.

## 0. Point the domain at this server

On https://www.duckdns.org set the `hundlerwork` domain's **current ip** to `38.244.142.43`
and press **update ip**. Verify:

```bash
nslookup hundlerwork.duckdns.org   # -> 38.244.142.43
```

## 1. Wipe the old stuff off the server

First see what's running so you know what you're removing:

```bash
docker ps -a
ls /opt
```

Tear down the old VPN node's docker stack (if it's still up) and remove its directory:

```bash
# stop + remove the old node stack (ignore errors if already gone)
cd /opt/remnanode 2>/dev/null && docker compose down -v || true
cd ~

# nuke ALL docker containers/images/volumes/networks left on the box
docker ps -aq | xargs -r docker rm -f
docker system prune -a --volumes -f

# remove leftover app directories
sudo rm -rf /opt/remnanode
```

> This clears Docker and the old node directory. It does **not** touch the OS itself.

## 2. Clone Hundler Work

```bash
sudo mkdir -p /opt/hundler-work
sudo chown "$USER" /opt/hundler-work
git clone https://github.com/hundlervpn/Hundler-Work.git /opt/hundler-work
cd /opt/hundler-work
```

## 3. Configure secrets

```bash
cp .env.example .env
nano .env          # paste your DUCKDNS_TOKEN
```

Your DuckDNS token is the string at the top of your https://www.duckdns.org account page.

## 4. Build & run

```bash
docker compose up -d --build
docker compose logs -f caddy   # watch for successful certificate issuance
```

The site will be live at **https://hundlerwork.duckdns.org** (HTTP is auto-redirected to HTTPS).

## Updating later

```bash
cd /opt/hundler-work
git pull
docker compose up -d --build
```

## Stopping

```bash
cd /opt/hundler-work
docker compose down
```