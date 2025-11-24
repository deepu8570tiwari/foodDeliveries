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
export const userServiceUrl='http://localhost:5000';
function App() {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  const {userData}=useSelector(state=>state.user);
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
    </Routes>
  )
}

export default App
