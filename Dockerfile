# Production image: build inside the container so `file:./shared-types` resolves.
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY shared-types ./shared-types

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
