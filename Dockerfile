# ---- Build stage: build the Vite app to /app/dist ----
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage: just Node + your server + built files ----
FROM node:18
WORKDIR /app

# copy only what we need to run
COPY --from=builder /app/dist ./dist
COPY server.cjs ./server.cjs

# install only express at runtime
RUN npm install express

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.cjs"]

