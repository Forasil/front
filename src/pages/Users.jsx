import { useEffect, useState } from "react";
import api from "../api/axios";
import { useDebounce } from "../hooks/useDebounce";

export default function Users() {
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 400);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await api.get("/users", { params: { query: debounced } });
      setUsers(res.data);
    } catch {
      setError("Не удалось загрузить пользователей");
    }
  };

  useEffect(() => {
    load();
  }, [debounced]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>Users</h2>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gap: 8 }}>
        {users.map((u) => (
          <div key={u.id} style={{ border: "1px solid #eee", padding: 10, borderRadius: 10 }}>
            <b>{u.login}</b>
            <div style={{ opacity: 0.7 }}>{u.name ?? ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
