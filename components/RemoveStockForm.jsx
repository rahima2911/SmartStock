"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RemoveStockForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId"); // ✅ read from URL

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const selected = data.find((p) => p.id.toString() === productId);
        setProduct(selected || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    const qtyToRemove = Number(quantity);
    if (qtyToRemove <= 0) {
      toast.error("Enter a valid quantity!");
      return;
    }

    if (qtyToRemove > product.quantity) {
      toast.error("Quantity cannot be less than 0!");
      return;
    }

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: -qtyToRemove }),
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setProduct(updatedProduct);
        setQuantity("");
        toast.success("Stock removed successfully!");
      } else {
        toast.error("Failed to remove stock!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing stock!");
    }
  };

  if (!product) {
    return (
      <div className="p-6 bg-white shadow rounded-xl flex items-center justify-center h-full">
        <p className="text-gray-500">Select a product to remove stock</p>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 font-[Poppins]">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Remove Stock</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Product Name</label>
          <input
            type="text"
            value={product.name}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Barcode</label>
          <input
            type="text"
            value={product.barcode}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Selling Price</label>
          <input
            type="text"
            value={`$${product.sellingPrice}`}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Purchase Price</label>
          <input
            type="text"
            value={`$${product.purchasePrice}`}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Quantity to Remove</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder={`Available: ${product.quantity}`}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Remove Stock
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
