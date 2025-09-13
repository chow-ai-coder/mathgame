# Stage 1: Build the frontend and backend
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the frontend assets
RUN npm run build

# Transpile the backend TypeScript files to JavaScript
RUN npm install -g typescript
RUN tsc --outDir dist/backend ./api.ts ./services/gameService.ts ./constants.ts ./types.ts

# Stage 2: Create the final production image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the built frontend assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the transpiled backend JavaScript files from the builder stage
COPY --from=builder /app/dist/backend ./backend
COPY --from=builder /app/server.cjs ./

# Install only the production dependencies
RUN npm install express @google/generative-ai

# Expose the port the app runs on
EXPOSE 8080

# Run the server
CMD ["node", "server.cjs"]
