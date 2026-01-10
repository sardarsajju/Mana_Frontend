import { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../Custom/Api_url";
import { Facebook, Twitter } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";

function Singuppage() {
  const [FirstName, SetFirstName] = useState("");
  const [LastName, SetLastName] = useState("");
  const [MobileNumber, SetMobileNumber] = useState("");
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [selectedBank, setSelectedBank] = useState(""); // holds Bank_id
  const [bank, setbank] = useState([]);
  const [error, setError] = useState("");

  const navigation = useNavigate();

  // 🔹 Fetch bank details
  useEffect(() => {
    axios
      .get(`${API_URL}/bank/getbankdetails`)
      .then((res) => {
        setbank(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !FirstName ||
      !LastName ||
      !MobileNumber ||
      !Email ||
      !Password ||
      !selectedBank
    ) {
      setError("All fields are required!");
      return;
    }

    setError("");

    const payload = {
      FirstName,
      LastName,
      MobileNumber,
      Email,
      Password,
      Bank_id: Number(selectedBank),
    };
    console.log(payload.Bank_id);
    try {
      const res = await axios.post(
        "http://localhost:5004/api/register",
        payload
      );

      alert("User Registered Successfully!");
      console.log(res.data);
      navigation("/userlogin");

      // clear form
      SetFirstName("");
      SetLastName("");
      SetMobileNumber("");
      SetEmail("");
      SetPassword("");
      setSelectedBank("");
    } catch (err) {
      console.log(err);
      alert("Registration Failed!");
    }
  };

  return (
    <>
      <button
        className={styles.backBtn}
        onClick={() => navigation("/")}
      >
        ← Back to Landing Page
      </button>

      <div className={styles.container}>

        <h1 className={styles.heading}>SignUp Page</h1>


        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={FirstName}
            onChange={(e) => SetFirstName(e.target.value)}
            className={styles.input}
          />

          <input
            type="text"
            placeholder="Last Name"
            value={LastName}
            onChange={(e) => SetLastName(e.target.value)}
            className={styles.input}
          />

          <input
            type="text"
            placeholder="Mobile Number"
            value={MobileNumber}
            onChange={(e) => SetMobileNumber(e.target.value)}
            className={styles.input}
          />

          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => SetEmail(e.target.value)}
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => SetPassword(e.target.value)}
            className={styles.input}
          />

          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className={styles.input}
          >
            <option value="">Select your Bank</option>
            {bank.map((b) => (
              <option key={b.Bank_id} value={b.Bank_id}>
                {b.Bank_Name}
              </option>
            ))}
          </select>

          <button type="submit" className={styles.btn}>
            Sign Up
          </button>

          <p>
            Already have an account?{" "}
            <Link to="/userlogin" className={styles.link}>
              Login
            </Link>
          </p>
          <div className={styles.socialIcons}>
            <button className={styles.google}>
              <FaGoogle />
            </button>

            <button className={styles.Twitter}>
              <Twitter />
            </button>
             <button className={styles.Facebook}>
              <Facebook />
            </button>
          </div>
          
        </form>
      </div>
    </>
  );
}

export default Singuppage;
