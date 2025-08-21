"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StockForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId"); // ✅ id from URL
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  // Product fetch
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const selected = data.find((p) => p.id.toString() === productId);
        setProduct(selected || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number(quantity) }),
      });

      if (res.ok) {
        toast.success("✅ Stock updated successfully!");
        setQuantity(""); // reset input
      } else {
        toast.error("❌ Failed to update stock");
      }
    } catch (err) {
      toast.error("⚠️ Error updating stock");
      console.error("Error updating stock:", err);
    }
  };

  if (!product) {
    return (
      <div className="p-6 bg-white shadow rounded-xl flex items-center justify-center h-full">
        <p className="text-gray-500">Select a product to update stock</p>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 font-[Poppins]">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Update Stock</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Product Name</label>
          <input
            type="text"
            value={product.name}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Barcode */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Barcode</label>
          <input
            type="text"
            value={product.barcode}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Selling Price */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Selling Price</label>
          <input
            type="text"
            value={`$${product.sellingPrice}`}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Purchase Price */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Purchase Price</label>
          <input
            type="text"
            value={`$${product.purchasePrice}`}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter quantity to add"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Update Stock
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
