import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./Compoenets/Login";
import Singuppage from "./Compoenets/Singup";
import HomePage from "./Pages/HomePage";
import Navbar from "./Navbar/Navbar";
import Transactions from "./Pages/Transcations";
import ProfilePage from "./Pages/Profile";
import Deposit from "./Pages/Deposit";
import LandingPage from "./Compoenets/Landingpage";
import BankRegister from "./Compoenets/BankRegister";
import Banklogin from "./Compoenets/Banklogin";
import Bankhome from "./Pages/BaknHome";

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/userlogin", "/signup", "/bank","/banklogin","/bankhome"];

  return (
    <div>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<Singuppage />} />
        <Route path='/userlogin' element={<Login />} />

      
        <Route path='/bank' element={<BankRegister />} />
        <Route path='/banklogin' element={<Banklogin />} />
        <Route path="/bankhome" element={<Bankhome/>}/>

        <Route path='/home' element={<HomePage />} />
        <Route path='/deposit' element={<Deposit />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
