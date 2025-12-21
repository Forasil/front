import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!login.trim()) return "Введите логин";
    if (password.length < 6) return "Пароль минимум 6 символов";
    if (password !== password2) return "Пароли не совпадают";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    const v = validate();
    if (v) return setError(v);

    try {
      await api.post("/auth/register", { login, password });
      setOk("Успешно! Теперь войдите.");
      setTimeout(() => navigate("/login"), 600);
    } catch (err) {
      setError("Не удалось зарегистрироваться (возможно логин занят)");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 320 }}>
        <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <input
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Repeat password"
          type="password"
        />
        <button type="submit">Register</button>
      </form>

      {ok && <p style={{ color: "green" }}>{ok}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}
