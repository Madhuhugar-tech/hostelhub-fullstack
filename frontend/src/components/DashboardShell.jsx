import { useLocation, useNavigate } from "react-router-dom";

export default function DashboardShell({
  brand = "HostelHub",
  userName = "",
  role = "",
  navItems = [],
  onLogout,
  children,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.brand}>{brand}</div>
          <div style={styles.userName}>{userName}</div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.roleBadge}>{role}</div>
          <div style={styles.avatar}>
            {(userName || role || "U").trim().charAt(0).toUpperCase()}
          </div>
          <button style={styles.logoutBtn} onClick={onLogout}>
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

        <main style={styles.main}>{children}</main>
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
    background: "rgba(124,108,250,0.12)",
    border: "1px solid rgba(124,108,250,0.24)",
    color: "#8f80ff",
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
};