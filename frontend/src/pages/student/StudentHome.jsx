import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import DashboardShell from "../../components/DashboardShell";

export default function StudentHome() {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navItems = [
    { label: "Dashboard", icon: "🏠", path: "/student" },
    { label: "Issues", icon: "📋", path: "/student/issues" },
    { label: "Community", icon: "💬", path: "/student/community" },
    { label: "Bills", icon: "💳", path: "/student/bills" },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/student");
        setDashboard(res.data.dashboard);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (loading) return <div style={styles.page}>Loading...</div>;
  if (error) return <div style={styles.page}>{error}</div>;

  const stats = dashboard?.stats || {};
  const recent = dashboard?.recentComplaints || [];

  return (
    <DashboardShell
      userName={user?.name || dashboard.student.name}
      role="Student"
      navItems={navItems}
      onLogout={handleLogout}
    >
      <h1 style={styles.title}>Hey {dashboard.student.name} 👋</h1>
      <p style={styles.subtitle}>
        Room {dashboard.student.roomNumber} · {dashboard.student.hostelBlock}
      </p>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: "#7b6cff" }}>
            {stats.totalComplaints ?? 0}
          </div>
          <div style={styles.statLabel}>Open Complaints</div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: "#ff6fa9" }}>
            {stats.unpaidBills ?? 0}
          </div>
          <div style={styles.statLabel}>Bill Due</div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: "#66ffd9" }}>
            {Math.max((stats.totalComplaints || 0) - (stats.pendingComplaints || 0), 0)}
          </div>
          <div style={styles.statLabel}>Resolved</div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: "#ffd65c" }}>
            {recent.length}
          </div>
          <div style={styles.statLabel}>Recent Issues</div>
        </div>
      </div>

      <div style={styles.sectionTitle}>RECENT COMPLAINTS</div>

      <div style={styles.listGrid}>
        {recent.length === 0 ? (
          <div style={styles.emptyState}>No complaints found.</div>
        ) : (
          recent.map((item) => (
            <div key={item.id} style={styles.complaintCard}>
              <div style={styles.complaintTop}>
                <span style={styles.category}>{item.category}</span>
                <span style={styles.status}>{item.status}</span>
              </div>
              <div style={styles.complaintTitle}>{item.title}</div>
              <div style={styles.complaintDate}>
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#06070d",
    color: "white",
    padding: "30px",
  },
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
  statsGrid: {
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
  },
  statCard: {
    minHeight: "170px",
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "28px",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: "48px",
    fontWeight: 900,
    marginBottom: "16px",
  },
  statLabel: {
    color: "#8d8da8",
    fontSize: "18px",
  },
  sectionTitle: {
    marginTop: "34px",
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
  complaintCard: {
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "24px",
    padding: "20px",
  },
  complaintTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
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
    background: "#23263a",
    color: "#8f80ff",
    fontWeight: 700,
  },
  complaintTitle: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  complaintDate: {
    color: "#8d8da8",
    fontSize: "14px",
  },
  emptyState: {
    color: "#8d8da8",
    fontSize: "15px",
  },
};