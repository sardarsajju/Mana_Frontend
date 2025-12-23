import axios from "axios";
import { useState, useRef } from "react";
import { API_URL } from "../Custom/Api_url";
import { useNavigate } from "react-router-dom";
import styles from "./Banklogin.module.css";

function Banklogin() {
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const navigate = useNavigate();

    const inputsRef = useRef([]);
    const STATIC_OTP = "8897";

    const sendOtp = async () => {
        if (mobileNumber.length !== 10) {
            alert("Mobile number must be exactly 10 digits");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/bank/loginbank`, {
                mobileNumber,
            });

            if (res.data.success) {
                setIsOtpSent(true);
                alert("OTP sent to your mobile");
            }
        } catch {
            alert("Invalid mobile number");
        }
    };


    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = otp.split("");
        newOtp[index] = value;
        const updatedOtp = newOtp.join("");
        setOtp(updatedOtp);

        if (value && index < 3) {
            inputsRef.current[index + 1].focus();
        }
    };

    const verifyOtp = () => {
        if (otp === STATIC_OTP) {
            alert("Login successful");
            navigate("/bankhome");
        } else {
            alert("Invalid OTP");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>🏦 Bank Login</h2>

                <input
                    type="text"
                    placeholder="Enter Mobile Number"
                    value={mobileNumber}
                    maxLength={10}          
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setMobileNumber(value);
                    }}
                    className={styles.input}
                />

                <button onClick={sendOtp} className={styles.button}>
                    Send OTP
                </button>
            </div>

            {isOtpSent && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Enter OTP</h3>

                        <div className={styles.otpBoxContainer}>
                            {[0, 1, 2, 3].map((i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputsRef.current[i] = el)}
                                    type="text"
                                    maxLength="1"
                                    className={styles.otpBox}
                                    onChange={(e) => handleOtpChange(e.target.value, i)}
                                />
                            ))}
                        </div>

                        <button onClick={verifyOtp} className={styles.button}>
                            Verify OTP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Banklogin;
