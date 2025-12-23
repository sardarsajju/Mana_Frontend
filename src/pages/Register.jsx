import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    email: "",
    specialization: "",
    experience: "",
    age: "",
    gender: "",
    address: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleRegister = async () => {
  if (!role) {
    alert("Please select Doctor or Patient");
    return;
  }

  // ✅ SANITIZE DATA
  const payload = {
    ...formData,
    role,
    specialization:
      role === "doctor"
        ? formData.specialization.toLowerCase()
        : null,
    experience:
      role === "doctor" && formData.experience
        ? Number(formData.experience)
        : null,
    age:
      role === "patient" && formData.age
        ? Number(formData.age)
        : null,
    gender: role === "patient" ? formData.gender || null : null,
    address: role === "patient" ? formData.address || null : null
  };

  try {
    const res = await axios.post(
      "http://localhost:5005/api/auth/register",
      payload
    );

    alert(res.data.message);
    navigate("/");
  } catch (err) {
    alert(err.response?.data?.error || "Registration failed");
    console.log(err);
  }
};


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>

      <label>Select Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">-- Select --</option>
        <option value="doctor">Doctor</option>
        <option value="patient">Patient</option>
      </select>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="mobile"
        placeholder="Mobile Number"
        value={formData.mobile}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      {role === "doctor" && (
        <>
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience (Years)"
            value={formData.experience}
            onChange={handleChange}
          />
        </>
      )}

      {role === "patient" && (
        <>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />

          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={formData.gender}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </>
      )}

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
