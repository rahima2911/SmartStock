"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchExpenses,
  removeExpense,
  removeMultipleExpenses,
  setEditingExpense,   // ✅ fixed import
} from "../store/features/expensesSlice";
import {
  FaShoppingCart,
  FaUtensils,
  FaCar,
  FaHome,
  FaFilm,
  FaHeartbeat,
  FaGift,
  FaLightbulb,
  FaEllipsisV,
} from "react-icons/fa";

const iconMap = {
  Grocery: { icon: <FaShoppingCart />, color: "bg-blue-500" },
  "Food and Drink": { icon: <FaUtensils />, color: "bg-red-500" },
  Transportation: { icon: <FaCar />, color: "bg-purple-500" },
  Shopping: { icon: <FaShoppingCart />, color: "bg-green-500" },
  Housing: { icon: <FaHome />, color: "bg-orange-500" },
  Entertainment: { icon: <FaFilm />, color: "bg-teal-500" },
  "Vehicle Maintenance": { icon: <FaCar />, color: "bg-yellow-500" },
  Health: { icon: <FaHeartbeat />, color: "bg-pink-500" },
  Gifts: { icon: <FaGift />, color: "bg-indigo-500" },
  Bills: { icon: <FaLightbulb />, color: "bg-gray-600" },
};

export default function ExpensesList() {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.list);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);

  const todayDate = new Date().toISOString().split("T")[0];
  

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const filteredExpenses = selectedDate
    ? expenses.filter((exp) => exp.date === selectedDate)
    : expenses;

  const groupedExpenses = filteredExpenses.reduce((acc, exp) => {
    if (!acc[exp.date]) acc[exp.date] = [];
    acc[exp.date].push(exp);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedExpenses).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  // ✅ Toggle selection
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Select all for a date
  const toggleSelectDate = (date) => {
    const ids = groupedExpenses[date].map((e) => e.id);
    const allSelected = ids.every((id) => selectedItems.includes(id));
    if (allSelected) {
      setSelectedItems((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedItems((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  // ✅ Delete selected
  const handleDeleteSelected = () => {
    dispatch(removeMultipleExpenses(selectedItems));
    setSelectedItems([]);
  };

  return (
    <div className="flex flex-col h-full font-sans bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-white shadow">
        <h2 className="font-semibold text-lg text-gray-800">Expenses</h2>

        {selectedItems.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
          >
            Delete Selected ({selectedItems.length})
          </button>
        )}

        <input
          type="date"
          className="border rounded px-2 py-1 text-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Expenses List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {sortedDates.map((date) => (
          <div key={date} className="mb-4">
            {/* Date Heading */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={groupedExpenses[date]
                  .map((e) => e.id)
                  .every((id) => selectedItems.includes(id))}
                onChange={() => toggleSelectDate(date)}
              />
              <h3 className="font-semibold text-md text-gray-700">
                {date === todayDate ? `Today (${todayDate})` : date}
              </h3>
            </div>

            {groupedExpenses[date].map((exp) => {
              const { icon, color } = iconMap[exp.iconKey || exp.name] || {
                icon: "💰",
                color: "bg-gray-400",
              };

              return (
                <div
                  key={exp.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 text-gray-900"
                >
                  {/* Left */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(exp.id)}
                      onChange={() => toggleSelect(exp.id)}
                    />
                    <div className={`p-2 rounded-full text-white ${color}`}>
                      {icon}
                    </div>
                    <div>
                      <p className="font-medium">{exp.name}</p>
                      <p className="text-xs text-gray-500">
                        {exp.time} • {exp.user}
                      </p>
                      {exp.editedAt && (
                        <p className="text-xs text-blue-500">
                          Edited at {exp.editedAt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 relative">
                    <span className="font-semibold">{`$${exp.price}`}</span>
                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === exp.id ? null : exp.id)
                      }
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <FaEllipsisV />
                    </button>

                    {menuOpen === exp.id && (
                      <div className="absolute right-0 top-6 bg-white border rounded z-10 shadow text-sm">
                        <button
                          onClick={() => {
                            dispatch(setEditingExpense(exp)); // ✅ fixed
                            setMenuOpen(null);
                          }}
                          className="block w-full px-3 py-1 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => dispatch(removeExpense(exp.id))}
                          className="block w-full px-3 py-1 text-red-500 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {sortedDates.length === 0 && (
          <p className="text-gray-500 py-4 text-center">No expenses found.</p>
        )}
      </div>
    </div>
  );
}
