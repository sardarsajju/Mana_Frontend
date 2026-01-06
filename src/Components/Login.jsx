// src/pages/UserAuth/Login.jsx
import React, { useContext, useState, useEffect } from "react";
import API from "../api/axiosConfig";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import styles from "../Components/Login.module.css";
import { AuthContext } from "../context/AuthContext";
import { Building2, AlertCircle } from "lucide-react";

function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const orgIdFromUrl = searchParams.get("org_id");
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [orgName, setOrgName] = useState("");

  // Fetch organization name if org_id exists
  useEffect(() => {
    if (orgIdFromUrl) {
      API.get(`/bugs/organization/${orgIdFromUrl}`)
        .then((res) => {
          setOrgName(res.data.org_name);
        })
        .catch((err) => {
          console.error("Error fetching org:", err);
        });
    }
  }, [orgIdFromUrl]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      // ✅ Check if user belongs to the organization (if org_id is provided)
      if (orgIdFromUrl && res.data.org_id !== parseInt(orgIdFromUrl)) {
        alert("You don't have access to this organization. Please contact your administrator.");
        setIsLoading(false);
        return;
      }

      // Store login data
      login(res.data);
      
      // ✅ Store org_id from response
      if (res.data.org_id) {
        localStorage.setItem("org_id", res.data.org_id);
      }

      // Navigate based on role
      if (res.data.role === "admin") {
        navigate("/admin/select-organization");
      } else if (res.data.role === "tester") {
        navigate("/tester/dashboard");
      } else if (res.data.role === "developer") {
        navigate("/bugs");
      }

    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
          
          {/* ✅ Show organization badge if logging in for specific org */}
          {orgName && (
            <div className={styles.orgBadge}>
              <Building2 size={16} />
              <span>Logging in to: <strong>{orgName}</strong></span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className={styles.input}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Signing in...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.registerText}>
            Don't have an account?{" "}
            <Link 
              to={orgIdFromUrl ? `/user/register?org_id=${orgIdFromUrl}` : "/user/register"} 
              className={styles.link}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;