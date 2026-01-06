import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../Custom/Api_url";
import { useLocation } from "react-router-dom";
import styles from "./BankTransactions.module.css";

function BankingTranscations() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const user_id = location.state?.user_id;

    useEffect(() => {
        if (!user_id) return;

        axios
            .get(`${API_URL}/transcations/gettranscations/${user_id}`)
            .then((res) => {
                setTransactions(res.data.transactions || []);
                console.log(res.data.transactions);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [user_id]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>💳 Banking Transactions</h1>

            {loading ? (
                <p className={styles.loading}>Loading transactions...</p>
            ) : transactions.length === 0 ? (
                <p className={styles.empty}>No transactions found</p>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Transaction ID</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{tx.transaction_id}</td>
                                    <td className={tx.amount}>
                                        ₹{tx.amount}
                                    </td>
                                    <td>
                                        <span
                                            className={
                                                tx.type === "credit"
                                                    ? styles.credit
                                                    : styles.debit
                                            }
                                        >
                                            {tx.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{tx.status}</td>
                                    <td>
                                        {new Date(
                                            tx.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BankingTranscations;
