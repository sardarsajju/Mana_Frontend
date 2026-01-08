import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, IndianRupee, Download } from "lucide-react";
import styles from "./BankTransactionPage.module.css";
import axios from "axios";
import { API_URL } from "../Custom/Api_url";
import { useSelector } from "react-redux";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [showpopup, setshowpopup] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    type: "",
    amount: "",
    category: "",
    date: "",
    recipient: "",
  });

  const user = useSelector((state) => state.login.user);
  const user_id = user?.user_id;

  useEffect(() => {
    if (user_id) {
      setFormData((prev) => ({ ...prev, user_id }));
    }
  }, [user_id]);

  const getBalance = async () => {
    try {
      const res = await axios.get(`${API_URL}/getuserdetails/${user_id}`);
      setBalance(parseFloat(res.data[0].TotalAmount));
    } catch (error) {
      console.log("Error fetching balance:", error);
    }
  };

  const getTransactions = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/transcations/gettranscations/${user_id}`
      );
      setTransactions(res.data.transactions);
      console.log(res.data.transactions);
    } catch (error) {
      console.log("Error fetching:", error);
    }
  };

  const postTransactions = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/transcations/addtranscations`,
        formData
      );

      console.log("Added Transaction:", res.data);

      setshowpopup(false);
      getTransactions();
      getBalance();
    } catch (error) {
      console.log("Error adding transaction:", error);
    }
  };

  useEffect(() => {
    if (user_id) {
      getBalance();
      getTransactions();
    }
  }, [user_id]);

  const filteredTransactions =
    (activeTab === "all"
      ? transactions
      : transactions.filter((t) => t.type === activeTab)
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
const handledownlaod = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/statement/downloadstatement/${user_id}`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("download", "transaction-statement.pdf");

    document.body.appendChild(link);
    link.click();

    
    link.remove();
    window.URL.revokeObjectURL(url);

    console.log("Downloaded successfully",response.data);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

  return (
    <div className={styles.pageWrapper}>
      
      <div className={styles.container}>
        <button className={styles.addButton} onClick={() => setshowpopup(true)}>
          + Add Transaction
        </button>

        {showpopup && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2 className={styles.popupTitle}>Add New Transaction</h2>

              <form className={styles.formBox} onSubmit={postTransactions}>
                <label>Transaction Type</label>
                <select
                  name="type"
                  className={styles.input}
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="">Select Type</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>

                <label>Amount</label>
                <input
                  className={styles.input}
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />

                {/* Category */}
                <label>Category</label>
                <input
                  className={styles.input}
                  type="text"
                  name="category"
                  placeholder="E.g. Food / Shopping"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />

                <label>Date</label>
                <input
                  className={styles.input}
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />

                <label>Recipient</label>
                <input
                  className={styles.input}
                  type="text"
                  name="recipient"
                  placeholder="E.g. Swiggy / Amazon"
                  value={formData.recipient}
                  onChange={(e) =>
                    setFormData({ ...formData, recipient: e.target.value })
                  }
                />

                <div className={styles.buttonRow}>
                  <button className={styles.submitBtn} type="submit">
                    Submit
                  </button>
                  <button
                    className={styles.closeBtn}
                    onClick={() => setshowpopup(false)}
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h1 className={styles.headerTitle}>Transactions</h1>
        <p className={styles.headerSubtitle}>
          Manage your account & view history
        </p>

        {/* <div className={styles.cardGrid}>
          <div className={`${styles.card} ${styles.blueCard}`}>
            <p>Total Balance</p>
            <h2>
              <IndianRupee />
              {balance}
            </h2>
          </div>
        </div> */}

        {/* Tabs */}
        <div className={styles.tabContainer}>
          <button
            className={activeTab === "all" ? styles.activeTab : ""}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>

          <button
            className={activeTab === "credit" ? styles.activeTab : ""}
            onClick={() => setActiveTab("credit")}
          >
            Credit
          </button>

          <button
            className={activeTab === "debit" ? styles.activeTab : ""}
            onClick={() => setActiveTab("debit")}
          >
            Debit
          </button>
          <button className={styles.downloadBtn} title="Download Statement" onClick={handledownlaod}>
              <Download/>
            </button>
        </div>
        {filteredTransactions.length === 0 && (
          <p className={styles.noDataMessage}>
            No transactions available
          </p>
        )}

        {filteredTransactions.map((t) => (
          <div key={t.id} className={styles.transactionItem}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                className={
                  t.type === "credit"
                    ? styles.iconCircleGreen
                    : styles.iconCircleRed
                }
              >
                {t.type === "credit" ? <ArrowUpRight /> : <ArrowDownLeft />}
              </div>

              <div>
                <p className={styles.transactionName}>{t.recipient}</p>
                <p className={styles.transactionMeta}>
                  {t.category} • {t.date}
                </p>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <p
                className={
                  t.type === "credit"
                    ? styles.amountGreen
                    : styles.amountRed
                }
              >
                {t.type === "credit" ? "+" : "-"}
                <IndianRupee /> {t.amount}
              </p>
              <span className={styles.statusTag}>{t.status}</span>
            </div>
            

          </div>
        ))}

      </div>
    </div>
  );
}
