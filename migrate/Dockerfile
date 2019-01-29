FROM node:11-slim

WORKDIR /app/fop/

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install --quiet

COPY config ./config
COPY migrations ./migrations

EXPOSE 3000 3000
CMD ["npm", "run", "migrate"]