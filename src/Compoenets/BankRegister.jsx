import { useState } from "react";
import styles from "./BankRegister.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Custom/Api_url";

function BankRegister() {
    const [obj, setObj] = useState({
        Bank_Name: "",
        Branch_Name: "",
        IFSC_Code: "",
        MobileNumber: ""
    });

    const [message, setMessage] = useState("");
const nav=useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setObj(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!obj.Bank_Name || !obj.Branch_Name || !obj.IFSC_Code || !obj.MobileNumber) {
            setMessage("All fields are required");
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/bank/bankregister`,
                obj
            );
            alert(res.data.message)
            setMessage(res.data.message || "Bank registered successfully");
nav('/banklogin')
            setObj({
                Bank_Name: "",
                Branch_Name: "",
                IFSC_Code: "",
                MobileNumber: ""
            });

        } catch (err) {
            console.error(err);
            setMessage("Error while registering bank");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Bank Register</h1>

                <div className={styles.inputGroup}>
                    <label>Bank Name</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="Bank_Name"
                        value={obj.Bank_Name}
                        placeholder="Enter Bank Name"
                        onChange={handleChange}
                    />

                    <label>Branch Name</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="Branch_Name"
                        value={obj.Branch_Name}
                        placeholder="Enter Branch Name"
                        onChange={handleChange}
                    />

                    <label>IFSC Code</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="IFSC_Code"
                        value={obj.IFSC_Code}
                        placeholder="Enter IFSC Code"
                        onChange={handleChange}
                    />

                    <label>Mobile Number</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="MobileNumber"
                        value={obj.MobileNumber}
                        placeholder="Enter Mobile Number"
                        onChange={handleChange}
                    />
                </div>

                <button className={styles.button} onClick={handleSubmit}>
                    Bank Register
                </button>

                {message && <p className={styles.successText}>{message}</p>}

                <p className={styles.loginText}>
                    Already have an account?
                    <Link to="/banklogin" className={styles.loginLink}>
                        Bank Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default BankRegister;
