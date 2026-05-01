# AlgoArena 🚀

AlgoArena is an advanced, AI-powered Data Structures and Algorithms (DSA) practice platform. It provides a real-time, interactive environment for users to hone their coding skills, featuring intelligent problem generation, real-time code evaluation, and a sleek, modern user interface.

## 🌟 Key Features

*   **AI-Powered Problem Generation:** Leverages Google Gemini AI to dynamically generate type-wise DSA problems, ensuring a vast and diverse problem set.
*   **Real-time Code Editor:** Integrated Monaco Editor provides a rich, VS Code-like coding experience directly in the browser.
*   **Live Evaluation:** Fastify-powered backend with WebSocket support for near-instantaneous code execution and feedback.
*   **Robust Backend Architecture:** Built on Node.js/Fastify, backed by PostgreSQL (managed via Prisma), and utilizing Redis for high-performance caching.
*   **Modern Frontend:** A responsive, premium UI built with React, Vite, and Lucide React icons.
*   **Containerized Deployment:** Fully Dockerized setup (`docker-compose`) for seamless local development and production deployment.

## 🛠️ Technology Stack

**Frontend:**
*   React 19
*   Vite
*   Monaco Editor
*   React Router DOM
*   Lucide React

**Backend:**
*   Node.js & Fastify
*   TypeScript
*   Prisma ORM (PostgreSQL)
*   Redis (ioredis)
*   Google Generative AI (Gemini)
*   JWT Authentication
*   WebSockets

## 🚀 Getting Started

### Prerequisites

*   Node.js (v20+ recommended)
*   Docker & Docker Compose
*   PostgreSQL
*   Redis

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/debayanCODES-1/take_u_downward.git
    cd take_u_downward
    ```

2.  **Environment Variables:**
    *   Copy the `.env.example` file to `.env` in the root and configure your credentials (database URL, Redis, JWT secret, Gemini API key).
    *   Ensure backend also has its respective `.env` if required by the workspace structure.

3.  **Running Locally (Docker):**
    The easiest way to get the entire stack up and running is using Docker Compose:
    ```bash
    docker-compose up --build
    ```
    This will spin up the backend API, the frontend Vite development server, and required databases.

4.  **Running Locally (Manual):**
    *   **Backend:**
        ```bash
        cd backend
        npm install
        npx prisma generate
        npm run dev
        ```
    *   **Frontend:**
        ```bash
        cd frontend
        npm install
        npm run dev
        ```

## 🚢 Deployment

The platform is configured for modern cloud deployment:
*   **Frontend:** Optimized for serverless deployment on [Vercel](https://vercel.com/) (see `vercel.json`).
*   **Backend:** Configured for deployment on [Render](https://render.com/) or similar container-based PaaS (see `render.yaml` and `docker-compose.prod.yml`).

## 📄 License

This project is licensed under the MIT License.
