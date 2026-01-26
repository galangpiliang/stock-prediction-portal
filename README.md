# 📈 Stock Prediction Portal

A full-stack web application that leverages Deep Learning (LSTM) to predict stock market trends. This project integrates a Python-based Machine Learning pipeline with a modern React frontend, served as a unified monolith via Django.

**[🚀 View Live Demo](https://stock-prediction-portal-9ja1.onrender.com)**

> [!IMPORTANT]
> **Free Tier Notice:** This application is hosted on Render's free tier. If the site has been inactive, the server will experience a **"Cold Start."** Please allow **1–2 minutes** for the instance to spin up on your first visit.

---

### 📝 Project Overview
This project was built to bridge the gap between Data Science and Web Development. Inspired by the **Full Stack Machine Learning** course on Udemy, I built an end-to-end system that fetches financial data, processes it through a Neural Network, and displays results on an interactive dashboard.



### 🛠️ The Tech Stack
* **Frontend:** React.js (Vite)
* **Backend:** Django & Django REST Framework (DRF)
* **AI/ML:** LSTM Neural Networks (TensorFlow/Keras) & Pandas
* **Deployment:** Render (Monolith architecture)
* **Database:** PostgreSQL / SQLite

---

### ⚙️ Automation & Deployment Pipeline
I developed custom automation scripts to streamline the build and deployment process, specifically handling the integration of the React SPA into the Django ecosystem.

#### **1. The Build Pipeline (`build.sh`)**
This script manages the transition from source code to a production-ready monolith:
* **Vite Injection:** Injects `VITE_BACKEND_BASE_API` during the build process to ensure the frontend knows exactly where to find the API.
* **SPA Bundling:** Automatically bundles the React production build (`dist`) into Django’s `staticfiles` directory.
* **Database Prep:** Automates migrations and runs a custom `create_admin.py` script to ensure the environment is ready upon deployment.

#### **2. Production Server (`start.sh`)**
Optimized for production environments using Gunicorn:
* **Resource Management:** Configured with 1 worker and 2 threads to stay within the memory limits of a free-tier hosting environment.
* **Extended Timeout:** Includes a 120s timeout to allow the LSTM model sufficient time for initialization and inference.

---

### 💡 Key Features & Learnings
* **"One-Click" Demo Login:** I implemented a **Demo Login** feature. This allows recruiters and portfolio visitors to explore the dashboard instantly without the friction of a registration form.
* **Monolithic Integration:** Learned to serve a modern React SPA through Django's template engine, reducing deployment complexity and hosting costs.
* **Deployment Mastery:** Successfully navigated the challenges of deploying a memory-intensive ML model (TensorFlow) on a constrained cloud environment.

---

### 🚀 Local Setup
You can replicate the production environment on your machine using the automated scripts:

```bash
# Clone the repository
git clone [https://github.com/galangpiliang/stock-prediction-portal.git](https://github.com/galangpiliang/stock-prediction-portal.git)

# Run the full build & integration pipeline
chmod +x build.sh && ./build.sh

# Launch the production-grade server
chmod +x start.sh && ./start.sh