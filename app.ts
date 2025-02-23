class Expense {
    name: string;
    amount: number;

    constructor(name: string, amount: number) {
        this.name = name;
        this.amount = amount;
    }
}

class ExpenseTracker {
    private expenses: Expense[] = [];
    private totalAmount: number = 0;

    constructor() {
        this.loadExpenses();
        this.updateUI();

        document.getElementById("add-expense")?.addEventListener("click", () => this.addExpense());
        document.getElementById("theme-toggle")?.addEventListener("click", () => this.toggleTheme());
    }

    private addExpense(): void {
        const nameInput = document.getElementById("expense-name") as HTMLInputElement;
        const amountInput = document.getElementById("expense-amount") as HTMLInputElement;

        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);

        if (name === "" || isNaN(amount) || amount <= 0) return;

        const expense = new Expense(name, amount);
        this.expenses.push(expense);
        this.totalAmount += amount;

        this.saveExpenses();
        this.updateUI();

        nameInput.value = "";
        amountInput.value = "";
    }

    private deleteExpense(index: number): void {
        this.totalAmount -= this.expenses[index].amount;
        this.expenses.splice(index, 1);
        this.saveExpenses();
        this.updateUI();
    }

    private updateUI(): void {
        const expenseList = document.getElementById("expense-list") as HTMLUListElement;
        const totalAmountEl = document.getElementById("total-amount") as HTMLSpanElement;

        expenseList.innerHTML = "";
        this.expenses.forEach((expense, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${expense.name} - ${expense.amount} HUF</span>
                <button class="delete" data-index="${index}">❌</button>
            `;

            li.querySelector(".delete")?.addEventListener("click", () => this.deleteExpense(index));

            expenseList.appendChild(li);
        });

        totalAmountEl.textContent = this.totalAmount.toString();
    }

    private saveExpenses(): void {
        localStorage.setItem("expenses", JSON.stringify(this.expenses));
        localStorage.setItem("totalAmount", this.totalAmount.toString());
    }

    private loadExpenses(): void {
        const savedExpenses = localStorage.getItem("expenses");
        const savedTotal = localStorage.getItem("totalAmount");

        this.expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
        this.totalAmount = savedTotal ? parseFloat(savedTotal) : 0;
    }

    private toggleTheme(): void {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ExpenseTracker();

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
});
