// ==========================================
// EXPENSE TRACKER - SCRIPT.JS
// ==========================================


// ------------------------------------------
// DOM ELEMENTS
// ------------------------------------------

const expenseForm = document.getElementById("expenseForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const expenseTableBody =
    document.getElementById("expenseTableBody");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const totalBalanceElement =
    document.getElementById("totalBalance");

const totalExpensesElement =
    document.getElementById("totalExpenses");

const thisMonthElement =
    document.getElementById("thisMonth");

const transactionCountElement =
    document.getElementById("transactionCount");

const currentMonthElement =
    document.getElementById("currentMonth");

const budgetAmountElement =
    document.getElementById("budgetAmount");

const remainingBudgetElement =
    document.getElementById("remainingBudget");

const budgetProgress =
    document.getElementById("budgetProgress");

const budgetInput =
    document.getElementById("budgetInput");

const setBudgetBtn =
    document.getElementById("setBudgetBtn");

const submitBtn =
    document.getElementById("submitBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");


// ------------------------------------------
// DEFAULT VALUES
// ------------------------------------------

// Starting balance
const startingBalance = 25000;


// Get monthly budget from LocalStorage
let monthlyBudget =
    Number(localStorage.getItem("monthlyBudget")) || 5000;


// Get expenses from LocalStorage
let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];


// Used while editing an expense
let editingExpenseId = null;


// ------------------------------------------
// FORMAT CURRENCY
// ------------------------------------------

function formatCurrency(amount) {

    return `₹${Number(amount).toLocaleString("en-IN")}`;

}


// ------------------------------------------
// DISPLAY EXPENSES
// ------------------------------------------

function displayExpenses(expensesToDisplay = expenses) {

    expenseTableBody.innerHTML = "";


    // If there are no expenses
    if (expensesToDisplay.length === 0) {

        expenseTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No expenses found
                </td>
            </tr>
        `;

        return;
    }


    expensesToDisplay.forEach(expense => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${expense.title}</td>

            <td>
                ${formatCurrency(expense.amount)}
            </td>

            <td>
                ${capitalize(expense.category)}
            </td>

            <td>
                ${formatDate(expense.date)}
            </td>

            <td>
                ${expense.description || "-"}
            </td>

            <td>

                <button
                    onclick="editExpense(${expense.id})"
                >
                    Edit
                </button>

                <button
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>

            </td>

        `;


        expenseTableBody.appendChild(row);

    });

}


// ------------------------------------------
// ADD / UPDATE EXPENSE
// ------------------------------------------

expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title =
        titleInput.value.trim();

    const amount =
        Number(amountInput.value);

    const category =
        categoryInput.value;

    const date =
        dateInput.value;

    const description =
        descriptionInput.value.trim();


    // Validation
    if (!title || amount <= 0 || !category || !date) {

        alert("Please fill all required fields.");

        return;
    }


    // --------------------------------------
    // UPDATE EXISTING EXPENSE
    // --------------------------------------

    if (editingExpenseId !== null) {

        expenses = expenses.map(expense => {

            if (expense.id === editingExpenseId) {

                return {

                    ...expense,

                    title: title,
                    amount: amount,
                    category: category,
                    date: date,
                    description: description

                };

            }

            return expense;

        });


        editingExpenseId = null;

        submitBtn.textContent = "Add Expense";

    }


    // --------------------------------------
    // ADD NEW EXPENSE
    // --------------------------------------

    else {

        const newExpense = {

            id: Date.now(),

            title: title,

            amount: amount,

            category: category,

            date: date,

            description: description

        };


        expenses.push(newExpense);

    }


    saveExpenses();

    expenseForm.reset();

});


// ------------------------------------------
// SAVE EXPENSES
// ------------------------------------------

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    displayExpenses();

    updateSummary();

}


// ------------------------------------------
// DELETE EXPENSE
// ------------------------------------------

function deleteExpense(id) {

    const confirmed =
        confirm("Are you sure you want to delete this expense?");


    if (!confirmed) {
        return;
    }


    expenses =
        expenses.filter(expense => expense.id !== id);


    saveExpenses();

}


// ------------------------------------------
// EDIT EXPENSE
// ------------------------------------------

function editExpense(id) {

    const expense =
        expenses.find(expense => expense.id === id);


    if (!expense) {
        return;
    }


    titleInput.value =
        expense.title;

    amountInput.value =
        expense.amount;

    categoryInput.value =
        expense.category;

    dateInput.value =
        expense.date;

    descriptionInput.value =
        expense.description;


    editingExpenseId = id;


    submitBtn.textContent =
        "Update Expense";


    // Scroll to form
    expenseForm.scrollIntoView({
        behavior: "smooth"
    });

}


