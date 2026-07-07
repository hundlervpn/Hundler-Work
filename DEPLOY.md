# Deploying Hundler Work

Target server: **38.244.142.43** — ⚠️ this box also runs the **live Hundler VPN NL node**
(`/opt/remnanode`, Docker `remnawave/node`). Do **NOT** wipe the server. Deploy Hundler Work
into its own directory and leave everything else alone.

## 0. Safety first — check what holds the web ports

```bash
sudo ss -tlnp | grep -E ':80 |:443 '
docker ps
```

The VPN node most likely holds **443**. That's fine — we issue the TLS certificate over the
**DuckDNS DNS-01 challenge**, so port 443/80 do **not** need to be free to get HTTPS. We only
need a free port to *serve* on. By default we serve on **8443** (`HTTPS_PORT`), which does not
collide with the VPN node. If `ss` shows 443 is free, you may set `HTTPS_PORT=443`.

## 1. Point the domain at this server

On https://www.duckdns.org set the `hundlerwork` domain's **current ip** to `38.244.142.43`
and press **update ip**. Verify:

```bash
nslookup hundlerwork.duckdns.org   # -> 38.244.142.43
```

## 2. Clone into a dedicated directory (does NOT touch the VPN)

```bash
sudo mkdir -p /opt/hundler-work
sudo chown "$USER" /opt/hundler-work
git clone https://github.com/hundlervpn/Hundler-Work.git /opt/hundler-work
cd /opt/hundler-work
```

## 3. Configure secrets

```bash
cp .env.example .env
nano .env          # paste your DUCKDNS_TOKEN; set HTTPS_PORT (8443 default)
```

## 4. Build & run

```bash
docker compose up -d --build
docker compose logs -f caddy   # watch for successful certificate issuance
```

The site will be available at **https://hundlerwork.duckdns.org:8443**
(or without the port if you set `HTTPS_PORT=443`).

## Updating later

```bash
cd /opt/hundler-work
git pull
docker compose up -d --build
```

## Tearing down ONLY this app (never the VPN)

```bash
cd /opt/hundler-work
docker compose down
```