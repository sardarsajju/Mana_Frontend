import { NavLink } from "react-router-dom";
import "./AdminNavbarmodule.css";

const AdminNavbar = () => {
    return (
        <nav className="admin-navbar">
            <div className="admin-logo">Admin Panel</div>

            <ul className="admin-nav-links">
                <li>
                    <NavLink to="/admin/home" className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }>
                        Home
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/admin/users" className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }>
                        User Details
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/admin/kyc" className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }>
                        Verify KYC
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;
