FROM node:22-slim

# Firefox for the Selenium AQI scraper (src/features/air/scrapeAirQuality.js
# expects the binary at /usr/local/bin/firefox). geckodriver is fetched at
# runtime by selenium-manager into ~/.cache/selenium.
RUN apt-get update \
    && apt-get install -y --no-install-recommends firefox-esr ca-certificates \
    && ln -s /usr/bin/firefox-esr /usr/local/bin/firefox \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Firefox is driven via geckodriver, so the chromedriver binary is never used
ENV NODE_ENV=production \
    CHROMEDRIVER_SKIP_DOWNLOAD=true

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production --non-interactive \
    && yarn cache clean

COPY --chown=node:node . .

USER node

EXPOSE 5000

CMD ["npm","run","start"]
