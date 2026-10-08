# Expense Tracker

A full-stack web application that helps users manage and track their daily expenses. The application allows users to add, edit, delete, search, and filter expenses while providing monthly expense summaries, budget tracking, and balance management.

## 🚀 Features

- Add new expenses
- Edit existing expenses
- Delete individual expenses
- Delete all expenses
- Search expenses by title
- Filter expenses by category
- Track total balance
- Calculate total expenses
- Count total transactions
- Display current month's expenses
- Set and track a monthly budget
- Show remaining budget
- Store expense data in MongoDB
- REST API using Node.js and Express.js
- Responsive React frontend

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Tools
- VS Code
- Git & GitHub
- MongoDB Atlas

## 📂 Project Structure

```text
expense-tracker/
│
├── expense-tracker-react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   └── ExpenseTable.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── models/
    │   └── Expense.js
    ├── server.js
    ├── .env
    ├── package.json
    └── package-lock.json