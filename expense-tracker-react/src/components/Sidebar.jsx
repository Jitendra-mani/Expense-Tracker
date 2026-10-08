function Sidebar() {
    return (
        <aside className="sidebar">

            <h2 className="logo">
                Expense<span>Track</span>
            </h2>

            <nav>
                <a href="#" className="active">
                    Dashboard
                </a>

                <a href="#">
                    Expenses
                </a>
            </nav>

        </aside>
    );
}

export default Sidebar;