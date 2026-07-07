# Caddy built with the DuckDNS DNS provider so it can solve the ACME
# DNS-01 challenge — no need for ports 80/443 to be free during issuance.
FROM caddy:2-builder AS builder
RUN xcaddy build --with github.com/caddy-dns/duckdns

FROM caddy:2-alpine
COPY --from=builder /usr/bin/caddy /usr/bin/caddy