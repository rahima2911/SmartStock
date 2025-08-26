"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpense,
  updateExpense,
  clearEditingExpense,
} from "../store/features/expensesSlice";
import IconPicker from "./IconPicker";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RightBottomCard = () => {
  const dispatch = useDispatch();
  const editingExpense = useSelector((state) => state.expenses.editingExpense);

  const [rows, setRows] = useState([
    { name: "", price: "", user: "Ali", iconKey: "Grocery" },
  ]);

  const [editRow, setEditRow] = useState({
    name: "",
    price: "",
    user: "Ali",
    iconKey: "Grocery",
  });

  // Populate editRow when editingExpense changes
  useEffect(() => {
    if (editingExpense) {
      setEditRow({
        name: editingExpense.name,
        price: editingExpense.price,
        user: editingExpense.user,
        iconKey: editingExpense.iconKey || "Grocery",
      });
    }
  }, [editingExpense]);

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { name: "", price: "", user: "Ali", iconKey: "Grocery" }]);
  };

  const handleRemoveRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  // ✅ Add all rows (Add Mode) with newest on top
  const handleSubmitAll = () => {
    if (rows.some((row) => !row.name || !row.price)) {
      toast.error("⚠️ Please fill all expense names and prices");
      return;
    }

    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const expenseData = rows.map((row) => ({
      id: Number(`${Date.now()}${Math.floor(Math.random() * 10000)}`),
      name: row.name,
      price: Number(row.price),
      user: row.user,
      iconKey: row.iconKey || null,
      date: formattedDate,
      time: formattedTime,
      // ❌ no editedAt on add
    }));

    // Prepend new expenses so they appear at the top
    dispatch(addExpense(expenseData.reverse()));

    toast.success(`✅ ${rows.length} Expenses Added!`);
    setRows([{ name: "", price: "", user: "Ali", iconKey: "Grocery" }]);
  };

  // ✅ Update expense (Edit Mode) — only here we set editedAt
  const handleUpdate = () => {
    if (!editRow.name || !editRow.price) {
      toast.error("⚠️ Please enter expense name and price");
      return;
    }

    const now = new Date();
    const formattedDateTime = now.toLocaleString();

    const updatedData = {
      ...editingExpense,
      name: editRow.name,
      price: Number(editRow.price),
      user: editRow.user,
      iconKey: editRow.iconKey,
      editedAt: formattedDateTime, // ✅ only on update
    };

    dispatch(updateExpense(updatedData));

    toast.info(
      `✏️ Expense Updated!\nName: ${editRow.name}\nPrice: $${editRow.price}`
    );
    dispatch(clearEditingExpense());
  };

  const handleCancel = () => {
    dispatch(clearEditingExpense());
    setEditRow({ name: "", price: "", user: "Ali", iconKey: "Grocery" });
    toast.warning("❌ Edit Cancelled");
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 text-black p-4 h-full">
      <h2 className="text-lg font-semibold mb-3">
        {editingExpense ? "Edit Expense" : "Add Today’s Expenses"}
      </h2>

      {editingExpense ? (
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            placeholder="Expense Name"
            className="border rounded-lg px-3 py-2 text-sm flex-1 focus:outline-blue-600"
            value={editRow.name}
            onChange={(e) =>
              setEditRow({ ...editRow, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            className="border rounded-lg px-3 py-2 text-sm w-24"
            value={editRow.price}
            onChange={(e) =>
              setEditRow({ ...editRow, price: e.target.value })
            }
          />
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={editRow.user}
            onChange={(e) =>
              setEditRow({ ...editRow, user: e.target.value })
            }
          >
            <option>Ali</option>
            <option>Sara</option>
            <option>Ahmed</option>
            <option>Rahima</option>
          </select>

          <IconPicker
            selectedIcon={editRow.iconKey}
            onChange={(icon) => setEditRow({ ...editRow, iconKey: icon })}
          />

          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Update
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div className="max-h-40 overflow-y-auto overflow-x-hidden pr-2">
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="flex gap-2 flex-wrap items-center border-b pt-2 pb-2"
                >
                  <input
                    type="text"
                    placeholder="Expense Name"
                    className="border rounded-lg px-3 py-2 text-sm flex-1"
                    value={row.name}
                    onChange={(e) =>
                      handleRowChange(index, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    className="border rounded-lg px-3 py-2 text-sm w-24"
                    value={row.price}
                    onChange={(e) =>
                      handleRowChange(index, "price", e.target.value)
                    }
                  />
                  <select
                    className="border rounded-lg px-3 py-2 text-sm"
                    value={row.user}
                    onChange={(e) =>
                      handleRowChange(index, "user", e.target.value)
                    }
                  >
                    <option>Ali</option>
                    <option>Sara</option>
                    <option>Ahmed</option>
                    <option>Rahima</option>
                  </select>

                  <IconPicker
                    selectedIcon={row.iconKey}
                    onChange={(icon) => handleRowChange(index, "iconKey", icon)}
                  />

                  {rows.length > 1 && (
                    <button
                      onClick={() => handleRemoveRow(index)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddRow}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              + Add Row
            </button>
            <button
              onClick={handleSubmitAll}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add All
            </button>
          </div>
        </>
      )}

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </div>
  );
};

export default RightBottomCard;
