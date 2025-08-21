"use client";

import React from "react";

import Sidebar from "../../components/Sidebar";
import StockList from "../../components/StockList";
import RemoveStockForm from "../../components/RemoveStockForm";

export default function RemoveStockPage() {
   return (
      <div className="flex h-screen">
        {/* Sidebar - Left Column */}
        <Sidebar />
  
        {/* Middle Section - Stock List */}
        <div className="flex-1">
          <StockList action="remove" />
        </div>
  
        {/* Right Section - Stock Form */}
        <div className="w-[30%]">
          <RemoveStockForm />
        </div>
      </div>
    );
}