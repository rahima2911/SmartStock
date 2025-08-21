"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/features/productsSlice";

export default function Products() {
  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.products);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // RTK se data load karna
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // search ke liye filter logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = productsData.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 100);

    return () => clearTimeout(timer);
  }, [search, productsData]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">
        Our Products
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border rounded-lg px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={p.img}
              alt={p.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{p.name}</h2>
              <p className="text-gray-500 text-sm">Barcode: {p.barcode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
