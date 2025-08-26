import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  // Don't use 'id' field - MongoDB uses '_id' automatically
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    default: "User"
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  iconKey: { 
    type: String, 
    default: null 
  },
  editedAt: { 
    type: String, 
    default: null 
  }
}, {
  timestamps: true,
  // This ensures _id is returned as 'id' in JSON responses
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema);