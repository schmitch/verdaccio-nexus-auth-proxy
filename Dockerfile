FROM verdaccio/verdaccio:6 AS builder
USER root
ENV NODE_ENV=production

RUN apk add alpine-sdk
RUN npm i --global-style verdaccio-nexus-auth-proxy

FROM verdaccio/verdaccio:6
COPY --from=builder --chown=$VERDACCIO_USER_UID:root /opt/verdaccio/node_modules/verdaccio-nexus-auth-proxy /verdaccio/plugins/verdaccio-nexus-auth-proxy
