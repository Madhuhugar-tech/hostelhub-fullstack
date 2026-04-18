import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import DashboardShell from "../../components/DashboardShell";

export default function StudentIssues() {
  const { user, logout } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Electricity",
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [fetching, setFetching] = useState(true);

  const navItems = [
    { label: "Dashboard", icon: "🏠", path: "/student" },
    { label: "Issues", icon: "📋", path: "/student/issues" },
    { label: "Community", icon: "💬", path: "/student/community" },
    { label: "Bills", icon: "💳", path: "/student/bills" },
  ];

  const fetchComplaints = async () => {
    try {
      setPageError("");
      const res = await api.get("/complaints/my");
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error("Fetch complaints error:", err);
      setPageError(err?.response?.data?.message || "Failed to load complaints");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.category) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/complaints", form);

      setForm({
        title: "",
        description: "",
        category: "Electricity",
      });

      await fetchComplaints();
    } catch (err) {
      console.error("Submit complaint error:", err);
      alert(err?.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <DashboardShell
      userName={user?.name || "Student"}
      role="Student"
      navItems={navItems}
      onLogout={handleLogout}
    >
      <h1 style={styles.title}>Raise Complaint</h1>
      <p style={styles.subtitle}>Submit and track your hostel issues.</p>

      <div style={styles.layout}>
        <div style={styles.formCard}>
          <div style={styles.sectionTitle}>NEW COMPLAINT</div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              style={styles.input}
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              style={styles.textarea}
              placeholder="Describe your issue"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              style={styles.input}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Food">Food</option>
              <option value="Sanitation">Sanitation</option>
            </select>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>

        <div style={styles.listCard}>
          <div style={styles.sectionTitle}>MY COMPLAINTS</div>

          {fetching ? (
            <div style={styles.emptyState}>Loading complaints...</div>
          ) : pageError ? (
            <div style={styles.error}>{pageError}</div>
          ) : complaints.length === 0 ? (
            <div style={styles.emptyState}>No complaints yet.</div>
          ) : (
            complaints.map((c) => (
              <div key={c.id} style={styles.complaintCard}>
                <div style={styles.topRow}>
                  <span style={styles.category}>{c.category}</span>
                  <span
                    style={{
                      ...styles.status,
                      ...(c.status === "RESOLVED"
                        ? styles.resolvedStatus
                        : c.status === "IN_PROGRESS"
                        ? styles.progressStatus
                        : c.status === "ESCALATED"
                        ? styles.escalatedStatus
                        : styles.pendingStatus),
                    }}
                  >
                    {c.status}
                  </span>
                </div>

                <div style={styles.cardTitle}>{c.title}</div>
                <div style={styles.desc}>{c.description}</div>
                <div style={styles.date}>
                  Raised {new Date(c.createdAt).toLocaleString()}
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
  textarea: {
    width: "100%",
    minHeight: "140px",
    padding: "16px",
    marginBottom: "14px",
    borderRadius: "20px",
    border: "1px solid #2b3045",
    background: "#181b2a",
    color: "#fff",
    boxSizing: "border-box",
    resize: "vertical",
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
  complaintCard: {
    background: "#181b2a",
    border: "1px solid #2b3045",
    borderRadius: "20px",
    padding: "18px",
    marginBottom: "14px",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
  },
  category: {
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#23263a",
    color: "#f0c96a",
    fontWeight: 700,
  },
  status: {
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: 700,
  },
  pendingStatus: {
    background: "rgba(255,214,92,0.12)",
    border: "1px solid rgba(255,214,92,0.24)",
    color: "#ffd65c",
  },
  progressStatus: {
    background: "rgba(123,108,255,0.12)",
    border: "1px solid rgba(123,108,255,0.24)",
    color: "#8f80ff",
  },
  resolvedStatus: {
    background: "rgba(102,255,217,0.1)",
    border: "1px solid rgba(102,255,217,0.24)",
    color: "#66ffd9",
  },
  escalatedStatus: {
    background: "rgba(255,111,169,0.12)",
    border: "1px solid rgba(255,111,169,0.24)",
    color: "#ff6fa9",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  desc: {
    color: "#c7c7d1",
    marginBottom: "10px",
    lineHeight: 1.5,
  },
  date: {
    color: "#8d8da8",
    fontSize: "14px",
  },
  error: {
    color: "#ff7b7b",
  },
  emptyState: {
    color: "#8d8da8",
  },
};