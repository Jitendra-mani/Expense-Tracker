import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import Budget from "./components/Budget";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";

function App() {
    // Load saved balance when the app starts
    const [balance, setBalance] = useState(() => {
        try {
            const savedBalance = localStorage.getItem(
                "expenseTrackerBalance"
            );

            return savedBalance !== null
                ? Number(savedBalance)
                : 0;
        } catch {
            return 0;
        }
    });

    // Expenses now come from MongoDB
    const [expenses, setExpenses] = useState([]);

    const [editingExpense, setEditingExpense] = useState(null);

    // Load expenses from MongoDB when app starts
    useEffect(() => {
        fetch("http://localhost:5000/api/expenses")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch expenses");
                }

                return response.json();
            })
            .then((data) => {
                const formattedExpenses = data.map((expense) => ({
                    ...expense,
                    id: expense._id
                }));

                setExpenses(formattedExpenses);
            })
            .catch((error) => {
                console.error(
                    "Error loading expenses:",
                    error
                );
            });
    }, []);

    // Save balance whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(
                "expenseTrackerBalance",
                String(balance)
            );
        } catch (error) {
            console.error(
                "Could not save balance:",
                error
            );
        }
    }, [balance]);

    // Add expense
    const addExpense = (newExpense) => {
        const formattedExpense = {
            ...newExpense,
            id: newExpense._id
        };

        setExpenses((prevExpenses) => [
            ...prevExpenses,
            formattedExpense
        ]);
    };

    // Delete expense
    const deleteExpense = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/expenses/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete expense"
                );
            }

            setExpenses((prevExpenses) =>
                prevExpenses.filter(
                    (expense) => expense.id !== id
                )
            );

            console.log(
                "Expense deleted successfully"
            );
        } catch (error) {
            console.error(
                "Error deleting expense:",
                error
            );

            alert(
                "Could not delete expense."
            );
        }
    };

    // Select expense for editing
    const editExpense = (expense) => {
        setEditingExpense(expense);
    };

    // Update expense
    const updateExpense = async (updatedExpense) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/expenses/${updatedExpense.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedExpense)
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update expense"
                );
            }

            const savedExpense =
                await response.json();

            const formattedExpense = {
                ...savedExpense,
                id: savedExpense._id
            };

            setExpenses((prevExpenses) =>
                prevExpenses.map((expense) =>
                    expense.id === formattedExpense.id
                        ? formattedExpense
                        : expense
                )
            );

            setEditingExpense(null);

            console.log(
                "Expense updated successfully:",
                formattedExpense
            );
        } catch (error) {
            console.error(
                "Error updating expense:",
                error
            );

            alert(
                "Could not update expense."
            );
        }
    };

    // Clear all expenses
    const clearAllExpenses = async () => {
        if (expenses.length === 0) return;

        const confirmClear = window.confirm(
            "Are you sure you want to delete all expenses?"
        );

        if (!confirmClear) return;

        try {
            const response = await fetch(
                "http://localhost:5000/api/expenses",
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to clear expenses"
                );
            }

            setExpenses([]);
            setEditingExpense(null);

            console.log(
                "All expenses deleted successfully"
            );
        } catch (error) {
            console.error(
                "Error clearing expenses:",
                error
            );

            alert(
                "Could not clear expenses."
            );
        }
    };

    return (
        <div className="app">
            <Sidebar />

            <main className="main-content">
                <Header />

                <SummaryCards
                    balance={balance}
                    setBalance={setBalance}
                    expenses={expenses}
                />

                <Budget
                    expenses={expenses}
                />

                <ExpenseForm
                    addExpense={addExpense}
                    editingExpense={editingExpense}
                    updateExpense={updateExpense}
                />

                <ExpenseTable
                    expenses={expenses}
                    deleteExpense={deleteExpense}
                    editExpense={editExpense}
                    clearAllExpenses={clearAllExpenses}
                />
            </main>
        </div>
    );
}

export default App;