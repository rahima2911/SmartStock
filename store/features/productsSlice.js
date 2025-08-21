import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await fetch("/api/products");
  return res.json();
});

export const addProduct = createAsyncThunk("products/add", async (product) => {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
});

export const updateProduct = createAsyncThunk("products/update", async ({ id, data }) => {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
});

export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  return res.json();
});

const productsSlice = createSlice({
  name: "products",
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (_, action) => action.payload)
      .addCase(addProduct.fulfilled, (state, action) => { state.push(action.payload); })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        return state.filter((p) => p.id !== action.payload.id);
      });
  },
});

export default productsSlice.reducer;
