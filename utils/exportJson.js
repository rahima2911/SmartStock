import { getExpenses } from "./localStorage"; // apni localStorage utils se import

// Local storage ka data JSON file me export karne ka function
export function exportExpensesToJSON() {
  const data = getExpenses(); // localStorage se data lao
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "expenses.json"; // file ka naam
  link.click();

  URL.revokeObjectURL(url); // memory cleanup
}
