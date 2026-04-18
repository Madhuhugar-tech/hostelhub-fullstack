import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import DashboardShell from "../../components/DashboardShell";

export default function StudentCommunity() {
  const { user, logout } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [newPost, setNewPost] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navItems = [
    { label: "Dashboard", icon: "🏠", path: "/student" },
    { label: "Issues", icon: "📋", path: "/student/issues" },
    { label: "Community", icon: "💬", path: "/student/community" },
    { label: "Bills", icon: "💳", path: "/student/bills" },
  ];

  const fetchRooms = async () => {
    try {
      const res = await api.get("/community/rooms");
      const fetchedRooms = res.data.rooms || [];

      setRooms(fetchedRooms);

      if (fetchedRooms.length > 0) {
        setSelectedRoomId((prev) => prev || fetchedRooms[0].id);
      }
    } catch (err) {
      console.error("Rooms fetch error:", err);
      setError(err?.response?.data?.message || "Failed to load rooms");
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get("/community/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Posts fetch error:", err);
      setError(err?.response?.data?.message || "Failed to load posts");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchRooms();
      await fetchPosts();
      setLoading(false);
    };

    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handlePost = async () => {
    if (!newPost.trim()) {
      alert("Write something first");
      return;
    }

    if (!selectedRoomId) {
      alert("Please select a room");
      return;
    }

    try {
      await api.post("/community/posts", {
        content: newPost,
        roomId: selectedRoomId,
        isAnonymous,
      });

      setNewPost("");
      setIsAnonymous(false);
      await fetchPosts();
    } catch (err) {
      console.error("Post error:", err);
      alert(err?.response?.data?.message || "Failed to create post");
    }
  };

  const filteredPosts = selectedRoomId
    ? posts.filter((post) => post.roomId === selectedRoomId)
    : posts;

  return (
    <DashboardShell
      userName={user?.name || "Student"}
      role="Student"
      navItems={navItems}
      onLogout={handleLogout}
    >
      <h1 style={styles.title}>Community 💬</h1>
      <p style={styles.subtitle}>
        Student-only space to share updates and thoughts.
      </p>

      {loading ? (
        <div style={styles.card}>Loading community...</div>
      ) : error ? (
        <div style={styles.card}>{error}</div>
      ) : (
        <>
          <div style={styles.notice}>
            🔒 This space is private. Wardens do not have access here.
          </div>

          <div style={styles.roomTabs}>
            {rooms.length === 0 ? (
              <div style={styles.emptyText}>No rooms found.</div>
            ) : (
              rooms.map((room) => {
                const active = selectedRoomId === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoomId(room.id)}
                    style={{
                      ...styles.roomTab,
                      ...(active ? styles.roomTabActive : {}),
                    }}
                  >
                    {room.name}
                  </button>
                );
              })
            )}
          </div>

          <div style={styles.composerCard}>
            <label style={styles.label}>Choose room</label>

            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              style={styles.select}
            >
              {rooms.length === 0 ? (
                <option value="">No rooms available</option>
              ) : (
                rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))
              )}
            </select>

            <textarea
              style={styles.textarea}
              placeholder="Share something with your hostel fam..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />

            <div style={styles.composerBottom}>
              <label style={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>Post anonymously</span>
              </label>

              <button style={styles.postBtn} onClick={handlePost}>
                Post
              </button>
            </div>
          </div>

          <div style={styles.sectionTitle}>POSTS</div>

          <div style={styles.listGrid}>
            {filteredPosts.length === 0 ? (
              <div style={styles.card}>No posts yet in this room.</div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} style={styles.postCard}>
                  <div style={styles.postHeader}>
                    <div>
                      <div style={styles.author}>
                        {post.isAnonymous ? "Anonymous" : post.user?.name}
                      </div>
                      <div style={styles.meta}>
                        {new Date(post.createdAt).toLocaleString()} ·{" "}
                        {post.room?.name}
                      </div>
                    </div>
                  </div>

                  <div style={styles.postContent}>{post.content}</div>
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
  notice: {
    marginTop: "28px",
    background: "#2a1020",
    border: "1px solid #5a2740",
    borderRadius: "20px",
    padding: "18px",
    color: "#ff8bb0",
    fontWeight: 700,
  },
  roomTabs: {
    marginTop: "20px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  roomTab: {
    background: "#181b2a",
    border: "1px solid #2b3045",
    color: "#d8d8e8",
    borderRadius: "999px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 700,
  },
  roomTabActive: {
    color: "#7c6cfa",
    border: "1px solid #4d4299",
    background: "#121524",
  },
  composerCard: {
    marginTop: "22px",
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "28px",
    padding: "24px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#bcbcd2",
    fontSize: "14px",
    fontWeight: 600,
  },
  select: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "16px",
    borderRadius: "16px",
    border: "1px solid #2b3045",
    background: "#181b2a",
    color: "#fff",
    boxSizing: "border-box",
    fontSize: "15px",
    appearance: "auto",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "16px",
    borderRadius: "20px",
    border: "1px solid #2b3045",
    background: "#181b2a",
    color: "#fff",
    boxSizing: "border-box",
    resize: "vertical",
  },
  composerBottom: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },
  checkboxWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#c7c7d1",
  },
  postBtn: {
    padding: "12px 22px",
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
  postCard: {
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "24px",
    padding: "20px",
  },
  postHeader: {
    marginBottom: "12px",
  },
  author: {
    fontSize: "20px",
    fontWeight: 800,
    marginBottom: "4px",
  },
  meta: {
    color: "#8d8da8",
    fontSize: "14px",
  },
  postContent: {
    fontSize: "18px",
    lineHeight: 1.6,
    color: "#f4f4fb",
  },
  card: {
    marginTop: "28px",
    background: "#11121b",
    border: "1px solid #25283a",
    borderRadius: "28px",
    padding: "24px",
  },
  emptyText: {
    color: "#8d8da8",
  },
};