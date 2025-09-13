# Step 1: Build the app
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Step 2: Serve the app using Express
FROM node:18
WORKDIR /app
COPY --from=builder /app /app
RUN npm install express
EXPOSE 8080
CMD ["node", "server.js"]
