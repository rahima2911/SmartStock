"use client";

import { useEffect, useState } from "react";
import { Package, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";

export default function ProductDetails() {
  const [products, setProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const getQuantityStatus = (quantity) => {
    if (quantity === 0) return { color: "bg-red-100 text-red-800 border border-red-200", text: "Out of Stock", dot: "bg-red-500" };
    if (quantity < 10) return { color: "bg-orange-100 text-orange-800 border border-orange-200", text: "Low Stock", dot: "bg-orange-500" };
    if (quantity < 20) return { color: "bg-blue-100 text-blue-800 border border-blue-200", text: "In Stock", dot: "bg-blue-500" };
    return { color: "bg-green-100 text-green-800 border border-green-200", text: "Well Stocked", dot: "bg-green-500" };
  };

  const calculateProfit = (selling, purchase) => {
    return ((selling - purchase) / purchase * 100).toFixed(1);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Available Inventories</h1>
        </div>
      </div>

      {/* Stats Section - Fixed */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Products</p>
                <p className="text-xl font-bold text-blue-800">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-green-600 text-sm font-medium">Total Stock</p>
                <p className="text-xl font-bold text-green-800">
                  {products.reduce((sum, product) => sum + (product.quantity || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid - Scrollable */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const status = getQuantityStatus(product.quantity || 0);
            const profit = calculateProfit(product.sellingPrice, product.purchasePrice);
            
            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Product Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h2>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></div>
                      {status.text}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Selling Price</span>
                      <span className="text-lg font-bold text-green-600">${product.sellingPrice}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Purchase Price</span>
                      <span className="text-lg font-semibold text-gray-700">${product.purchasePrice}</span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quantity</span>
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-semibold">
                        {product.quantity || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center p-8 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600">Your inventory is empty. Add some products to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}