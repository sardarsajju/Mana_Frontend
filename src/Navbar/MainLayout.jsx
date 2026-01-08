
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Header from "../Pages/Header";

const MainLayout = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Header/>
      <Outlet />
    </>
  );
};

export default MainLayout;
