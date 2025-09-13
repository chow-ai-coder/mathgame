# Step 1: Build the app
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the app
FROM node:18
WORKDIR /app

# copy only dist and server
COPY --from=builder /app/dist ./dist
COPY server.cjs ./server.cjs
COPY package*.json ./

# install only express
RUN npm install express

EXPOSE 8080
CMD ["node", "server.cjs"]
