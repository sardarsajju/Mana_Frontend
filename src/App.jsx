// import { Route, Routes, useLocation } from "react-router-dom";
// import Login from "./Compoenets/Login";
// import Singuppage from "./Compoenets/Singup";
// import HomePage from "./Pages/HomePage";
// import Navbar from "./Navbar/Navbar";
// import Transactions from "./Pages/Transcations";
// import ProfilePage from "./Pages/Profile";
// import Deposit from "./Pages/Deposit";
// import LandingPage from "./Compoenets/Landingpage";
// import BankRegister from "./Compoenets/BankRegister";
// import Banklogin from "./Compoenets/Banklogin";
// import Bankhome from "./Pages/BaknHome";
// import BankingTranscations from "./Pages/Banking Transcations";

// function App() {
//   const location = useLocation();

//   const hideNavbarRoutes = ["/", "/userlogin", "/signup", "/bank","/banklogin","/bankhome"];

//   return (
//     <div>
//       {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

//       <Routes>
//         <Route path='/' element={<LandingPage />} />
//         <Route path='/signup' element={<Singuppage />} />
//         <Route path='/userlogin' element={<Login />} />

//       {/* Bank related routes */}
//         <Route path='/bank' element={<BankRegister />} />
//         <Route path='/banklogin' element={<Banklogin />} />
//         <Route path="/bankhome" element={<Bankhome/>}/>
//                 <Route path='/Banktransactions' element={<BankingTranscations />} />
//       {/* User related routes */}
//         <Route path='/home' element={<HomePage />} />
//         <Route path='/deposit' element={<Deposit />} />
//         <Route path='/transactions' element={<Transactions />} />
//         <Route path='/profile' element={<ProfilePage />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;



import { Routes, Route } from "react-router-dom";
import AuthLayout from "./Navbar/AuthLayout";
import LandingPage from "./Compoenets/Landingpage";
import Singuppage from "./Compoenets/Singup";
import Login from "./Compoenets/Login";
import BankRegister from "./Compoenets/BankRegister";
import Banklogin from "./Compoenets/Banklogin";
import Bankhome from "./Pages/BaknHome";
import BankingTranscations from "./Pages/Banking Transcations";
import MainLayout from "./Navbar/MainLayout";
import HomePage from "./Pages/HomePage";
import Deposit from "./Pages/Deposit";
import Transactions from "./Pages/Transcations";
import ProfilePage from "./Pages/Profile";
import Usercrads from "./Pages/Cards";

function App() {
  return (
    <Routes>

      {/* Routes WITHOUT Navbar */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/userlogin" element={<Login />} />
        <Route path="/signup" element={<Singuppage />} />
        <Route path="/bank" element={<BankRegister/>} />
        <Route path="/banklogin" element={<Banklogin/>} />
        <Route path="/bankhome" element={<Bankhome />} />
        <Route path="/banktransactions" element={<BankingTranscations />} />
      </Route>

      {/* Routes WITH Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path='/cards'element={<Usercrads/>}/>
      </Route>

    </Routes>
  );
}

export default App;
