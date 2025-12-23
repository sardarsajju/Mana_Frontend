import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Select Registration Type</h1>

            <div className={styles.cardWrapper}>
                <div
                    className={styles.card}
                    onClick={() => navigate("/signup")}
                >
                    <h2>User Registration</h2>
                    <p>
                        Register as a user to access services and manage your
                        requests.
                    </p>
                    <button className={styles.button}>
                        Register For User
                    </button>
                </div>

                <div
                    className={styles.card}
                    onClick={() => navigate("/bank")}
                >
                    <h2>Bank Registration</h2>
                    <p>
                        Register your bank to manage transactions and services.
                    </p>
                    <button className={styles.button}>
                        Register for Bank
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;

