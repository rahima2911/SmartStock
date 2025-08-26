import { connectDB } from "@/utils/db";
import Expense from "@/models/Expense";

export async function GET() {
  await connectDB();
  
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(expenses), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return new Response(JSON.stringify({ error: "Failed to fetch expenses" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  await connectDB();
  
  try {
    const body = await request.json();
    const inputExpenses = Array.isArray(body) ? body : [body];

    // Add default values for each expense
    const expensesWithDefaults = inputExpenses.map(expense => ({
      ...expense,
      date: expense.date || new Date().toISOString().split("T")[0],
      time: expense.time || new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: expense.user || "User"
    }));

    const newExpenses = await Expense.insertMany(expensesWithDefaults);
    
    return new Response(
      JSON.stringify(Array.isArray(body) ? newExpenses : newExpenses[0]), 
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return new Response(JSON.stringify({ error: "Failed to create expense(s)" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ✅ New DELETE route for multiple expenses
export async function DELETE(request) {
  await connectDB();
  
  try {
    const body = await request.json();
    const { ids } = body; // expecting { ids: ["id1", "id2", ...] }
    
    if (!ids || !Array.isArray(ids)) {
      return new Response(JSON.stringify({ error: "Invalid IDs array" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await Expense.deleteMany({ _id: { $in: ids } });
    
    return new Response(JSON.stringify({ 
      message: `Deleted ${result.deletedCount} expenses`,
      deletedCount: result.deletedCount
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('DELETE Multiple Error:', error);
    return new Response(JSON.stringify({ error: "Failed to delete expenses" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}