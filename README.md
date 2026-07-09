# Weekly Report Management System

Full-stack weekly report generator and team dashboard with role-based access, structured weekly report submission, project/task management, manager analytics, and optional AI assistant support.

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Chart.js
- React Chart.js 2
- Lucide React

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt
- Express Validator
- dotenv
- CORS

### Database
- MySQL

## Project Structure

weekly-report-system/
├── backend/
│   ├── src/
│   └── package.json
├── client/
│   ├── src/
│   └── package.json
└── README.md
<img width="355" height="783" alt="image" src="https://github.com/user-attachments/assets/b86ddaa3-6e45-4071-98b4-074680e2cdf5" />


## 1. Installing Dependencies

### Backend
cd backend
npm install

### Frontend
cd client
npm install

## 2. Running the Frontend
#after installing dependencies
cd client
npm run dev

Frontend runs on: http://localhost:5173

## 3. Running the Backend

Create a `.env` file inside the `backend` folder:
env

PORT=5000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=weekly_report_system

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

GEMINI_API_KEY=your_gemini_api_key

If your MySQL root user has no password:
env
DB_PASSWORD=

Start the backend:
#after installing dependencies
cd backend
npm run dev

Backend runs on: http://localhost:5000

Expected test response:

json
{
  "message": "Weekly Report API is running"
}

## 4. Running the Database

Open MySQL Workbench or MySQL command line.

Create the database:

CREATE DATABASE weekly_report_system;
USE weekly_report_system;


Create the tables in this order:

1. users
2. projects
3. project_members
4. tasks
5. weekly_reports
6. weekly_report_tasks
7. notifications

Make sure your `.env` file database values match your local MySQL setup.

When the backend starts successfully, you should see:

MySQL database connected successfully
Server running on port 5000

## Demo Accounts

Recommended demo accounts:

Manager
Email: manager@example.com
Password: Password123

Team Member
Email: johnsilva@gm,ail.com
Password: Password@123

## Main Features

### Manager
- Manager dashboard
- User management
- Project management
- Task creation, update, and deletion
- Weekly report review
- Blocker monitoring
- Dashboard analytics

### Team Member
- Member dashboard
- View assigned projects
- View assigned tasks
- Update own task status
- Create weekly reports
- Submit reports
- View report history

## Role-Based Access

### Manager
Managers can access:
- Manager dashboard
- Projects
- Tasks
- Users
- Team reports
- Analytics

### Team Member
Team members can access:
- Member dashboard
- Own tasks
- Own reports
- Create and submit weekly reports

JWT authentication and authorization middleware protect role-based routes.

## AI Assistant

The system optionally supports a Gemini AI assistant.

Manager can ask:
- What did the team work on this week?
- Which members have blockers?
- Summarize project progress.
- Identify workload imbalance.

Sensitive information such as passwords is never sent to the AI service.

## Notes

- Do not commit `.env` files.
- Keep API keys private.
- Make sure MySQL is running before starting the backend.
- Use Thunder Client or Postman to test backend APIs.

