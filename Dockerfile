# Verdaccio base image tag. "6" always resolves to the newest 6.x release;
# pin an exact version (e.g. 6.11.1) or bump the major here (or via
# --build-arg VERDACCIO_VERSION=...) to change it.
ARG VERDACCIO_VERSION=6

FROM verdaccio/verdaccio:${VERDACCIO_VERSION} AS builder
USER root
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY tsconfig.json ./
COPY src ./src
COPY types ./types
RUN npm run build \
 && npm prune --omit=dev \
 && mkdir /plugin \
 && cp -r package.json lib node_modules /plugin/

FROM verdaccio/verdaccio:${VERDACCIO_VERSION}
COPY --from=builder --chown=$VERDACCIO_USER_UID:root /plugin /verdaccio/plugins/verdaccio-nexus-auth-proxy
