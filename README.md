# NegotiateAI

**NegotiateAI** is a cutting-edge B2B procurement solution designed to automate and streamline price negotiations for raw materials. By leveraging AI-driven agents, it allows buyers to negotiate price, quantity, and delivery terms in real-time, functioning as a 24/7 intelligent procurement assistant.

![NegotiateAI Banner](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070)

## 🚀 Key Features

- **Automated Negotiation**: Intelligent AI agents handle back-and-forth price discussions based on predefined business logic.
- **Real-Time Term Extraction**: Automatically identifies and tracks negotiated material, quantity, and delivery dates.
- **B2B Optimized UI**: A sleek, professional dashboard designed for procurement managers and suppliers.
- **Enterprise-Grade DevOps**: Fully automated CI/CD pipeline deploying to AWS ECS Fargate via GitHub Actions.

## 🛠 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Docker](https://www.docker.com/), [Amazon ECR](https://aws.amazon.com/ecr/), [Amazon ECS Fargate](https://aws.amazon.com/ecs/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)

## ☁️ DevOps & Deployment

This project follows advanced DevOps practices for high availability and scalability:

### CI/CD Pipeline
The repository includes a robust GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
1.  **Authenticates** with AWS via OIDC for secure, credential-less access.
2.  **Builds** an optimized multi-stage Docker image.
3.  **Pushes** the image to Amazon Elastic Container Registry (ECR).
4.  **Updates** the Amazon ECS Task Definition with the new image tag.
5.  **Deploys** the service to an AWS ECS Fargate cluster with automated health checks.

### Infrastructure Configuration
- **Task Definition**: `task-definition.json` defines a serverless Fargate task with 0.25 vCPU and 0.5GB RAM.
- **Logging**: Integrated with **AWS CloudWatch** for real-time log monitoring.
- **Health Checks**: Built-in HTTP health checks to ensure zero-downtime deployments.

## 💻 Local Development

### Prerequisites
- Node.js 18+
- npm

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/Ishiezz/NegotiateAI.git
    cd NegotiateAI
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Docker Setup
To run the production build locally using Docker:
```bash
docker build -t negotiate-ai .
docker run -p 3000:3000 negotiate-ai
```

## 📄 License
This project is licensed under the MIT License.
