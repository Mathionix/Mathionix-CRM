# Mathionix CRM

Results-driven, premium CRM application built with a modern tech stack to replicate and enhance the functionality of Frappe CRM. Rebranded from "Frappe CRM" to **Mathionix CRM** with a focus on high-performance, responsive design, and robust architecture.

## 🚀 Features

### **Premium UI & UX**
- **Glassmorphic Design:** Modern, blur-responsive interface details.
- **Dynamic Dashboard:** Real-time KPIs with customizable chart widgets (Area, Bar, Donut, Number).
- **Dark Mode Sidebar:** Elegant navigation with active state tracking and quick actions.
- **Interactive Notifications:** Real-time feedback and alerts.

### **Authentication & Security**
- **Secure Auth Flow:** JWT-based authentication with `bcrypt` password hashing.
- **Route Protection:** `AuthGuard` protects CRM tools from unauthorized access.
- **User Management:** Login, Signup, Forgot Password, and Profile Management.
- **Data Seeding:** Automated admin user generation.

### **CRM Tools**
- **Comprehensive Lead Management:** Track leads with detailed forms (Status, Source, Territory).
- **Deal Pipeline:** Manage opportunities with revenue tracking and stage visualization.
- **Contact & Organization Management:** centralized address book and account management.
- **Activity Logging:** dedicated modules for Notes, Tasks, and Call Logs.
- **Quick Add:** Global "Create New" modal accessible from anywhere.

## 🛠 Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, Lucide React, Recharts.
- **Backend:** NestJS, Mongoose, Passport (JWT).
- **Database:** MongoDB (Containerized).
- **Infrastructure:** Docker & Docker Compose.

---

## ⚡ Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js & npm (for local non-docker dev)

### 🐳 Quick Start (Recommended)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd frappe-next-crm
    ```

2.  **Initialize the Environment:**
    Run the initialization script to set up `.env` files and permissions (Mac/Linux/WSL):
    ```bash
    ./init.sh
    ```
    *(Windows PowerShell users: `./init.ps1`)*

3.  **Start Services:**
    ```bash
    docker-compose up --build
    ```

4.  **Seed Database:**
    Open a new terminal and run:
    ```bash
    docker-compose exec api npm run seed
    ```

5.  **Access the Application:**
    - **Frontend:** [http://localhost:3000](http://localhost:3000)
    - **API:** [http://localhost:3001](http://localhost:3001)

### 🔑 Default Credentials

Use these credentials to log in as the System Administrator:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@mathionix.crm` | `password` |

---

## 🔧 Manual Setup (Development)

If you prefer running services locally without Docker:

### 1. Backend (API)
```bash
cd api
npm install
# Ensure MongoDB is running locally on port 27017
npm run seed  # Run once to create admin user
npm run start:dev
```

### 2. Frontend (Web)
```bash
cd web
npm install
npm run dev
```

## 📂 Project Structure

```bash
frappe-next-crm/
├── api/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/        # Authentication Module
│   │   ├── crm/         # CRM Logic (Leads, Deals, etc.)
│   │   ├── users/       # User Management
│   │   └── seed.ts      # Database Seeder
│   └── ...
├── web/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/         # App Router Pages
│   │   ├── components/  # Reusable Components (AppShell, Sidebar)
│   │   └── ...
│   └── ...
├── docker-compose.yml   # Docker Orchestration
└── init.sh              # Setup Script
```

---
**Mathionix CRM** - Built for performance and scale.
