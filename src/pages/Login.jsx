import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setToken } from "../store/auth";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!login.trim()) return "Введите логин или email";
    if (password.length < 6) return "Пароль минимум 6 символов";
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

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        usernameOrEmail: login,
        password,
      });

      const token = res.data?.data?.token;
      if (!token) {
        throw new Error("Token not found in response");
      }

      setToken(token);
      navigate("/feed");
    } catch (err) {
      console.error(err);
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-full">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Логин или email
            <input
              className="auth-input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Логин или email"
            />
          </label>

          <label className="auth-label">
            Пароль
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Входим..." : "Login"}
          </button>
        </form>

        <p className="auth-bottom-text">
          Нет аккаунта?{" "}
          <Link to="/register" className="auth-link">
            Регистрация
          </Link>
        </p>
      </div>
    </div>
  );
}
