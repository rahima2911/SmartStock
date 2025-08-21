const STORAGE_KEY = "expenses_data";

// Function to generate dummy expenses
function generateDummyData() {
  const users = ["Ali", "Sara", "Ahmed", "Rahima"];
  const expenseNames = [
    "Grocery",
    "Food and Drink",
    "Transportation",
    "Shopping",
    "Housing",
    "Entertainment",
    "Vehicle Maintenance",
  ];

  const data = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dailyCount = Math.floor(Math.random() * 4) + 2;

    for (let j = 0; j < dailyCount; j++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const name = expenseNames[Math.floor(Math.random() * expenseNames.length)];
      const price = (Math.floor(Math.random() * 500) + 50).toFixed(2);

      data.push({
        id: Date.now() + Math.random(),
        name,
        price: Number(price),
        user,
        date: date.toISOString().split("T")[0],
        time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  }

  return data;
}

// Initialize localStorage with dummy data if empty
export function initLocalStorage() {
  if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
    const dummyData = generateDummyData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyData));
  }
}

// Get all expenses
export function getExpenses() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Add or update expense
export function saveExpense(expense) {
  if (typeof window === "undefined") return;
  
  const expenses = getExpenses();
  if (expense.id) {
    const index = expenses.findIndex((e) => e.id === expense.id);
    if (index !== -1) {
      expenses[index] = expense;
    }
  } else {
    expense.id = Date.now();
    expense.date = new Date().toISOString().split("T")[0];
    expense.time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    expenses.push(expense);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// Delete expense
export function deleteExpense(id) {
  if (typeof window === "undefined") return;
  const expenses = getExpenses().filter((exp) => exp.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}
