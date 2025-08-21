import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "./features/expensesSlice";
import productsReducer from "./features/productsSlice";

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    products: productsReducer,
  },
});
