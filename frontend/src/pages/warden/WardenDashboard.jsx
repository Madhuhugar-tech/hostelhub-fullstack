import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function WardenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/warden");
        setDashboard(res.data.dashboard);
      } catch (err) {
        console.error("Warden dashboard fetch error:", err);
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

  if (loading) {
    return <div style={styles.page}>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={styles.page}>{error}</div>;
  }

  const stats = dashboard?.stats || {};
  const breakdown = dashboard?.breakdown || {};

  const navItems = [
    { label: "Dashboard", icon: "📊", path: "/warden" },
    { label: "Complaints", icon: "📋", path: "/warden/complaints" },
    { label: "Billing", icon: "💳", path: "/warden/billing" },
    { label: "Community", icon: "🔒", path: "/warden/community" },
  ];

  const bars = [
    { label: "⚡ Electricity", value: breakdown.Electricity || 0 },
    { label: "💧 Water", value: breakdown.Water || 0 },
    { label: "🍽️ Food", value: breakdown.Food || 0 },
    { label: "🧹 Sanitation", value: breakdown.Sanitation || 0 },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.brand}>HostelHub</div>
          <div style={styles.userName}>{user?.name || "Dr. Meena"}</div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.roleBadge}>Warden</div>
          <div style={styles.avatar}>
            {(user?.name || "W").trim().charAt(0).toUpperCase()}
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.desktopShell}>
        <aside style={styles.sidebar}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.sideNavItem,
                  ...(active ? styles.sideNavItemActive : {}),
                }}
              >
                <span style={styles.sideNavIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <main style={styles.main}>
          <h1 style={styles.title}>Warden Dashboard 👩‍💼</h1>
          <p style={styles.subtitle}>
            {user?.hostelBlock || "Girls Hostel Block A"}
          </p>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: "#ffd65c" }}>
                {stats.pendingIssues ?? 0}
              </div>
              <div style={styles.statLabel}>Pending Issues</div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: "#7b6cff" }}>
                {stats.inProgress ?? 0}
              </div>
              <div style={styles.statLabel}>In Progress</div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: "#66ffd9" }}>
                {stats.resolvedThisMonth ?? 0}
              </div>
              <div style={styles.statLabel}>Resolved This Month</div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: "#ff6fa9" }}>
                {stats.unpaidBills ?? 0}
              </div>
              <div style={styles.statLabel}>Unpaid Bills</div>
            </div>
          </div>

          <div style={styles.analyticsGrid}>
            <section style={styles.analyticsCard}>
              <div style={styles.sectionTitle}>COMPLAINT BREAKDOWN</div>

              {bars.map((item) => (
                <div key={item.label} style={styles.barBlock}>
                  <div style={styles.barRow}>
                    <div style={styles.barLabel}>{item.label}</div>
                    <div style={styles.barValue}>{item.value}%</div>
                  </div>
                  <div style={styles.track}>
                    <div
                      style={{
                        ...styles.fill,
                        width: `${Math.max(item.value, 6)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </section>

            <section style={styles.quickCard}>
              <div style={styles.sectionTitle}>QUICK ACTIONS</div>

              <div style={styles.quickActions}>
                <button
                  style={styles.quickButton}
                  onClick={() => navigate("/warden/complaints")}
                >
                  <div style={styles.quickIcon}>📋</div>
                  <div>Manage Complaints</div>
                </button>

                <button
                  style={styles.quickButton}
                  onClick={() => navigate("/warden/billing")}
                >
                  <div style={styles.quickIcon}>💳</div>
                  <div>Manage Billing</div>
                </button>

                <button
                  style={styles.quickButton}
                  onClick={() => navigate("/warden/community")}
                >
                  <div style={styles.quickIcon}>🔒</div>
                  <div>Community Access</div>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(86,55,255,0.12), transparent 20%), #06070d",
    color: "#ffffff",
  },
  header: {
    height: "78px",
    borderBottom: "1px solid #171b2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    background: "rgba(6,7,13,0.92)",
    backdropFilter: "blur(8px)",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  brand: {
    color: "#735cff",
    fontWeight: 800,
    fontSize: "24px",
  },
  userName: {
    color: "#8d8da8",
    fontSize: "16px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  roleBadge: {
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,92,149,0.12)",
    border: "1px solid rgba(255,92,149,0.22)",
    color: "#ff6fa9",
    fontWeight: 700,
    fontSize: "14px",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "20px",
    color: "#fff",
    background: "linear-gradient(135deg, #8f6bff, #ff7ab8)",
  },
  logoutBtn: {
    background: "transparent",
    color: "#d8d8e8",
    border: "1px solid #2a2d3f",
    borderRadius: "14px",
    padding: "11px 16px",
    fontSize: "14px",
    cursor: "pointer",
  },
  desktopShell: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    minHeight: "calc(100vh - 78px)",
  },
  sidebar: {
    borderRight: "1px solid #171b2a",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sideNavItem: {
    background: "transparent",
    border: "1px solid #202436",
    color: "#a9abbe",
    borderRadius: "16px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    fontSize: "15px",
    textAlign: "left",
  },
  sideNavItemActive: {
    background: "#121524",
    color: "#7c6cfa",
    border: "1px solid #302d58",
  },
  sideNavIcon: {
    fontSize: "20px",
    lineHeight: 1,
  },
  main: {
    padding: "30px",
  },
  title: {
    margin: "0 0 8px",
    fontSize: "42px",
    fontWeight: 800,
    lineHeight: 1.1,
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
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: "48px",
    fontWeight: 900,
    lineHeight: 1,
    marginBottom: "16px",
  },
  statLabel: {
    color: "#8d8da8",
    fontSize: "18px",
    lineHeight: 1.4,
  },
  analyticsGrid: {
    marginTop: "28px",
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "20px",
  },
  analyticsCard: {
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "28px",
    padding: "24px",
  },
  quickCard: {
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
  barBlock: {
    marginBottom: "22px",
  },
  barRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  barLabel: {
    color: "#f4f4fb",
    fontSize: "17px",
    fontWeight: 600,
  },
  barValue: {
    color: "#7f72ff",
    fontSize: "17px",
    fontWeight: 700,
  },
  track: {
    height: "10px",
    width: "100%",
    background: "#1e2030",
    borderRadius: "999px",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #7a63ff, #ff71b5)",
  },
  quickActions: {
    display: "grid",
    gap: "14px",
  },
  quickButton: {
    background: "#181b2a",
    border: "1px solid #2b3045",
    borderRadius: "20px",
    padding: "18px",
    color: "#f2f2fb",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    fontSize: "16px",
    fontWeight: 600,
  },
  quickIcon: {
    fontSize: "24px",
    lineHeight: 1,
  },
};