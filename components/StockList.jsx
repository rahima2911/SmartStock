"use client";

import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StockList({ action = "add" }) {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleNavigate = (productId) => {
    const url = new URL(`/${action}Stock`, window.location.origin);
    url.searchParams.append("productId", productId);
    router.push(url.pathname + url.search);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 h-full font-[Poppins]">
      <div className="flex items-center gap-2 mb-6">
        <Package className="text-indigo-600 w-7 h-7" />
        <h2 className="text-2xl font-bold text-gray-800">Products List</h2>
      </div>

      <div className="overflow-y-auto h-[90%] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 text-sm md:text-base uppercase tracking-wide">
              <th className="px-5 py-3 font-bold">Product Name</th>
              <th className="px-5 py-3 font-bold">Barcode</th>
              <th className="px-5 py-3 font-bold">Selling Price</th>
              <th className="px-5 py-3 font-bold">Purchase Price</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p, index) => (
                <tr
                  key={p.id}
                  onClick={() => handleNavigate(p.id)}
                  className={`transition-all duration-200 cursor-pointer border-l-4 border-transparent ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } ${
                    action === "add" 
                      ? "hover:bg-sky-100 hover:border-sky-400" 
                      : "hover:bg-red-100 hover:border-red-400"
                  }`}
                >
                  <td className="px-5 py-4 font-medium text-gray-800 whitespace-nowrap">
                    {p.name}
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-mono whitespace-nowrap">
                    {p.barcode}
                  </td>
                  <td className="px-5 py-4 text-green-600 font-semibold whitespace-nowrap">
                    ${p.sellingPrice}
                  </td>
                  <td className="px-5 py-4 text-red-600 font-semibold whitespace-nowrap">
                    ${p.purchasePrice}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}