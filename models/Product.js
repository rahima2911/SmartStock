import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // Don't use 'id' field - MongoDB uses '_id' automatically
  name: {
    type: String,
    required: true
  },
  barcode: {
    type: String,
    required: true,
    unique: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  img: {
    type: String,
    required: true
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

export default mongoose.models.Product || mongoose.model("Product", productSchema);