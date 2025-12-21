import { Link, useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../store/auth";

export default function Navbar() {
  const token = getToken();
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div
      style={{
        padding: 12,
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <b>Blog</b>

      {token ? (
        <>
          <Link to="/feed">Feed</Link>
          <Link to="/posts/new">Create</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/users">Users</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={logout} style={{ marginLeft: "auto" }}>
            Logout
          </button>
        </>
      ) : (
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
}
