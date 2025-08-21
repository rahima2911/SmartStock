import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/api/data/product.json"); // correct path

const readData = () => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "[]");
  }
  return JSON.parse(fs.readFileSync(filePath));
};

const writeData = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export async function GET() {
  const products = readData();
  return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(request) {
  const products = readData();
  const newProduct = await request.json();
  newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
  products.push(newProduct);
  writeData(products);
  return new Response(JSON.stringify(newProduct), { status: 201 });
}
