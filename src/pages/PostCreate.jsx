import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PostCreate() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (title.trim().length < 3) return "Заголовок минимум 3 символа";
    if (text.trim().length < 10) return "Текст минимум 10 символов";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      setLoading(true);

      const res = await api.post("/posts", {
        title: title.trim(),
        content: text.trim(),
        tags: tagsArray,
      });

      navigate(`/posts/${res.data.id}`);
    } catch (e) {
      setError("Validation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-full">
      <div className="post-create-card">
        <h2 className="post-create-title">Create post</h2>

        <form className="post-create-form" onSubmit={handleSubmit}>
          <label className="post-label">
            Заголовок
            <input
              className="post-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок"
            />
          </label>

          <label className="post-label">
            Теги
            <input
              className="post-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Например: java, spring, backend"
            />
            <span className="post-helper">
              Перечислите через запятую: <i>tag1, tag2, tag3</i>
            </span>
          </label>

          <label className="post-label">
            Текст поста
            <textarea
              className="post-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напишите ваш пост…"
              rows={12}
            />
          </label>

          {error && <p className="auth-error" style={{ marginTop: 8 }}>{error}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Публикуем..." : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
