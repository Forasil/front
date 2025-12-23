import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [login, setLogin] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.get("/users/me");
      const user = res.data?.data;

      setLogin(user?.username || "");
      setBio(user?.bio || "");
    } catch (e) {
      console.error(e);
      setError("Не удалось загрузить профиль");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedLogin = login.trim();

    if (!trimmedLogin) {
      setError("Логин не может быть пустым");
      return;
    }

    try {
      setSaving(true);

      const body = {
        username: trimmedLogin,
        bio: bio.trim(),
      };

      const res = await api.put("/users/me", body);
      const updated = res.data?.data;

      setLogin(updated?.username || trimmedLogin);
      setBio(updated?.bio || bio);
      setSuccess("Профиль успешно сохранён");
    } catch (e) {
      console.error(e);
      setError("Не удалось сохранить профиль");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-full">
      <div className="page-inner">
        <h2 className="page-title">Profile</h2>

        {loading && <p>Загружаем профиль...</p>}

        {!loading && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              Логин
              <input
                className="auth-input"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Ваш логин"
              />
            </label>

            <label className="auth-label">
              О себе
              <textarea
                className="auth-input"
                style={{ minHeight: 120, resize: "vertical" }}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Пара слов о себе"
              />
            </label>

            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}

            <button className="auth-button" type="submit" disabled={saving}>
              {saving ? "Сохраняем..." : "Save"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
