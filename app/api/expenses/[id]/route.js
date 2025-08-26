import { connectDB } from "@/utils/db";
import Expense from "@/models/Expense";

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;
  const body = await request.json();

  const updated = await Expense.findByIdAndUpdate(
    id,
    { ...body, editedAt: new Date().toLocaleString() },
    { new: true }
  );

  if (!updated) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = params;
  const deleted = await Expense.findByIdAndDelete(id);

  if (!deleted) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
}
