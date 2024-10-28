FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install --save-dev @types/cors
COPY . .
RUN npm run build
EXPOSE 8000
# Set environment variables if necessary
ENV MONGO_URL=$MONGO_URL \
    JWT_SECRET=$JWT_SECRET \
    REDIS_HOST_URL=$REDIS_HOST_URL \
    REDIS_PORT=$REDIS_PORT \
    REDIS_PASSWORD=$REDIS_PASSWORD
CMD ["npm", "start"]
