
# Backend Service for Weather Data Processing

This backend service processes and analyzes historical weather data using a scalable, high-performance infrastructure. Built with Node.js, Express.js, MongoDB , Redis and BullMQ, it supports real-time data streaming and has been optimized for large dataset processing, robust access control, and responsive data visualization. 

## Features

- **High-Performance Data Processing**: Handles large weather datasets, specifically OpenWeather Historical Weather Data in CSV format, for real-time analytics and visualization.
- **WebSocket Integration**: Enables real-time data streaming for live updates and responsive data visualization.
- **Redis Caching**: Utilizes Redis to optimize data retrieval times and manage request load efficiently.
- **Role-Based Access Control (RBAC)**: Secures data access by supporting roles like `admin`, `manager`, and `user` with JSON Web Token (JWT) based authentication.
- **Robust Logging**: Detailed logs have been added to the code to facilitate monitoring and debugging, enhancing the observability of the service.
- **Dockerized Deployment**: Simplifies containerized deployment to AWS EC2 using Docker and an automated CI/CD pipeline.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, TypeScript
- **Authentication**: JWT (JSON Web Token)
- **Caching**: Redis
- **Queue Processing**: Bull.js for managing large data processing tasks efficiently
- **WebSocket Integration**: Socket.IO for real-time data streaming
- **Deployment**: Docker, GitHub Actions, AWS EC2

## Installation and Setup

### Prerequisites

- Node.js v18+
- MongoDB
- Docker
- AWS EC2 (for deployment)
- Redis ( deployed on an AWS EC2 instance)

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/suryathink/mapup
    cd https://github.com/suryathink/mapup
    cd server  # Move into the backend code folder
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Configure Environment Variables**:

   Create a `.env` file with the following environment variables:

    ```plaintext
    MONGO_URL=<your-mongo-db-url>
    JWT_SECRET=<your-jwt-secret>
    REDIS_HOST_URL=<your-redis-host-url>
    REDIS_PORT=<your-redis-port>
    REDIS_PASSWORD=<your-redis-password>
    ```

4. **Run the Application**:
    ```bash
    npm run dev
    ```

### Running with Docker

Build the Docker image locally:

```bash
docker build -t suryathink/map:latest -f server/Dockerfile .
```

### CI/CD Pipeline

The project utilizes GitHub Actions for CI/CD:

- **Build and Push Docker Image**: On every push to the `main` branch, the code is checked out, dependencies installed, and the Docker image built and pushed to Docker Hub.
- **Deploy to AWS EC2**: The deployment job securely connects to the EC2 instance, pulls the latest Docker image, stops any running containers, and starts a new container with updated environment variables.

## Data Processing Pipeline

This service processes weather data received in CSV format, specifically OpenWeather Historical Weather Data. The CSV file is parsed, and data is processed for real-time use through WebSocket connections or stored for later retrieval via API endpoints.

1. **Queue Setup**: Uses Bull.js to manage file processing tasks efficiently and ensure scalability for large datasets.
2. **CSV Parsing and Processing**: Reads CSV files, processes weather records, and stores them in MongoDB, enabling fast querying and retrieval.

### WebSocket Integration

Socket.IO is used to stream data in real-time, allowing clients to receive updates without polling the server.


Here's an expanded README section listing all the routes and their functions:

---

## API Endpoints

The backend service exposes the following RESTful API routes for user management, weather data processing, and real-time data streaming:

| Method | Endpoint         | Middleware                                  | Roles Allowed          | Description                                                                                             |
|--------|-------------------|---------------------------------------------|-------------------------|---------------------------------------------------------------------------------------------------------|
| POST   | `/upload`        | `apiLimiterMiddleware`, `verifyToken`       | `user`, `admin`, `manager` | Uploads a CSV file containing weather data. The file is processed and stored in the database.           |
| POST   | `/signup`        | `authLimiterMiddleware`                     | Public                  | Allows new users to sign up and create an account.                                                      |
| POST   | `/login`         | `authLimiterMiddleware`                     | Public                  | Authenticates a user and provides a JWT for secure access.                                              |
| GET    | `/`              | `apiLimiterMiddleware`, `verifyToken`       | `admin`, `user`, `manager` | Fetches all stored weather data. Returns a paginated response of weather records.                        |
| GET    | `/hello`         | `apiLimiterMiddleware`                      | Public                  | Returns a basic greeting to confirm the server is running and accessible.                               |
| PUT    | `/:id`           | `apiLimiterMiddleware`, `verifyToken`       | `admin`                 | Updates a specific weather data record by ID.                                                            |
| DELETE | `/:id`           | `apiLimiterMiddleware`, `verifyToken`       | `admin`                 | Deletes a specific weather data record by ID.                                                            |

### Route Descriptions

- **File Upload (`/upload`)**: Protected route allowing users with `user`, `admin`, or `manager` roles to upload a weather dataset in CSV format. The data is processed and added to the database for further analysis and retrieval.
- **User Signup (`/signup`)**: Public route for new users to create accounts. The `authLimiterMiddleware` rate-limits requests to mitigate brute-force attacks.
- **User Login (`/login`)**: Public route for logging in and generating a JWT, allowing users to access protected resources.
- **Fetch All Weather Data (`/`)**: Protected route for authorized users to retrieve paginated weather records stored in the database.
- **Greeting Route (`/hello`)**: A simple endpoint that returns a basic greeting, useful for testing the server's availability.
- **Update Weather Data (`/:id`)**: Admin-only route for updating weather records by ID. This allows admins to modify existing data in the database.
- **Delete Weather Data (`/:id`)**: Admin-only route for deleting a specific weather data record by ID.

---
### Note

 Due to less time I was not able to build the frontend part
---

Sample data you can try uploading
[weather_data.csv](https://github.com/user-attachments/files/17591982/weather_data.csv)
