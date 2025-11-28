import {Routes,Route, Navigate} from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword';
import useGetCurrentUser from '../hooks/useGetCurrentUser';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import useGetCity from '../hooks/useGetCity';
import useGetMyShop from '../hooks/useGetMyShop';
import CreateEditOwnerShop from './pages/AddOwnerShop';
import AddItems from './pages/AddItems';
import EditOwnerShop from './pages/EditOwnerShop';
import EditItems from './pages/EditItems';
import useGetShopByCity from '../hooks/useGetShopByCity';
import useGetItemsByCity from '../hooks/useGetItemsByCity';
import CartPage from './pages/CartPage';
import CheckOut from './pages/CheckOut';
import OrderPlaced from './pages/OrderPlaced';
import MyOrders from './pages/MyOrders';
import useGetMyOrder from '../hooks/useGetMyOrders';
import useUpdateLocation from '../hooks/useUpdateLocation';
import TrackOrder from './pages/TrackOrder';
export const userServiceUrl='http://localhost:5000';
function App() {
  const {userData}=useSelector(state=>state.user);
  //console.log("userData",userData)

   useGetCurrentUser();
   useUpdateLocation();
   useGetCity();
   useGetShopByCity();
   useGetItemsByCity();
   useGetMyShop();
   useGetMyOrder();
  return (
    <Routes>
      <Route path="/signup" element={!userData ? <SignUp/> :<Navigate to={"/"}/>}/>
      <Route path="/signin" element={!userData ? <SignIn/>:<Navigate to={"/"}/>}/>
      <Route path="/forgot-password" element={!userData ? <ForgotPassword/>: <Navigate to={"/"}/>}/>
      <Route path="/" element={userData ? <Home/>: <Navigate to={"/signin"}/>}/>
      <Route path="/create-shop" element={userData ? <CreateEditOwnerShop/>: <Navigate to={"/signin"}/>}/>
      <Route path="/edit-shop" element={userData ? <EditOwnerShop/>: <Navigate to={"/signin"}/>}/>
      <Route path="/add-items" element={userData ? <AddItems/>: <Navigate to={"/signin"}/>}/>
      <Route path="/edit-items/:itemId" element={userData ? <EditItems/>: <Navigate to={"/signin"}/>}/>
      <Route path="/cart" element={userData ? <CartPage/>: <Navigate to={"/signin"}/>}/>
      <Route path="/checkout" element={userData ? <CheckOut/>: <Navigate to={"/signin"}/>}/>
      <Route path="/order-placed" element={userData ? <OrderPlaced/>: <Navigate to={"/signin"}/>}/>
      <Route path="/my-orders" element={userData ? <MyOrders/>: <Navigate to={"/signin"}/>}/>
      <Route path="/track-orders/:orderId" element={userData ? <TrackOrder/>: <Navigate to={"/signin"}/>}/>
    </Routes>
  )
}

export default App
