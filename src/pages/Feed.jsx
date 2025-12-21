import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";
import { useDebounce } from "../hooks/useDebounce";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 400);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/posts", {
        params: debounced?.trim() ? { query: debounced.trim() } : {},
      });

      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError("Не удалось загрузить ленту");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [debounced]);

  const onToggleFavorite = async (postId) => {
    try {
      await api.post(`/favorites/toggle/${postId}`);
      await loadPosts();
    } catch (e) {
      alert("Не удалось изменить избранное");
    }
  };

  const onDeletePost = async (postId) => {
    if (!confirm("Удалить пост?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (e) {
      alert("Не удалось удалить пост");
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>Feed</h2>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search posts by title/text..."
        style={{ padding: 10, maxWidth: 520 }}
      />

      {loading && <Loader />}
      {error && <ErrorBox message={error} onRetry={loadPosts} />}

      {!loading && !error && posts.length === 0 && (
        <p style={{ opacity: 0.8 }}>Постов пока нет</p>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onToggleFavorite={() => onToggleFavorite(p.id)}
            onDelete={() => onDeletePost(p.id)}
          />
        ))}
      </div>
    </div>
  );
}
