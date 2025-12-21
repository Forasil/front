import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PostCreate() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({ title: "", text: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const errors = { title: "", text: "" };
    let msg = "";

    const titleTrimmed = title.trim();
    const textTrimmed = text.trim();

    if (titleTrimmed.length < 3) {
      errors.title = "Заголовок минимум 3 символа";
      msg ||= errors.title;
    }

    if (textTrimmed.length < 10) {
      errors.text = "Текст минимум 10 символов";
      if (!msg) msg = errors.text;
    }

    setFieldError(errors);
    return msg;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldError({ title: "", text: "" });

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/posts", { title, text });

      if (res.data?.id) {
        navigate(`/posts/${res.data.id}`);
      } else {
        navigate("/feed");
      }
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Не удалось создать пост";
      setError(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h2>Create post</h2>

      <form
        onSubmit={submit}
        style={{ display: "grid", gap: 10, marginTop: 10 }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error || fieldError.title) {
                setError("");
                setFieldError((prev) => ({ ...prev, title: "" }));
              }
            }}
            placeholder="Title"
            maxLength={200}
            style={{ padding: 8 }}
          />
          {fieldError.title && (
            <span style={{ color: "red", fontSize: 12 }}>
              {fieldError.title}
            </span>
          )}
        </div>

        <div style={{ display: "grid", gap: 4 }}>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error || fieldError.text) {
                setError("");
                setFieldError((prev) => ({ ...prev, text: "" }));
              }
            }}
            placeholder="Text"
            rows={10}
            maxLength={10000}
            style={{ padding: 8, resize: "vertical" }}
          />
          {fieldError.text && (
            <span style={{ color: "red", fontSize: 12 }}>
              {fieldError.text}
            </span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}
    </div>
  );
}
