# Docker

Build and run the production image from the repository root:

```sh
docker build --file docker/Dockerfile --tag zaytstore-web:local .
docker run --publish 8080:8080 zaytstore-web:local
```

Or run the production-like Compose service:

```sh
docker compose -f docker/compose.yaml up --build
```

The app is served on port `8080`. The `/healthz` endpoint returns `ok`, and Nginx falls back to `index.html` for Vue Router history routes.
