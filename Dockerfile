# Use a newer version of Node.js for the build stage.
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy all other files to the app directory.
COPY . .

# Build the app.
RUN npm run build

# Use a lean base image for the runtime stage to keep the container small.
FROM node:20

WORKDIR /app

# Copy only the necessary build artifacts and server file from the build stage.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.cjs ./server.cjs
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/api.ts ./api.ts
COPY --from=builder /app/services/gameService.ts ./services/gameService.ts
COPY --from=builder /app/constants.ts ./constants.ts
COPY --from=builder /app/types.ts ./types.ts

# Install only production dependencies for the final image.
RUN npm install express @google/generative-ai

# Expose the port on which the app will run.
EXPOSE 8080

# Define the command to run the app.
CMD ["node", "server.cjs"]
