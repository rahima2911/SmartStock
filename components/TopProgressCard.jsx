"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchExpenses } from "../store/features/expensesSlice"; // ✅ update import
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TopProgressCard() {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.list);

  useEffect(() => {
    dispatch(fetchExpenses()); // ✅ loadExpenses → fetchExpenses
  }, [dispatch]);

  // Group by date (monthly)
  const groupedData = expenses.reduce((acc, exp) => {
    acc[exp.date] = (acc[exp.date] || 0) + exp.price;
    return acc;
  }, {});

  // Sorted date-wise
  const sortedDates = Object.keys(groupedData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const chartData = sortedDates.map((date) => ({
    date,
    amount: groupedData[date],
  }));

  // Get range (first & last date)
  const rangeStart = sortedDates[0] || "";
  const rangeEnd = sortedDates[sortedDates.length - 1] || "";

  return (
    <div className="bg-white shadow-md w-full h-[100%] p-4 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">Expenses</h2>
        <div className="text-sm text-gray-500">
          {rangeStart && rangeEnd
            ? `${rangeStart} - ${rangeEnd}`
            : "No Data"}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            {/* XAxis hide kar diya */}
            <XAxis dataKey="date" hide />

            <Tooltip />

            {/* Bars */}
            <Bar
              dataKey="amount"
              fill="#d0e4ff"
              activeBar={{ fill: "#157aff" }} // hover color
              radius={0} // rectangle, no round corners
              animationBegin={0}
              animationDuration={1200} // smooth animation
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
