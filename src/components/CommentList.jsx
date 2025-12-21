export default function CommentList({ comments = [] }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {comments.map((c) => (
        <div key={c.id} style={{ border: "1px solid #eee", padding: 10, borderRadius: 10 }}>
          <b>{c.authorLogin}</b>
          <p style={{ margin: "6px 0 0" }}>{c.text}</p>
        </div>
      ))}
    </div>
  );
}
