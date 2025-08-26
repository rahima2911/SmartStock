import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  user: String,
  date: String,
  time: String,
  iconKey: { type: String, default: null },
  editedAt: { type: String, default: null },
});

export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
