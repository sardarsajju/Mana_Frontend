// src/pages/SuperAdmin/SuperAdminRegister.jsx
import React, { useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import styles from "./SuperAdminRegister.module.css";
import { 
  Shield, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowLeft,
  CheckCircle,
  UserPlus,
  ChevronDown,
  Crown,
  UserCog
} from "lucide-react";

function SuperAdminRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin" // Default to admin
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role // Send selected role
      });

      setSuccess(true);
      
      // Redirect based on role after 2 seconds
      setTimeout(() => {
        if (form.role === "super_admin") {
          navigate("/super-admin/login");
        } else {
          navigate("/user/login");
        }
      }, 2000);

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get role display info
  const getRoleInfo = () => {
    if (form.role === "super_admin") {
      return {
        icon: <Crown size={18} />,
        label: "Super Administrator",
        description: "Full system access with organization management"
      };
    }
    return {
      icon: <UserCog size={18} />,
      label: "Administrator",
      description: "Manage projects and team members within organization"
    };
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} />
          </div>
          <h2>Registration Successful!</h2>
          <p>
            Your {form.role === "super_admin" ? "Super Admin" : "Admin"} account has been created successfully.
          </p>
          <p className={styles.redirectText}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.backgroundDecor}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Left side - Branding */}
        <div className={styles.brandingSide}>
          <div className={styles.brandingContent}>
            <div className={styles.logoContainer}>
              <Shield size={48} />
              <h1>BugTracker</h1>
            </div>
            <h2>Join as Administrator</h2>
            <p>
              Create your admin account to manage organizations, projects, 
              and oversee the entire bug tracking ecosystem.
            </p>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <CheckCircle size={20} />
                <span>Create & manage organizations</span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle size={20} />
                <span>Full project control</span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle size={20} />
                <span>Assign team members</span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle size={20} />
                <span>Access admin dashboard</span>
              </div>
            </div>

            {/* Role Comparison */}
            <div className={styles.roleComparison}>
              <h3>Role Comparison</h3>
              <div className={styles.roleCompareGrid}>
                <div className={styles.roleCompareItem}>
                  <UserCog size={24} />
                  <h4>Admin</h4>
                  <ul>
                    <li>Manage single organization</li>
                    <li>Create projects</li>
                    <li>Invite team members</li>
                  </ul>
                </div>
                <div className={styles.roleCompareItem}>
                  <Crown size={24} />
                  <h4>Super Admin</h4>
                  <ul>
                    <li>Manage all organizations</li>
                    <li>System-wide access</li>
                    <li>Platform oversight</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register form */}
        <div className={styles.formSide}>
          <div className={styles.registerCard}>
            <Link to="/" className={styles.backLink}>
              <ArrowLeft size={20} />
              Back to Home
            </Link>

            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <UserPlus size={32} />
              </div>
              <h2>Admin Registration</h2>
              <p>Create your administrator account</p>
            </div>

            {error && (
              <div className={styles.errorAlert}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <User size={20} />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    value={form.name}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <Mail size={20} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    value={form.email}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <Lock size={20} />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    onChange={handleChange}
                    value={form.password}
                    required
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <Lock size={20} />
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    onChange={handleChange}
                    value={form.confirmPassword}
                    required
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Role Selection Dropdown */}
              <div className={styles.inputGroup}>
                <label htmlFor="role">Select Admin Type</label>
                <div className={styles.selectWrapper}>
                  <span className={styles.inputIcon}>
                    <Shield size={20} />
                  </span>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  <span className={styles.selectArrow}>
                    <ChevronDown size={20} />
                  </span>
                </div>
              </div>

              {/* Selected Role Display */}
              <div className={`${styles.roleDisplay} ${form.role === "super_admin" ? styles.superAdminRole : styles.adminRole}`}>
                {getRoleInfo().icon}
                <div className={styles.roleInfo}>
                  <span className={styles.roleLabel}>{getRoleInfo().label}</span>
                  <span className={styles.roleDescription}>{getRoleInfo().description}</span>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create {form.role === "super_admin" ? "Super Admin" : "Admin"} Account
                  </>
                )}
              </button>
            </form>

            <div className={styles.footer}>
              <p className={styles.loginText}>
                Already have an account?{" "}
                <Link 
                  to={form.role === "super_admin" ? "/super-admin/login" : "/user/login"} 
                  className={styles.link}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminRegister;