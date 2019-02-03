FROM node:11-slim

WORKDIR /app/eop/

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install --quiet

COPY public public
COPY src src
COPY config config

RUN npm run build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build"]