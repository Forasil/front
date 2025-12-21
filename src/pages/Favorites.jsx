import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";

export default function Favorites() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await api.get("/favorites");
      setPosts(res.data);
    } catch (e) {
      setError("Не удалось загрузить избранное");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleFavorite = async (postId) => {
    try {
      await api.post(`/favorites/toggle/${postId}`);
      load();
    } catch {
      alert("Не удалось изменить избранное");
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>Favorites</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {posts.map((p) => (
        <PostCard key={p.id} post={p} onToggleFavorite={toggleFavorite} />
      ))}
    </div>
  );
}
