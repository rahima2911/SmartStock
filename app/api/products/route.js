import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();
  const products = await Product.find();
  return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(request) {
  await connectDB();
  const data = await request.json();
  const newProduct = new Product(data);
  await newProduct.save();
  return new Response(JSON.stringify(newProduct), { status: 201 });
}
