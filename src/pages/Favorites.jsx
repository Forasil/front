import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";

export default function Favorites() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/posts/popular");

      const items = res.data?.data?.items ?? [];

      setPosts(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error(e);
      setError("Не удалось загрузить избранное (популярные посты)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-full">
      <div className="page-inner">
        <h2 className="page-title">Favorites</h2>

        {loading && <p>Загружаем популярные посты...</p>}
        {error && <p className="auth-error">{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <p>Пока нет популярных постов.</p>
        )}

        <div className="post-list">
          {Array.isArray(posts) &&
            posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  );
}
