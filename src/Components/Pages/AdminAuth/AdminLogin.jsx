// // src/pages/AdminAuth/AdminLogin.jsx
// import React, { useContext, useState } from "react";
// import API from "../../../api/axiosConfig";
// import { useNavigate, Link } from "react-router-dom";
// import styles from "./AdminLogin.module.css";
// import { AuthContext } from "../../../context/AuthContext";
// import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

// function AdminLogin() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const res = await API.post("/auth/login", form);

//       // Only allow admin users
//       if (res.data.role !== "admin") {
//         setError("Access denied. This portal is for administrators only. Please use the Team Portal.");
//         setIsLoading(false);
//         return;
//       }

//       login(res.data);
//       navigate("/admin/select-organization");

//     } catch (error) {
//       console.error(error);
//       setError(error.response?.data?.message || "Login failed. Please check your credentials.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {/* Background decoration */}
//       <div className={styles.backgroundDecor}>
//         <div className={styles.circle1}></div>
//         <div className={styles.circle2}></div>
//       </div>

//       <div className={styles.formWrapper}>
//         <Link to="/" className={styles.backLink}>
//           <ArrowLeft size={20} />
//           Back to Home
//         </Link>

//         <div className={styles.loginCard}>
//           <div className={styles.header}>
//             <div className={styles.iconWrapper}>
//               <Shield size={32} />
//             </div>
//             <h2>Admin Login</h2>
//             <p>Sign in to your administrator account</p>
//             <div className={styles.adminBadge}>
//               <Shield size={14} />
//               <span>Administrator Access Only</span>
//             </div>
//           </div>

//           {error && (
//             <div className={styles.errorAlert}>
//               <AlertCircle size={18} />
//               <span>{error}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className={styles.form}>
//             <div className={styles.inputGroup}>
//               <label htmlFor="email">Email Address</label>
//               <div className={styles.inputWrapper}>
//                 <span className={styles.inputIcon}>
//                   <Mail size={20} />
//                 </span>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="Enter admin email"
//                   onChange={handleChange}
//                   value={form.email}
//                   required
//                   className={styles.input}
//                 />
//               </div>
//             </div>

//             <div className={styles.inputGroup}>
//               <label htmlFor="password">Password</label>
//               <div className={styles.inputWrapper}>
//                 <span className={styles.inputIcon}>
//                   <Lock size={20} />
//                 </span>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   onChange={handleChange}
//                   value={form.password}
//                   required
//                   className={styles.input}
//                 />
//                 <button
//                   type="button"
//                   className={styles.togglePassword}
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <button type="submit" disabled={isLoading} className={styles.submitBtn}>
//               {isLoading ? (
//                 <>
//                   <span className={styles.spinner}></span>
//                   Authenticating...
//                 </>
//               ) : (
//                 <>
//                   <Shield size={20} />
//                   Sign In as Admin
//                 </>
//               )}
//             </button>
//           </form>

//           <div className={styles.footer}>
//             <p className={styles.registerText}>
//               Don't have an admin account?{" "}
//               <Link to="/admin/register" className={styles.link}>
//                 Register here
//               </Link>
//             </p>
//             <div className={styles.divider}>
//               <span>or</span>
//             </div>
//             <p className={styles.switchText}>
//               Are you a Tester or Developer?{" "}
//               <Link to="/user/login" className={styles.switchLink}>
//                 Go to Team Portal
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminLogin;


// src/pages/AdminAuth/AdminLogin.jsx
import React, { useContext, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AdminLogin.module.css";
import { AuthContext } from "../../../context/AuthContext";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);

      // Only allow admin users
      if (res.data.role !== "admin") {
        setError("Access denied. This portal is for administrators only. Please use the Team Portal.");
        setIsLoading(false);
        return;
      }

      // Store admin data
      login(res.data);
      
      // ✅ IMPORTANT: Store email explicitly for verification
      localStorage.setItem("user_email", form.email); // Use the email from form
      
      // Also store from response if available
      if (res.data.email) {
        localStorage.setItem("user_email", res.data.email);
      }

      navigate("/admin/select-organization");

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.backgroundDecor}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>

      <div className={styles.formWrapper}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className={styles.loginCard}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <Shield size={32} />
            </div>
            <h2>Admin Login</h2>
            <p>Sign in to your administrator account</p>
            <div className={styles.adminBadge}>
              <Shield size={14} />
              <span>Administrator Access Only</span>
            </div>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
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
                  placeholder="Enter admin email"
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
                  placeholder="Enter your password"
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

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.registerText}>
              Don't have an admin account?{" "}
              <Link to="/admin/register" className={styles.link}>
                Register here
              </Link>
            </p>
            <div className={styles.divider}>
              <span>or</span>
            </div>
            <p className={styles.switchText}>
              Are you a Tester or Developer?{" "}
              <Link to="/user/login" className={styles.switchLink}>
                Go to Team Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;