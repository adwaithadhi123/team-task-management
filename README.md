# Team Task Manager

A premium full-stack task management application with role-based access control.

## 🚀 Key Features
- **Authentication**: Secure Signup/Login with JWT.
- **Project Management**: Create and manage projects (Admin).
- **Task Tracking**: Assign tasks, set priorities, and update status.
- **Dashboard**: Interactive stats for tasks (Total, In Progress, Completed, Overdue).
- **RBAC**: Admin and Member roles with different permissions.

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Vanilla CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Prisma.
- **Database**: SQLite.

## 📦 Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd team-task
```

### 2. Backend Setup
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🎥 Demo
Check the `walkthrough.md` in the artifact directory for a full video demonstration of the features.

## 📝 License
MIT
# team-task-management
