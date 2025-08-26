import { connectDB } from "@/utils/db";
import Expense from "@/models/Expense";

export async function GET() {
  await connectDB();
  const expenses = await Expense.find();
  return new Response(JSON.stringify(expenses), { status: 200 });
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const inputExpenses = Array.isArray(body) ? body : [body];

  const newExpenses = await Expense.insertMany(inputExpenses);
  return new Response(JSON.stringify(Array.isArray(body) ? newExpenses : newExpenses[0]), { status: 201 });
}
