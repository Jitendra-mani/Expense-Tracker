const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Expense = require("./models/Expense");
const app = express();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Expense Tracker Backend is Running!");
});


// GET all expenses
app.get("/api/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 });

        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);

        res.status(500).json({
            message: "Failed to fetch expenses"
        });
    }
});

// POST - Add a new expense
app.post("/api/expenses", async (req, res) => {
    try {
        const newExpense = new Expense({
            title: req.body.title,
            amount: req.body.amount,
            category: req.body.category,
            date: req.body.date,
            description: req.body.description
        });

        const savedExpense = await newExpense.save();

        res.status(201).json(savedExpense);
    } catch (error) {
        console.error("Error adding expense:", error);

        res.status(500).json({
            message: "Failed to add expense"
        });
    }
});


// DELETE - Delete one expense
app.delete("/api/expenses/:id", async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(
            req.params.id
        );

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully",
            expense: deletedExpense
        });

    } catch (error) {
        console.error("Error deleting expense:", error);

        res.status(500).json({
            message: "Failed to delete expense"
        });
    }
});


// PUT - Update an expense
app.put("/api/expenses/:id", async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                amount: req.body.amount,
                category: req.body.category,
                date: req.body.date,
                description: req.body.description
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json(updatedExpense);

    } catch (error) {
        console.error("Error updating expense:", error);

        res.status(500).json({
            message: "Failed to update expense"
        });
    }
});

// DELETE - Delete all expenses
app.delete("/api/expenses", async (req, res) => {
    try {
        const result = await Expense.deleteMany({});

        res.json({
            message: "All expenses deleted successfully",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error("Error clearing expenses:", error);

        res.status(500).json({
            message: "Failed to clear expenses"
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});