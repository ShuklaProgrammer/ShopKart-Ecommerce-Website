import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : []
}


export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload
      localStorage.setItem("cart", JSON.stringify(state.cart))
    },
  }
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
