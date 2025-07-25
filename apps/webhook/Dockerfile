# Use the base image for development
FROM node:20-alpine3.19 AS dev_base
RUN apk add --no-cache g++ make py3-pip
ENV NX_DAEMON=false

# Install global dependencies
RUN npm --no-update-notifier --no-fund --global install pm2 pnpm@10.11.0&& \
    pnpm --version

# Set non-root user
USER 1000
WORKDIR /usr/src/app

FROM dev_base AS dev
ARG PACKAGE_PATH

# Copy necessary directories to the image with appropriate ownership
COPY --chown=1000:1000 ./meta ./deps ./pkg ./

# Install dependencies and build the webhook service
RUN --mount=type=cache,id=pnpm-store-webhook,target=/root/.pnpm-store \
    pnpm install --reporter=silent --filter "novuhq" --filter "{${PACKAGE_PATH}}..." \
    --frozen-lockfile --unsafe-perm --reporter=silent && \
    NODE_ENV=production pnpm build:webhook

# Set the working directory to the webhook app and copy example environment file
WORKDIR /usr/src/app/apps/webhook
RUN cp src/dotenvcreate.mjs dist/dotenvcreate.mjs
RUN cp src/.example.env dist/.env
RUN cp src/.env.test dist/.env.test
RUN cp src/.env.development dist/.env.development
RUN cp src/.env.production dist/.env.production

# Set the working directory to the root of the app
WORKDIR /usr/src/app

# ------- ASSETS BUILD ----------
# Create a new stage for building assets
FROM dev AS assets

# Remove node_modules and source directories
RUN rm -rf node_modules && pnpm recursive exec -- rm -rf ./src ./node_modules

# ------- PRODUCTION BUILD ----------
# Use the base image for production
FROM dev_base AS prod
ARG PACKAGE_PATH

# Set environment variables for production
ENV CI=true

# Set the working directory to the root of the app
WORKDIR /usr/src/app

# Copy necessary directories from the build stage
COPY --chown=1000:1000 ./meta ./
COPY --chown=1000:1000 --from=assets /usr/src/app .

# Install production dependencies
RUN --mount=type=cache,id=pnpm-store-webhook,target=/root/.pnpm-store \
    pnpm install --reporter=silent --filter "{${PACKAGE_PATH}}..." \
    --frozen-lockfile --unsafe-perm --reporter=silent

# Set the working directory to the webhook app and start the application using pm2-runtime
WORKDIR /usr/src/app/apps/webhook
ENTRYPOINT [ "sh", "-c", "node dist/dotenvcreate.mjs -s=novu/webhook -r=$NOVU_REGION -e=$NOVU_ENTERPRISE -v=$NODE_ENV && pm2-runtime start dist/main.js -i max" ]
