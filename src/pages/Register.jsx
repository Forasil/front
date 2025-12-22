import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!login.trim()) return "Введите логин";
    if (!email.trim()) return "Введите email";
    if (!email.includes("@")) return "Некорректный email";
    if (password.length < 6) return "Пароль минимум 6 символов";
    if (password !== passwordRepeat) return "Пароли не совпадают";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        username: login,
        email,
        password,
      });

      setSuccess("Регистрация прошла успешно! Теперь можно войти.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(
        "Не удалось зарегистрироваться (логин или email уже могут быть заняты)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-full">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Логин
            <input
              className="auth-input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Придумайте логин"
            />
          </label>

          <label className="auth-label">
            Email
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
            />
          </label>

          <label className="auth-label">
            Пароль
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Придумайте пароль"
            />
          </label>

          <label className="auth-label">
            Повторите пароль
            <input
              className="auth-input"
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              placeholder="Повторите пароль"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Отправляем..." : "Register"}
          </button>
        </form>

        <p className="auth-bottom-text">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="auth-link">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
