import { Link } from "react-router-dom";

export default function PostCard({ post, onToggleFavorite }) {
  if (!post) return null;

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link
          to={`/posts/${post.id}`}
          style={{ fontSize: 20, fontWeight: 600, textDecoration: "none" }}
        >
          {post.title}
        </Link>
        <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
          {post.authorLogin}
        </span>
      </div>

      <p style={{ opacity: 0.8, margin: 0 }}>
        {post.text?.length > 200 ? `${post.text.slice(0, 200)}…` : post.text}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          opacity: 0.7,
        }}
      >
        <span>Rating: {post.ratingAvg ?? 0}</span>
        <span style={{ marginLeft: "auto" }}>
          {Array.isArray(post.tags) && post.tags.length > 0
            ? post.tags.join(", ")
            : null}
        </span>

        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(post.id)}
            style={{
              marginLeft: 12,
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid rgba(148, 163, 184, 0.6)",
              background: "white",
              cursor: "pointer",
            }}
          >
            ★
          </button>
        )}
      </div>
    </div>
  );
}
