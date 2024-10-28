# Use an official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies, including missing types
RUN npm install && npm install --save-dev @types/cors

# Copy remaining files, including tsconfig.json and src folder
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 8000

# Set environment variables if necessary
ENV MONGO_URL=$MONGO_URL \
    JWT_SECRET=$JWT_SECRET \
    REDIS_HOST_URL=$REDIS_HOST_URL \
    REDIS_PORT=$REDIS_PORT \
    REDIS_PASSWORD=$REDIS_PASSWORD

# Start the application
CMD ["npm", "start"]
