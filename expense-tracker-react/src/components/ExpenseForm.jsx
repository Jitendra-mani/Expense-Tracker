import { useEffect, useState } from "react";

function ExpenseForm({
    addExpense,
    editingExpense,
    updateExpense
}) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");

    // Load selected expense into the form
    useEffect(() => {
        if (editingExpense) {
            setTitle(editingExpense.title);
            setAmount(editingExpense.amount);
            setCategory(editingExpense.category);
            setDate(editingExpense.date);
            setDescription(editingExpense.description);
        }
    }, [editingExpense]);

    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !amount || !category || !date) {
        alert("Please fill all required fields.");
        return;
    }

    const expenseData = {
        title: title,
        amount: Number(amount),
        category: category,
        date: date,
        description: description
    };

    try {
        if (editingExpense) {
            // Keep existing edit functionality for now
            updateExpense({
                ...expenseData,
                id: editingExpense.id
            });
        } else {
            // Send new expense to backend
            const response = await fetch(
                "http://localhost:5000/api/expenses",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(expenseData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add expense");
            }

            const savedExpense = await response.json();

            console.log("Expense saved to backend:", savedExpense);

            // Add it to React state
            addExpense(savedExpense);
        }

        // Clear form
        setTitle("");
        setAmount("");
        setCategory("");
        setDate("");
        setDescription("");

    } catch (error) {
        console.error("Error adding expense:", error);
        alert("Could not save expense to backend.");
    }
};
    return (
        <section className="expense-form-section">
            <h2>
                {editingExpense
                    ? "Edit Expense"
                    : "Add Expense"}
            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Expense title"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                />

                <input
                    type="number"
                    placeholder="Amount"
                    min="1"
                    value={amount}
                    onChange={(event) =>
                        setAmount(event.target.value)
                    }
                />

                <select
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value)
                    }
                >
                    <option value="">
                        Select Category
                    </option>

                    <option value="food">Food</option>
                    <option value="shopping">Shopping</option>
                    <option value="travel">Travel</option>
                    <option value="bills">Bills</option>
                    <option value="entertainment">
                        Entertainment
                    </option>
                    <option value="other">Other</option>
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(event) =>
                        setDate(event.target.value)
                    }
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                ></textarea>

                <button
                    type="submit"
                    id="submitBtn"
                >
                    {editingExpense
                        ? "Update Expense"
                        : "Add Expense"}
                </button>
            </form>
        </section>
    );
}

export default ExpenseForm;