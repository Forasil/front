import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setToken } from "../store/auth";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!login.trim()) return "Введите логин";
    if (password.length < 6) return "Пароль минимум 6 символов";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) return setError(v);

    try {
      const res = await api.post("/auth/login", { login, password });
      setToken(res.data.token);
      navigate("/feed");
    } catch (err) {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 320 }}>
        <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
    </div>
  );
}
