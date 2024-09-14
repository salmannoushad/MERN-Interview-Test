# Whiteboard Application

## Description

The Interactive Whiteboard Application is a powerful and versatile tool designed for users to create and manage drawings with ease. The application allows users to:

- **Draw freely** on a canvas.
- **Add lines and shapes** to enhance their drawings.
- **Annotate** their drawings with text and other elements.
- **Save** their drawings for future use.
- **Delete** unwanted drawings.
- **Update** existing drawings as needed.

This application is ideal for brainstorming sessions, design work, and any creative tasks requiring a dynamic and interactive drawing environment.

## Frontend

To install and start the frontend project, follow these steps:

```bash
# Clone the repository
git clone https://github.com/salmannoushad/MERN-Interview-Test.git

# Navigate to the project directory
cd frontend

# Install dependencies with force option
npm install --force

# Set environment variables
export REACT_APP_BACKEND_URL=http://localhost:5000/api
export PORT=3000

# Start the frontend application
npm start
```
## Backend

To install and start the Backend project, follow these steps:

```bash
# Navigate to the project directory
cd backend

# Install dependencies with force option
npm install


# Set environment variables
MONGO_URI=
NODE_ENV=development
PORT=5000

# Start the frontend application
npm start
```

## Dockerfile
for frontend

```bash
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```
## Dockerfile
for Backend

```bash
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## Kubernetes Setup

To deploy the Interactive Whiteboard Application to a Kubernetes cluster, follow these steps:

### Prerequisites

Before you start, make sure you have the following:

1. **Kubernetes Cluster**: Ensure you have a Kubernetes cluster up and running. 

2. **kubectl**: Ensure `kubectl` is installed and configured to interact with your Kubernetes cluster. You can install it from the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/).


### Deployment

Follow these steps to deploy the Interactive Whiteboard Application:

## Backend Deployment Configuration

Use the following `backend-deployment.yaml` to deploy the backend service to Kubernetes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  labels:
    app: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: salmanoushad/backend
        ports:
        - containerPort: 5000
        env:
        - name: MONGO_URI
          value: "mongodb+srv://salman:4XvvPQYw9c1aFyoP@cluster0.m6syx.mongodb.net/whiteboard?retryWrites=true&w=majority&appName=Cluster0"
        - name: NODE_ENV
          value: "development"
        - name: PORT
          value: "5000"
```

## To apply this configuration, run:

```bash
kubectl apply -f backend-deployment.yaml
```

## Backend Service Configuration

Use the following `backend-service.yaml` to expose the backend service to your Kubernetes cluster:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
  type: LoadBalancer
```
## To apply this configuration, run:

```bash
kubectl apply -f backend-deployment.yaml
```

## Frontend Deployment Configuration

Use the following `frontend-deployment.yaml` to deploy the frontend service to Kubernetes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: salmanoushad/mern-frontend  
        ports:
        - containerPort: 3000
        env:
        - name: REACT_APP_BACKEND_URL
          value: "http://<service-ip>:<port>/api" # backend external service IP or cluster IP
        - name: PORT
          value: "3000"
```
## To apply this configuration, run:

```bash
kubectl apply -f frontend-deployment.yaml
```

## Frontend Service Configuration

Use the following `frontend-service.yaml` to expose the frontend service to your Kubernetes cluster:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## To apply this configuration, run:

```bash
kubectl apply -f frontend-service.yaml
```

## MetalLB Configuration

To configure MetalLB for handling LoadBalancer services in your Kubernetes cluster, use the following `metallb-pool.yaml` file:

```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default
  namespace: metallb-system
spec:
  addresses:
  - 192.168.122.170-192.168.122.180
  autoAssign: true
```

## To apply this configuration, run:

```bash
kubectl apply -f metallb-pool.yaml
```

## MetalLB L2Advertisement Configuration

To configure MetalLB to use L2 mode for advertising IP addresses, use the following `metallb-L2Advertisement.yaml` file:

```yaml
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default
  namespace: metallb-system
spec:
  ipAddressPools:
  - default
```

## To apply this configuration, run:

```bash
kubectl apply -f metallb-L2Advertisement.yaml
```