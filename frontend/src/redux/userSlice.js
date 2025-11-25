import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    state: null,
    address: null,
    shopInMyCity: null,
    itemInMyCity: null,
    cartItems: []        // ✅ FIXED
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemInMyCity: (state, action) => {
      state.itemInMyCity = action.payload;
    },
    setAddToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find(i => i.id === cartItem.id);

      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      console.log(state.cartItems);
    }
  }
});

export const {
  setUserData,
  setCity,
  setState,
  setAddress,
  setShopInMyCity,
  setItemInMyCity,
  setAddToCart
} = userSlice.actions;

export default userSlice.reducer;
