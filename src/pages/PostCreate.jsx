import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PostCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [featured, setFeatured] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const t = title.trim();
    const c = content.trim();

    if (!t) return "Заголовок обязателен";
    if (t.length > 200) return "Заголовок не длиннее 200 символов";
    if (!c) return "Текст обязателен";
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

    const tags =
      tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

    const body = {
      title: title.trim(),
      content: content.trim(),
      tags,
      featured,
    };

    try {
      setLoading(true);

      const res = await api.post("/posts", body);

      console.log("Создан пост:", res.data?.data);

      navigate("/feed");
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;

      if (status === 400) {
        setError("Сервер отклонил данные. Проверь заголовок и текст.");
      } else if (status === 403) {
        setError("Нет прав для создания поста (нужно войти под аккаунтом).");
      } else {
        setError("Не удалось создать пост");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-full">
      <div className="page-inner">
        <h2 className="page-title">Create post</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Заголовок
            <input
              className="auth-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название поста"
            />
          </label>

          <label className="auth-label">
            Текст
            <textarea
              className="auth-input"
              style={{ minHeight: 160, resize: "vertical" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Текст поста"
            />
          </label>

          <label className="auth-label">
            Теги (через запятую)
            <input
              className="auth-input"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="например: java, spring, web"
            />
          </label>

          <label
            className="auth-label"
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Сделать пост «featured»
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Публикуем..." : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
