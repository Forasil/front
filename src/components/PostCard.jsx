import { Link } from "react-router-dom";

export default function PostCard({ post, onToggleFavorite }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
      <Link to={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
        <h3 style={{ margin: "0 0 6px" }}>{post.title}</h3>
      </Link>

      <p style={{ margin: "0 0 8px" }}>{post.text?.slice(0, 160)}{post.text?.length > 160 ? "..." : ""}</p>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ opacity: 0.7 }}>author: {post.authorLogin}</span>
        <span style={{ marginLeft: "auto", opacity: 0.7 }}>rating: {post.ratingAvg ?? 0}</span>

        <button onClick={() => onToggleFavorite?.(post.id)}>
          {post.isFavorite ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
