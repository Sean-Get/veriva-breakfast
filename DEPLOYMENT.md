# VERIVA complete APP deployment

This repository keeps its existing GitHub Pages entry while Render runs the complete server APP.

- Runtime: Docker, Node 24, standalone Next.js, SQLite.
- Source: app-source.tar.gz contains sanitised v7.5 source and web assets, without environment files, personal databases or Windows runtime dependencies.
- Build: frozen pnpm-lock.yaml with pnpm 11.25.0.
- Render port: 10000, host 0.0.0.0, health check /.
- Persistent disk: mount at /var/data; VERIVA_DATA_DIR=/var/data/veriva; run one instance.
- Runtime secrets: DEEPSEEK_API_KEY, DEEPSEEK_MODEL, VERIVA_ADMIN_PASSWORD, configured in Render's Environment panel only. Do not commit values to this repository.
- Cookies use HTTPS. The server's external URL is required for mobile access.

Free Render instances do not retain SQLite records across restarts or idle shutdowns. A paid instance with a persistent disk is needed to preserve accounts, reviews and visits with this architecture.

After successful deployment and verification, the existing GitHub Pages entry can redirect to the full APP. Until then its current landing page is preserved.
