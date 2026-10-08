import { useEffect, useState } from "react";

function Budget({ expenses }) {
    const [budget, setBudget] = useState(() => {
        try {
            const savedBudget = localStorage.getItem("expenseTrackerBudget");
            return savedBudget !== null ? Number(savedBudget) : 5000;
        } catch {
            return 5000;
        }
    });

    const [budgetInput, setBudgetInput] = useState("");

    useEffect(() => {
        try {
            localStorage.setItem("expenseTrackerBudget", String(budget));
        } catch (error) {
            console.error("Could not save budget:", error);
        }
    }, [budget]);

    const currentMonth = new Date().toISOString().slice(0, 7);

    const monthlyExpenses = expenses
        .filter((expense) => expense.date.startsWith(currentMonth))
        .reduce((total, expense) => total + expense.amount, 0);

    const remainingBudget = budget - monthlyExpenses;
    const progress = budget > 0
        ? Math.min((monthlyExpenses / budget) * 100, 100)
        : 0;

    const handleSetBudget = (event) => {
        event.preventDefault();

        const newBudget = Number(budgetInput);

        if (!budgetInput || newBudget <= 0) {
            alert("Please enter a budget greater than zero.");
            return;
        }

        setBudget(newBudget);
        setBudgetInput("");
    };

    return (
        <section className="budget-card">
            <p>Monthly Budget</p>
            <h2>₹{budget.toLocaleString("en-IN")}</h2>

            <div className="progress-container">
                <div
                    id="budgetProgress"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <p>
                {remainingBudget >= 0
                    ? `₹${remainingBudget.toLocaleString("en-IN")} remaining`
                    : `₹${Math.abs(remainingBudget).toLocaleString("en-IN")} over budget`}
            </p>

            <form onSubmit={handleSetBudget}>
                <input
                    type="number"
                    min="1"
                    placeholder="Enter monthly budget"
                    value={budgetInput}
                    onChange={(event) =>
                        setBudgetInput(event.target.value)
                    }
                />

                <button type="submit" id="setBudgetBtn">
                    Set Budget
                </button>
            </form>
        </section>
    );
}

export default Budget;