// Updated Navbar.jsx
import React, { useContext, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { AuthContext } from "../context/AuthContext";
import {
  Bug,
  LayoutDashboard,
  List,
  User,
  Users,
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
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check if user exists
  if (!user) return null;

  // ✅ Hide navbar for Super Admin pages (they have their own sidebar)
  if (location.pathname.startsWith("/super-admin")) {
    return null;
  }

  // ✅ Hide navbar for super_admin role (in case they navigate elsewhere)
  if (user.role === "super_admin") {
    return null;
  }

  // Profile routes - separate from dashboard
  const profileRoutes = {
    admin: "/admin/profile",
    tester: "/tester/profile",
    developer: "/developer/profile",
  };

  // Dashboard/Home routes
  const dashboardRoutes = {
    admin: "/admin/dashboard",
    tester: "/tester/dashboard",
    developer: "/bugs",
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
    navigate(profileRoutes[user.role]);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    // Clear organization data when logging out
    localStorage.removeItem('org_id');
    localStorage.removeItem('org_name');
    localStorage.removeItem('user_role');
    
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get organization name for display (optional)
  const orgName = localStorage.getItem('org_name');

  // ✅ MINIMAL NAVBAR FOR SELECT ORGANIZATION PAGE
  if (location.pathname === "/admin/select-organization") {
    return (
      <nav className={styles.minimalNavbar}>
        {/* Left - Logo */}
        <div className={styles.logo}>
          <Bug size={24} />
          <span>Bug Tracker</span>
        </div>

        {/* Center - Admin Badge */}
        <div className={styles.centerSection}>
          <div className={styles.roleBadge}>
            <Shield size={16} />
            <span>Admin</span>
          </div>
        </div>

        {/* Right - Logout */}
        <button className={styles.minimalLogoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    );
  }

  // Check if admin has selected an organization
  if (user.role === 'admin') {
    const orgId = localStorage.getItem('org_id');
    if (!orgId) {
      // Don't show navbar if admin hasn't selected an organization
      return null;
    }
  }

  // ✅ FULL NAVBAR FOR ALL OTHER PAGES
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.logo} onClick={() => navigate(dashboardRoutes[user.role])}>
          <Bug size={24} />
          <span>Bug Tracker</span>
        </div>
      </div>

      {/* Role Badge - Center */}
      <div className={styles.centerSection}>
        <div className={styles.roleBadge}>
          {roleIcons[user.role]}
          <span>{roleLabels[user.role]}</span>
          {/* Optionally show org name for admin */}
          {user.role === 'admin' && orgName && (
            <span className={styles.orgBadge}> - {orgName}</span>
          )}
        </div>
      </div>

      {/* Desktop Menu */}
      <div className={styles.rightSection}>
        {/* Admin Links */}
        {user.role === "admin" && (
          <>
            <Link to="/admin/dashboard" className={styles.navLink}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/users" className={styles.navLink}>
              <Users size={18} />
              <span>Users</span>
            </Link>
          </>
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
              <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
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
              <>
                <Link
                  to="/admin/dashboard"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users size={20} />
                  <span>Users</span>
                </Link>
              </>
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
              to={profileRoutes[user.role]}
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