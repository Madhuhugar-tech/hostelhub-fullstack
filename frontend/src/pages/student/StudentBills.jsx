import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import DashboardShell from "../../components/DashboardShell";

export default function StudentBills() {
  const { user, logout } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navItems = [
    { label: "Dashboard", icon: "🏠", path: "/student" },
    { label: "Issues", icon: "📋", path: "/student/issues" },
    { label: "Community", icon: "💬", path: "/student/community" },
    { label: "Bills", icon: "💳", path: "/student/bills" },
  ];

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await api.get("/bills/my");
        setBills(res.data.bills || []);
      } catch (err) {
        console.error("Bills fetch error:", err);
        setError(err?.response?.data?.message || "Failed to load bills");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const unpaidBill = bills.find((bill) => bill.status === "UNPAID");

  return (
    <DashboardShell
      userName={user?.name || "Student"}
      role="Student"
      navItems={navItems}
      onLogout={handleLogout}
    >
      <h1 style={styles.title}>Mess Bills</h1>
      <p style={styles.subtitle}>View and pay your monthly bills.</p>

      {loading ? (
        <div style={styles.card}>Loading bills...</div>
      ) : error ? (
        <div style={styles.card}>{error}</div>
      ) : (
        <>
          {unpaidBill ? (
            <div style={styles.heroCard}>
              <div>
                <div style={styles.heroTitle}>
                  {unpaidBill.month} {unpaidBill.year}
                </div>
                <div style={styles.heroSub}>
                  Due: {new Date(unpaidBill.dueDate).toLocaleDateString()}
                </div>
              </div>

              <div style={styles.heroRight}>
                <div style={styles.amount}>₹{unpaidBill.amount}</div>
                <div style={styles.unpaidBadge}>Unpaid</div>
                <button style={styles.payBtn}>Pay via UPI</button>
              </div>
            </div>
          ) : (
            <div style={styles.card}>No unpaid bills 🎉</div>
          )}

          <div style={styles.sectionTitle}>BILL HISTORY</div>

          <div style={styles.listGrid}>
            {bills.length === 0 ? (
              <div style={styles.card}>No bills found.</div>
            ) : (
              bills.map((bill) => (
                <div key={bill.id} style={styles.billCard}>
                  <div>
                    <div style={styles.billTitle}>
                      {bill.month} {bill.year}
                    </div>
                    <div style={styles.billDate}>
                      {bill.status === "PAID"
                        ? `Paid on ${
                            bill.paidAt
                              ? new Date(bill.paidAt).toLocaleDateString()
                              : "-"
                          }`
                        : `Due ${new Date(bill.dueDate).toLocaleDateString()}`}
                    </div>
                  </div>

                  <div style={styles.billRight}>
                    <div
                      style={{
                        ...styles.billAmount,
                        color: bill.status === "PAID" ? "#66ffd9" : "#8f80ff",
                      }}
                    >
                      ₹{bill.amount}
                    </div>

                    <div
                      style={{
                        ...styles.billBadge,
                        ...(bill.status === "PAID"
                          ? styles.paidBadge
                          : styles.unpaidMiniBadge),
                      }}
                    >
                      {bill.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </DashboardShell>
  );
}

const styles = {
  title: {
    margin: "0 0 8px",
    fontSize: "42px",
    fontWeight: 800,
  },
  subtitle: {
    margin: 0,
    color: "#8d8da8",
    fontSize: "18px",
  },
  heroCard: {
    marginTop: "28px",
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "28px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  heroTitle: {
    fontSize: "30px",
    fontWeight: 800,
    marginBottom: "8px",
  },
  heroSub: {
    color: "#8d8da8",
    fontSize: "16px",
  },
  heroRight: {
    textAlign: "right",
  },
  amount: {
    fontSize: "42px",
    fontWeight: 900,
    color: "#8f80ff",
    marginBottom: "10px",
  },
  unpaidBadge: {
    display: "inline-block",
    marginBottom: "12px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,92,149,0.12)",
    border: "1px solid rgba(255,92,149,0.24)",
    color: "#ff6fa9",
    fontWeight: 700,
    fontSize: "14px",
  },
  payBtn: {
    display: "block",
    marginLeft: "auto",
    padding: "12px 18px",
    border: "none",
    borderRadius: "16px",
    background: "linear-gradient(90deg, #7c6cfa, #fa6c9f)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  sectionTitle: {
    marginTop: "32px",
    marginBottom: "14px",
    color: "#7f8199",
    letterSpacing: "0.18em",
    fontWeight: 800,
    fontSize: "12px",
  },
  listGrid: {
    display: "grid",
    gap: "16px",
  },
  billCard: {
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "24px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  billTitle: {
    fontSize: "26px",
    fontWeight: 800,
    marginBottom: "6px",
  },
  billDate: {
    color: "#8d8da8",
    fontSize: "15px",
  },
  billRight: {
    textAlign: "right",
  },
  billAmount: {
    fontSize: "36px",
    fontWeight: 900,
    marginBottom: "10px",
  },
  billBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "14px",
  },
  paidBadge: {
    background: "rgba(102,255,217,0.1)",
    border: "1px solid rgba(102,255,217,0.24)",
    color: "#66ffd9",
  },
  unpaidMiniBadge: {
    background: "rgba(255,92,149,0.12)",
    border: "1px solid rgba(255,92,149,0.24)",
    color: "#ff6fa9",
  },
  card: {
    marginTop: "28px",
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "28px",
    padding: "24px",
  },
};