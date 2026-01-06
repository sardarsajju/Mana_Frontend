// Enhanced Navbar.jsx with lucide-react
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { AuthContext } from "../context/AuthContext";
import {
  Bug,
  LayoutDashboard,
  List,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Code2,
  ClipboardList,
  Menu,
  X
} from "lucide-react";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  const roleRoutes = {
    admin: "/admin/dashboard",
    tester: "/tester/profile",
    developer: "/developer/profile",
  };

  const roleLabels = {
    admin: "Admin",
    tester: "Tester",
    developer: "Developer",
  };

  const roleIcons = {
    admin: <Shield size={14} />,
    tester: <ClipboardList size={14} />,
    developer: <Code2 size={14} />,
  };

  const goProfile = () => {
    navigate(roleRoutes[user.role]);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.logo} onClick={() => navigate(roleRoutes[user.role])}>
          <Bug size={24} />
          <span>Bug Tracker</span>
        </div>
      </div>

      {/* Role Badge - Center */}
      <div className={styles.centerSection}>
        <div className={styles.roleBadge}>
          {roleIcons[user.role]}
          <span>{roleLabels[user.role]}</span>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className={styles.rightSection}>
        {/* Admin Links */}
        {user.role === "admin" && (
          <Link to="/admin/dashboard" className={styles.navLink}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
        )}

        {/* Tester Links */}
        {user.role === "tester" && (
          <>
            <Link to="/tester/dashboard" className={styles.navLink}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/tester-bugs" className={styles.navLink}>
              <List size={18} />
              <span>My Bugs</span>
            </Link>
          </>
        )}

        {/* Developer Links */}
        {user.role === "developer" && (
          <Link to="/bugs" className={styles.navLink}>
            <List size={18} />
            <span>Bug List</span>
          </Link>
        )}

        {/* Profile Dropdown */}
        <div className={styles.profileDropdown}>
          <button
            className={styles.profileBtn}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.avatar}>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <span className={styles.profileName}>{user.name || "Profile"}</span>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${isDropdownOpen ? styles.chevronUp : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownAvatar}>
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className={styles.dropdownInfo}>
                  <span className={styles.dropdownName}>{user.name}</span>
                  <span className={styles.dropdownRole}>{roleLabels[user.role]}</span>
                </div>
              </div>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={goProfile}>
                <User size={16} />
                <span>Profile</span>
              </button>
              <button className={styles.dropdownItem + ' ' + styles.logoutItem} onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuHeader}>
            <div className={styles.mobileAvatar}>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className={styles.mobileUserInfo}>
              <span className={styles.mobileName}>{user.name}</span>
              <span className={styles.mobileRole}>{roleLabels[user.role]}</span>
            </div>
          </div>

          <div className={styles.mobileMenuDivider}></div>

          <div className={styles.mobileNavLinks}>
            {user.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
            )}

            {user.role === "tester" && (
              <>
                <Link
                  to="/tester/dashboard"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/tester-bugs"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <List size={20} />
                  <span>My Bugs</span>
                </Link>
              </>
            )}

            {user.role === "developer" && (
              <Link
                to="/bugs"
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <List size={20} />
                <span>Bug List</span>
              </Link>
            )}

            <Link
              to={roleRoutes[user.role]}
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </div>

          <div className={styles.mobileMenuDivider}></div>

          <button className={styles.mobileLogoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </nav>
  );
}

export default Navbar;