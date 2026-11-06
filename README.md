# VERIVA Breakfast App

The complete classroom APP is now online, including Oatie AI, personalised breakfast recommendations, recipes, shopping, product reviews and the admin visit counter.

- [Open the complete APP](https://veriva-breakfast-v75.onrender.com/)
- [Original share link](https://sean-get.github.io/veriva-breakfast/) — redirects to the complete APP.
- [Admin dashboard](https://veriva-breakfast-v75.onrender.com/admin) — requires the configured admin password.

Open the link in Safari or Chrome on a phone, tablet or computer; no installation is required.

## Free classroom hosting

The user selected Render's Free service. After inactivity it may take about a minute to wake up. Accounts, reviews and counters use SQLite on the temporary filesystem and can reset after a deploy, restart or idle shutdown. This is a classroom demonstration, without real payments or stock guarantees.

## Deployment source

`app-source.tar.gz` contains sanitised source and web assets. `Dockerfile` builds a Node 24 standalone server with frozen pnpm dependencies. No API keys, environment files or personal database records are committed. Runtime credentials are configured in Render only.

See [deployment notes](DEPLOYMENT.md).
