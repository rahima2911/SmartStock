import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app", "api", "data", "db.json");

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

    // Daily 2-5 random expenses
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

function seed() {
  const dummyData = generateDummyData();
  fs.writeFileSync(filePath, JSON.stringify(dummyData, null, 2));
  console.log("✅ db.json generated with last 30 days dummy data.");
}

seed();
