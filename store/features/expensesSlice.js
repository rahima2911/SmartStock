import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Async Thunks (API calls)

// Fetch all expenses
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchAll",
  async () => {
    const res = await fetch("/api/expenses");
    return await res.json();
  }
);

// Add new expense(s)
export const addExpense = createAsyncThunk(
  "expenses/add",
  async (expenseOrExpenses) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseOrExpenses), // can be object OR array
    });

    const data = await res.json();
    console.log("Data", data);

    // Ensure return is always an array for consistency
    const expenses = Array.isArray(data) ? data : [data];

    // Ensure every expense has an id fallback
    return expenses.map((exp) => ({
      ...exp,
      id: exp.id || Date.now() + Math.random(),
    }));
  }
);

// Update expense
export const updateExpense = createAsyncThunk(
  "expenses/update",
  async (expense) => {
    const { id, ...updates } = expense;

    const res = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    // ✅ return updated object with id guaranteed
    return { ...expense, ...data, id };
  }
);

// Delete single expense
export const removeExpense = createAsyncThunk(
  "expenses/delete",
  async (id) => {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    return id;
  }
);

// ✅ Delete multiple expenses
export const removeMultipleExpenses = createAsyncThunk(
  "expenses/deleteMultiple",
  async (ids) => {
    await Promise.all(
      ids.map((id) => fetch(`/api/expenses/${id}`, { method: "DELETE" }))
    );
    return ids;
  }
);

// ✅ Slice
const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    list: [],
    loading: false,
    error: null,
    editingExpense: null, // ✅ Add for edit form
  },
  reducers: {
    setEditingExpense: (state, action) => {
      state.editingExpense = action.payload;
    },
    clearEditingExpense: (state) => {
      state.editingExpense = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addExpense.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.list = [...state.list, ...action.payload];
        } else {
          state.list.push(action.payload);
        }
      })

      // Update
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.list.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // Delete single
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.id !== action.payload);
      })

      // ✅ Delete multiple
      .addCase(removeMultipleExpenses.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => !action.payload.includes(e.id));
      });
  },
});

export const {
  setEditingExpense,
  clearEditingExpense,
} = expensesSlice.actions;

export default expensesSlice.reducer;
