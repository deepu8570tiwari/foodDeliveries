import {Routes,Route} from 'react-router-dom'
import SignUp from './pages/Signup'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword';
export const userServiceUrl='http://localhost:5000';
function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
    </Routes>
  )
}

export default App
