import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

export async function PUT(request, context) {
  await connectDB();
  
  // ✅ NextJS 15 requires awaiting params
  const params = await context.params;
  const { id } = params;
  
  const data = await request.json();

  try {
    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle quantity update (additive like your original)
    if (data.quantity !== undefined) {
      product.quantity = (product.quantity || 0) + Number(data.quantity);
    }

    // Update other fields
    Object.keys(data).forEach(key => {
      if (key !== 'quantity') {
        product[key] = data[key];
      }
    });

    await product.save();

    return new Response(JSON.stringify(product), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return new Response(JSON.stringify({ error: "Failed to update product" }), { 
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
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Product not found" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(deleted), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return new Response(JSON.stringify({ error: "Failed to delete product" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}