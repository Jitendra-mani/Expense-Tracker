import { useState } from "react";

function ExpenseTable({
    expenses,
    deleteExpense,
    editExpense,
    clearAllExpenses
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Search + Category Filter
    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch = expense.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" ||
            expense.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <section className="expenses-section">

            <div className="expenses-header">
                <h2>Recent Expenses</h2>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                    <select
                        value={selectedCategory}
                        onChange={(event) =>
                            setSelectedCategory(event.target.value)
                        }
                    >
                        <option value="all">All Categories</option>
                        <option value="food">Food</option>
                        <option value="shopping">Shopping</option>
                        <option value="travel">Travel</option>
                        <option value="bills">Bills</option>
                        <option value="entertainment">
                            Entertainment
                        </option>
                        <option value="other">Other</option>
                    </select>

                    <button
                        className="clear-all-btn"
                        onClick={clearAllExpenses}
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {filteredExpenses.length === 0 ? (

                <p className="no-expenses">
                    No matching expenses found.
                </p>

            ) : (

                <div className="table-container">

                    <table>

                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredExpenses.map((expense) => (

                                <tr key={expense.id}>

                                    <td>{expense.title}</td>

                                    <td>{expense.category}</td>

                                    <td>
                                        ₹{expense.amount.toLocaleString("en-IN")}
                                    </td>

                                    <td>{expense.date}</td>

                                    <td>
                                        {expense.description || "-"}
                                    </td>

                                    <td className="action-buttons">

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                editExpense(expense)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                deleteExpense(expense.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </section>
    );
}

export default ExpenseTable;