// ------------------------------------------
// SEARCH
// ------------------------------------------

searchInput.addEventListener("input", function() {

    const searchText =
        searchInput.value.toLowerCase().trim();


    const filteredExpenses =
        expenses.filter(expense => {

            return (

                expense.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                expense.category
                    .toLowerCase()
                    .includes(searchText)

                ||

                expense.description
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displayExpenses(filteredExpenses);

});


// ------------------------------------------
// CATEGORY FILTER
// ------------------------------------------

categoryFilter.addEventListener("change", function() {

    const selectedCategory =
        categoryFilter.value;


    if (selectedCategory === "all") {

        displayExpenses(expenses);

        return;
    }


    const filteredExpenses =
        expenses.filter(expense =>
            expense.category === selectedCategory
        );


    displayExpenses(filteredExpenses);

});


// ------------------------------------------
// UPDATE DASHBOARD SUMMARY
// ------------------------------------------

function updateSummary() {


    // --------------------------------------
    // TOTAL EXPENSES
    // --------------------------------------

    const totalExpenses =
        expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );


    totalExpensesElement.textContent =
        formatCurrency(totalExpenses);


    // --------------------------------------
    // TOTAL BALANCE
    // --------------------------------------

    const remainingBalance =
        startingBalance - totalExpenses;


    totalBalanceElement.textContent =
        formatCurrency(remainingBalance);


    // --------------------------------------
    // TRANSACTION COUNT
    // --------------------------------------

    transactionCountElement.textContent =
        expenses.length;


    // --------------------------------------
    // THIS MONTH
    // --------------------------------------

    const now = new Date();

    const currentMonth =
        now.getMonth();

    const currentYear =
        now.getFullYear();


    const thisMonthExpenses =
        expenses.filter(expense => {

            const expenseDate =
                new Date(expense.date);


            return (

                expenseDate.getMonth() === currentMonth

                &&

                expenseDate.getFullYear() === currentYear

            );

        });


    const thisMonthTotal =
        thisMonthExpenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );


    thisMonthElement.textContent =
        formatCurrency(thisMonthTotal);


    // --------------------------------------
    // CURRENT MONTH NAME
    // --------------------------------------

    currentMonthElement.textContent =
        now.toLocaleString("en-IN", {
            month: "long",
            year: "numeric"
        });


    // --------------------------------------
    // MONTHLY BUDGET
    // --------------------------------------

    budgetAmountElement.textContent =
        formatCurrency(monthlyBudget);


    // --------------------------------------
    // REMAINING BUDGET
    // --------------------------------------

    const remainingBudget =
        monthlyBudget - thisMonthTotal;


    remainingBudgetElement.textContent =
        `${formatCurrency(
            Math.max(remainingBudget, 0)
        )} remaining`;


    // --------------------------------------
    // BUDGET PROGRESS
    // --------------------------------------

    let percentage = 0;


    if (monthlyBudget > 0) {

        percentage =
            (thisMonthTotal / monthlyBudget) * 100;

    }


    percentage =
        Math.min(percentage, 100);


    budgetProgress.style.width =
        `${percentage}%`;

}


// ------------------------------------------
// SET MONTHLY BUDGET
// ------------------------------------------

setBudgetBtn.addEventListener("click", function() {

    const newBudget =
        Number(budgetInput.value);


    if (newBudget <= 0) {

        alert("Please enter a valid budget.");

        return;
    }


    monthlyBudget = newBudget;


    localStorage.setItem(
        "monthlyBudget",
        monthlyBudget
    );


    budgetInput.value = "";


    updateSummary();

});


// ------------------------------------------
// CLEAR ALL EXPENSES
// ------------------------------------------

clearAllBtn.addEventListener("click", function() {

    if (expenses.length === 0) {

        alert("There are no expenses to clear.");

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete all expenses?"
        );


    if (!confirmed) {
        return;
    }


    expenses = [];


    saveExpenses();

});


// ------------------------------------------
// CAPITALIZE CATEGORY
// ------------------------------------------

function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}


// ------------------------------------------
// FORMAT DATE
// ------------------------------------------

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString("en-IN");

}


// ------------------------------------------
// INITIAL LOAD
// ------------------------------------------

displayExpenses();

updateSummary();