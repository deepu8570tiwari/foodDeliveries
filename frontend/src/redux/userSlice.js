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
    cartItems: [],
    totalAmount:0,
    myOrders:[],
    searchItems:null,
    socket:null,
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
      state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
    },
    updateQuantity:(state,action)=>{
      const {id, quantity}=action.payload
      const item=state.cartItems.find(i=>i.id==id)
      if(item){
        item.quantity=quantity;
      }
      state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
    },
    setRemoveCartItems:(state,action)=>{
      state.cartItems=state.cartItems.filter(i=>i.id!==action.payload);
      state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
    },
    setMyOrders:(state,action)=>{
      state.myOrders=action.payload
    },
    setAddOrders:(state,action)=>{
      state.myOrders=[action.payload,...state.myOrders]
    },
    setUpdateOrderStatus:(state,action)=>{
      const {orderId,shopId,status}=action.payload
      const order=state.myOrders.find(o=>o._id===orderId)
      if(order){
        if(order.shopOrders && order.shopOrders.shop._id===shopId){
          order.shopOrders.status=status;
        }
      }
    },
    updateRealTimeOrderStatus:(state,action)=>{
      const {orderId,shopId,status}=action.payload
      const order=state.myOrders.find(o=>o._id===orderId)
      if(order){
        const shopOrder=order.shopOrder.find(so=>so.shop._id===shopId)
        if(shopOrder){
          shopOrder.status=status
        }
      }
    },
    setSearchItems:(state,action)=>{
      state.searchItems=action.payload
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  }
});

export const {
  setUserData,
  setCity,
  setState,
  setAddress,
  setShopInMyCity,
  setItemInMyCity,
  setAddToCart,
  updateQuantity,
  setRemoveCartItems,
  setMyOrders,
  setAddOrders,
  setUpdateOrderStatus,
  setSearchItems,
  setSocket,
  updateRealTimeOrderStatus
} = userSlice.actions;

export default userSlice.reducer;
