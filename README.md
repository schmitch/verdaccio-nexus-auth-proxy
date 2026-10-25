# verdaccio-nexus-auth-proxy

> proxies auth requests to nexus for compat

---

## development

See the [verdaccio contributing guide](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md) for instructions setting up your development environment.
Once you have completed that, use the following npm tasks.

- `npm run build`

  Build a distributable archive

- `npm run test`

  Run unit test

For more information about any of these commands run `npm run ${task} -- --help`.

## docker image

The `Dockerfile` builds the plugin from this repository's source and installs it into the official
`verdaccio/verdaccio` image. GitHub Actions pushes it to `ghcr.io/schmitch/verdaccio-nexus-auth`:

- pushing a tag like `v1.2.3` publishes `1.2.3`, `1.2`, `1` and `latest`
- pushes to `main` publish `main`, the daily scheduled build publishes `nightly`
- the workflow can also be started manually from the Actions tab

```sh
git tag v1.2.3
git push origin v1.2.3
```

Every build pulls the newest `verdaccio/verdaccio:6` (i.e. the latest 6.x release). To pin a specific
version or move to a new major, change `VERDACCIO_VERSION` in the `Dockerfile`, or override it locally:

```sh
docker build --build-arg VERDACCIO_VERSION=6.11.1 -t verdaccio-nexus-auth .
```

Trigger: 7
