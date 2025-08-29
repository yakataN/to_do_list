import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isRegister ? "register" : "login";
    try {
      const res = await fetch(`http://localhost:4000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        onLogin();
      } else {
        setError(data.error || (isRegister ? "登録失敗" : "ログイン失敗"));
      }
    } catch {
      setError("通信エラー");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 32, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#1976d2" }}>{isRegister ? "新規登録" : "ログイン"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="ユーザー名"
            style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #bdbdbd", fontSize: 16 }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="パスワード"
            style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #bdbdbd", fontSize: 16 }}
            required
          />
        </div>
        {error && <div style={{ color: "#e53935", marginBottom: 16 }}>{error}</div>}
        <button type="submit" style={{ width: "100%", background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>{isRegister ? "登録" : "ログイン"}</button>
      </form>
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button
          type="button"
          onClick={() => { setIsRegister(!isRegister); setError(""); }}
          style={{ background: "none", border: "none", color: "#1976d2", fontSize: 15, cursor: "pointer", textDecoration: "underline" }}
        >
          {isRegister ? "ログイン画面へ" : "新規登録はこちら"}
        </button>
      </div>
    </div>
  );
}

export default Login;
