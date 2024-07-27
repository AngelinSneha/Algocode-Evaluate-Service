# Algocode-Evaluate-Service

---

## Overview

Algocode-Evaluate-Service is responsible for evaluating code submissions from the [Algocode-Submission-Service](https://github.com/AngelinSneha/Algocode-Submission-Service). This service is connected to the **Algocode-Submission-Service** using Redis Queue to facilitate asynchronous communication. This setup allows for efficient handling of job submissions and ensures scalability and reliability in processing tasks. Each submission runs in a Docker container for isolated execution and security.

---

## Features

- **Redis Message Blocker**: Utilizes Redis for efficient message queue management, ensuring orderly processing of code submissions.

- **Docker Containers**: Each code submission runs in its own Docker container, providing isolation and security.

- **Stream Processing**: Implements stream processing to read code submissions from Docker containers and process data efficiently.

---

## How It Works

1. **Submission Queue**: Code submissions are added to the message queue using Redis Message Blocker.

2. **Docker Container Execution**: Each submission is processed in a Docker container, ensuring isolation and security.

3. **Stream Data Processing**: Utilizes streams to read and process data from Docker containers, evaluating the code based on predefined criteria.

---

## How to Start the Service

To run Algocode-Evaluate-Service locally, follow these steps:

   ```bash
   npm run dev
