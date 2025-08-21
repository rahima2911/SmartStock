import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto"; // unique id ke liye

// ✅ db.json ka correct path
const filePath = path.join(process.cwd(), "app", "api", "data", "db.json");

// read file
function readData() {
  if (!fs.existsSync(filePath)) {
    return []; // agar file hi na ho to empty array
  }
  const data = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(data); // ✅ ensure array return hota hai
  } catch {
    return [];
  }
}

// write file
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET → sab data
export async function GET() {
  const expenses = readData();
  return NextResponse.json(expenses);
}

// POST → ek ya multiple expense
export async function POST(req) {
  const expenses = readData(); // ✅ purana data lo
  const body = await req.json();

  // ✅ agar ek object aaya to array banao
  const inputExpenses = Array.isArray(body) ? body : [body];

  const newExpenses = inputExpenses.map((exp) => ({
    ...exp,
    id: randomUUID(), // ✅ unique id
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const updatedExpenses = [...expenses, ...newExpenses];
  writeData(updatedExpenses);

  // ✅ agar ek object bheja tha to ek hi return karo
  return NextResponse.json(Array.isArray(body) ? newExpenses : newExpenses[0], {
    status: 201,
  });
}
