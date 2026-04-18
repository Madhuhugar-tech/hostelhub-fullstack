import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import DashboardShell from "../../components/DashboardShell";

export default function WardenComplaints() {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navItems = [
    { label: "Dashboard", icon: "📊", path: "/warden" },
    { label: "Complaints", icon: "📋", path: "/warden/complaints" },
    { label: "Billing", icon: "💳", path: "/warden/billing" },
    { label: "Community", icon: "🔒", path: "/warden/community" },
  ];

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/all");
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error("Fetch complaints error:", err);
      setError(err?.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      await fetchComplaints();
    } catch (err) {
      console.error("Update status error:", err);
      alert(err?.response?.data?.message || "Failed to update status");
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
      <h1 style={styles.title}>Complaints</h1>
      <p style={styles.subtitle}>Track, assign and resolve student issues.</p>

      <div style={styles.pageCard}>
        <div style={styles.sectionTitle}>ALL COMPLAINTS</div>

        {loading ? (
          <div style={styles.emptyState}>Loading...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : complaints.length === 0 ? (
          <div style={styles.emptyState}>No complaints found.</div>
        ) : (
          complaints.map((item) => (
            <div key={item.id} style={styles.complaintCard}>
              <div style={styles.topRow}>
                <span style={styles.category}>{item.category}</span>
                <span
                  style={{
                    ...styles.status,
                    ...(item.status === "RESOLVED"
                      ? styles.resolvedStatus
                      : item.status === "IN_PROGRESS"
                      ? styles.progressStatus
                      : item.status === "ESCALATED"
                      ? styles.escalatedStatus
                      : styles.pendingStatus),
                  }}
                >
                  {item.status}
                </span>
              </div>

              <div style={styles.cardTitle}>{item.title}</div>
              <div style={styles.meta}>
                {item.student?.name} · Room {item.student?.roomNumber} ·{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.secondary}
                  onClick={() => updateStatus(item.id, "PENDING")}
                >
                  Mark Pending
                </button>

                <button
                  style={styles.secondary}
                  onClick={() => updateStatus(item.id, "IN_PROGRESS")}
                >
                  Start Work
                </button>

                <button
                  style={styles.primary}
                  onClick={() => updateStatus(item.id, "RESOLVED")}
                >
                  ✓ Mark Resolved
                </button>

                <button
                  style={styles.escalate}
                  onClick={() => updateStatus(item.id, "ESCALATED")}
                >
                  ⚠ Escalate
                </button>
              </div>
            </div>
          ))
        )}
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
  pageCard: {
    marginTop: "28px",
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
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  meta: {
    color: "#8d8da8",
    fontSize: "15px",
    marginBottom: "14px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primary: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #3ddc97, #54c2f0)",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondary: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "#171722",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  escalate: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #5a2740",
    background: "#2a1020",
    color: "#ff8bb0",
    cursor: "pointer",
    fontWeight: 700,
  },
  error: {
    color: "#ff7b7b",
  },
  emptyState: {
    color: "#8d8da8",
  },
};