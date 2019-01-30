FROM node:11-slim

WORKDIR /app/eop/

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install --quiet

COPY server.js server.js
EXPOSE 3001
CMD ["npm", "run", "start"]