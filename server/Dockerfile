FROM node:18-alpine
WORKDIR /app

# Build arguments
ARG MONGO_URL
ARG JWT_SECRET
ARG REDIS_HOST_URL
ARG REDIS_PORT
ARG REDIS_PASSWORD

# # Set environment variables using build arguments
ENV MONGO_URL=${MONGO_URL} \
    JWT_SECRET=${JWT_SECRET} \
    REDIS_HOST_URL=${REDIS_HOST_URL} \
    REDIS_PORT=${REDIS_PORT} \
    REDIS_PASSWORD=${REDIS_PASSWORD}

COPY package*.json ./
RUN ls && node -v
# RUN npm install && npm install --save-dev @types/cors
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm", "start"]
