import { useState } from "react";

export default function CommentForm({ onSend }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (text.trim().length < 2) return;
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 10 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write comment..."
        style={{ flex: 1 }}
      />
      <button type="submit">Send</button>
    </form>
  );
}
