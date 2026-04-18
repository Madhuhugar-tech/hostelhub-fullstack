import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import DashboardShell from "../../components/DashboardShell";

export default function WardenBilling() {
  const { user, logout } = useAuth();

  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navItems = [
    { label: "Dashboard", icon: "📊", path: "/warden" },
    { label: "Complaints", icon: "📋", path: "/warden/complaints" },
    { label: "Billing", icon: "💳", path: "/warden/billing" },
    { label: "Community", icon: "🔒", path: "/warden/community" },
  ];

  const fetchBills = async () => {
    try {
      const res = await api.get("/bills/unpaid");
      setUnpaidBills(res.data.bills || []);
    } catch (err) {
      console.error("Billing fetch error:", err);
      setError(err?.response?.data?.message || "Failed to load unpaid bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!month || !year || !amount || !dueDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/bills/generate", {
        month,
        year: Number(year),
        amount: Number(amount),
        dueDate,
      });

      setMonth("");
      setAmount("");
      setDueDate("");
      await fetchBills();
      alert("Bills generated successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to generate bills");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <DashboardShell
      userName={user?.name || "Warden"}
      role="Warden"
      navItems={navItems}
      onLogout={handleLogout}
    >
      <h1 style={styles.title}>Billing</h1>
      <p style={styles.subtitle}>Manage student mess bills.</p>

      <div style={styles.layout}>
        <div style={styles.formCard}>
          <div style={styles.sectionTitle}>GENERATE MONTHLY BILL</div>

          <form onSubmit={handleGenerate}>
            <input
              style={styles.input}
              placeholder="Month (e.g. May)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              style={styles.input}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? "Generating..." : "Generate Bills for All Students"}
            </button>
          </form>
        </div>

        <div style={styles.listCard}>
          <div style={styles.sectionTitle}>UNPAID BILLS</div>

          {loading ? (
            <div style={styles.emptyState}>Loading...</div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : unpaidBills.length === 0 ? (
            <div style={styles.emptyState}>No unpaid bills found.</div>
          ) : (
            unpaidBills.map((bill) => (
              <div key={bill.id} style={styles.billCard}>
                <div>
                  <div style={styles.billTitle}>
                    {bill.student?.name} · Room {bill.student?.roomNumber}
                  </div>
                  <div style={styles.billMeta}>
                    {bill.month} {bill.year} · Due{" "}
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <div style={styles.billRight}>
                  <div style={styles.billAmount}>₹{bill.amount}</div>
                  <div style={styles.unpaidBadge}>Unpaid</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
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
  layout: {
    marginTop: "28px",
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "20px",
    alignItems: "start",
  },
  formCard: {
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "28px",
    padding: "24px",
  },
  listCard: {
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "28px",
    padding: "24px",
  },
  sectionTitle: {
    marginBottom: "18px",
    color: "#7f8199",
    letterSpacing: "0.18em",
    fontWeight: 800,
    fontSize: "12px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "14px",
    borderRadius: "16px",
    border: "1px solid #2b3045",
    background: "#181b2a",
    color: "#fff",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "18px",
    background: "linear-gradient(90deg, #7c6cfa, #fa6c9f)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: "16px",
  },
  billCard: {
    background: "#181b2a",
    border: "1px solid #2b3045",
    borderRadius: "20px",
    padding: "18px",
    marginBottom: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  billTitle: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "6px",
  },
  billMeta: {
    color: "#8d8da8",
    fontSize: "14px",
  },
  billRight: {
    textAlign: "right",
  },
  billAmount: {
    fontSize: "32px",
    fontWeight: 900,
    color: "#8f80ff",
    marginBottom: "8px",
  },
  unpaidBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,92,149,0.12)",
    border: "1px solid rgba(255,92,149,0.24)",
    color: "#ff6fa9",
    fontWeight: 700,
    fontSize: "14px",
  },
  error: {
    color: "#ff7b7b",
  },
  emptyState: {
    color: "#8d8da8",
  },
};