import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/api/data/product.json");

const readData = () => JSON.parse(fs.readFileSync(filePath));
const writeData = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export async function PUT(request, context) {
  // ✅ await params
  const params = await context.params;

  const products = readData();

  const index = products.findIndex((p) => p.id === parseInt(params.id, 10));
  if (index === -1) {
    return new Response("Product not found", { status: 404 });
  }

  const updatedData = await request.json();

  // ✅ additive quantity update
  if (updatedData.quantity !== undefined) {
    products[index].quantity =
      (products[index].quantity || 0) + Number(updatedData.quantity);
  }

  products[index] = {
    ...products[index],
    ...updatedData,
    quantity: products[index].quantity,
  };

  writeData(products);

  return new Response(JSON.stringify(products[index]), { status: 200 });
}

export async function DELETE(request, context) {
  // ✅ await params
  const params = await context.params;

  const products = readData();

  const index = products.findIndex((p) => p.id === parseInt(params.id, 10));
  if (index === -1) {
    return new Response("Product not found", { status: 404 });
  }

  const deleted = products.splice(index, 1);
  writeData(products);

  return new Response(JSON.stringify(deleted[0]), { status: 200 });
}
