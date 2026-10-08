function SummaryCards({
    balance,
    setBalance,
    expenses
}) {

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );


    // Calculate remaining balance
    const remainingBalance =
        balance - totalExpenses;

    const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, "0")}`;

const thisMonthExpenses = expenses
  .filter((expense) => expense.date.startsWith(currentMonth))
  .reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <section className="summary-grid">

            {/* Total Balance */}
            <div className="summary-card">

                <p>Total Balance</p>

                <h2>
                    ₹{remainingBalance.toLocaleString("en-IN")}
                </h2>

                <input
                    type="number"
                    placeholder="Enter starting balance"
                    value={balance === 0 ? "" : balance}
                    onChange={(e) =>
                        setBalance(Number(e.target.value))
                    }
                />

                <span>
                    Starting balance
                </span>

            </div>


            {/* Total Expenses */}
            <div className="summary-card">

                <p>Total Expenses</p>

                <h2>
                    ₹{totalExpenses.toLocaleString("en-IN")}
                </h2>

                <span>
                    All expenses
                </span>

            </div>


            {/* This Month */}
            <div className="summary-card">

                <p>This Month</p>

                <h2>
                    ₹{thisMonthExpenses.toLocaleString("en-IN")}
                </h2>

                <span>
                    Current month
                </span>

            </div>


            {/* Transactions */}
            <div className="summary-card">

                <p>Transactions</p>

                <h2>
                    {expenses.length}
                </h2>

                <span>
                    Total transactions
                </span>

            </div>

        </section>
    );
}

export default SummaryCards;