import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    filterCategory: "",
    filterBrand: "",
    filterPrice: "",
    filterTags: "",
    search: "",
    sort: "",
  },
  reducers: {
    updateCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
    updateBrand: (state, action) => {
      state.filterBrand = action.payload;
    },
    updatePrice: (state, action) => {
      state.filterPrice = action.payload;
    },
    updateTags: (state, action) => {
      state.filterTags = action.payload;
    },
    updateSearch: (state, action) => {
      state.search = action.payload;
    },
    updateSort: (state, action) => {
      state.sort = action.payload;
    },
  },
});

export const {
  updateCategory,
  updateBrand,
  updatePrice,
  updateTags,
  updateSearch,
  updateSort,
} = productSlice.actions;
export default productSlice.reducer;
