import { useAuth } from "../../context/AuthContext";

export default function WardenCommunityBlocked() {
  const { logout } = useAuth();

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <h1 style={styles.heading}>Community</h1>
          <p style={styles.subtext}>Access restricted for wardens</p>
        </div>

        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          style={styles.logout}
        >
          Logout
        </button>
      </div>

      <div style={styles.card}>
        <h2>🔒 Access Restricted</h2>
        <p>
          The student community space is private and exclusively for students.
          Warden accounts do not have access to this area.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#09090f",
    color: "white",
    padding: "24px",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  heading: {
    margin: 0,
    fontSize: "2rem",
  },
  subtext: {
    color: "#9a9ab0",
    marginTop: "8px",
  },
  logout: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #333",
    background: "#171722",
    color: "white",
    cursor: "pointer",
  },
  card: {
    background: "#12121a",
    border: "1px solid #2a2a3a",
    borderRadius: "18px",
    padding: "24px",
    maxWidth: "700px",
    color: "#ff8bb0",
  },
};