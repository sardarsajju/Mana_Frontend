// Register.jsx with lucide-react icons
import React, { useState } from "react";
import API from "../api/axiosConfig";
import styles from "../Components/Register.module.css";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Users, ChevronDown, UserPlus } from "lucide-react";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tester",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.post("/auth/register", form);
      alert("User registered successfully!");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <UserPlus size={32} />
          </div>
          <h2>Create Account</h2>
          <p className={styles.subtitle}>Join us and start tracking bugs efficiently</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <User size={20} />
              </span>
              <input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
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
                value={form.email}
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
                <Lock size={20} />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="role">Select Role</label>
            <div className={styles.selectWrapper}>
              <span className={styles.inputIcon}>
                <Users size={20} />
              </span>
              <select 
                id="role"
                name="role" 
                value={form.role} 
                onChange={handleChange}
                className={styles.select}
              >
                <option value="tester">Tester</option>
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </select>
              <span className={styles.selectArrow}>
                <ChevronDown size={20} />
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link to="/" className={styles.loginLink}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;