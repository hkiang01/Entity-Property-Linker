FROM node:11-slim

WORKDIR /app/entity-property-linker/

# dependencies
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install --quiet

# migrations
COPY config ./config
COPY migrations ./migrations

# the actual api
COPY server.js server.js
EXPOSE 3001
CMD ["npm", "run", "start"]