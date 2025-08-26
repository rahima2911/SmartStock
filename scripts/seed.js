import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Expense from "../models/Expense.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const MONGODB_URI = "mongodb+srv://rahimasarwar29:riuPrs5w1J6pkMfu@cluster0.cuye5nt.mongodb.net/smartstock?retryWrites=true&w=majority";
console.log("MongoDB URI:", MONGODB_URI);

if (!MONGODB_URI) {
  console.error("❌ Please set MONGODB_URI in .env.local");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const productsPath = path.join(__dirname, "../app/api/data/product.json");
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
      await Product.deleteMany({});
      await Product.insertMany(products);
      console.log(`✅ Inserted ${products.length} products`);
    } else console.log("⚠️ product.json not found");

    const expensesPath = path.join(__dirname, "../app/api/data/db.json");
    if (fs.existsSync(expensesPath)) {
      const expenses = JSON.parse(fs.readFileSync(expensesPath, "utf-8"));
      await Expense.deleteMany({});
      await Expense.insertMany(expenses);
      console.log(`✅ Inserted ${expenses.length} expenses`);
    } else console.log("⚠️ db.json not found");

    console.log("🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
