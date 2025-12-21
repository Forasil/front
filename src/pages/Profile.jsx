import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await api.get("/users/me");
      setMe(res.data);
      setName(res.data.name ?? "");
      setAbout(res.data.about ?? "");
    } catch {
      setError("Не удалось загрузить профиль");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    if (name.trim().length < 2) return setError("Имя минимум 2 символа");

    try {
      await api.put("/users/me", { name, about });
      setOk("Сохранено");
      load();
    } catch {
      setError("Не удалось сохранить");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!me) return <p>Loading...</p>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>Profile</h2>
      <p>
        <b>login:</b> {me.login}
      </p>

      <form onSubmit={save} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="About" rows={5} />
        <button type="submit">Save</button>
      </form>

      {ok && <p style={{ color: "green" }}>{ok}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
