'use client';

import Sidebar from "../../components/Sidebar";
import StockList from "../../components/StockList";
import StockForm from "../../components/StockForm";

export default function AddStock() {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Left Column */}
      <Sidebar />

      {/* Middle Section - Stock List */}
      <div className="flex-1">
        <StockList action="add" />
      </div>

      {/* Right Section - Stock Form */}
      <div className="w-[30%]">
        <StockForm />
      </div>
    </div>
  );
}