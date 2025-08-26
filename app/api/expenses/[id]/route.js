import { connectDB } from "@/utils/db";
import Expense from "@/models/Expense";

export async function PUT(request, context) {
  await connectDB();
  
  // ✅ NextJS 15 requires awaiting params
  const params = await context.params;
  const { id } = params;
  
  const body = await request.json();

  try {
    const updated = await Expense.findByIdAndUpdate(
      id,
      { 
        ...body, 
        editedAt: new Date().toLocaleString() 
      },
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ error: "Not found" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(updated), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return new Response(JSON.stringify({ error: "Failed to update expense" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request, context) {
  await connectDB();
  
  // ✅ NextJS 15 requires awaiting params
  const params = await context.params;
  const { id } = params;

  try {
    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Not found" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: "Deleted" }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return new Response(JSON.stringify({ error: "Failed to delete expense" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}