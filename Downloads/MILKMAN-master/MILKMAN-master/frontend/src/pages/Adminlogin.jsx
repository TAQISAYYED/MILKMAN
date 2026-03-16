import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Adminlogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const up = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleLogin = async () => {
    if (!form.email)    { setError("Email address is required"); return; }
    if (!form.password) { setError("Password is required");      return; }
    setError(""); setLoading(true);

    try {
      const res  = await fetch("http://127.0.0.1:8000/api/auth/admin-login/", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Login failed");

      localStorage.setItem("access_token",  data.tokens.access);
      localStorage.setItem("refresh_token", data.tokens.refresh);
      localStorage.setItem("milkman_admin", JSON.stringify(data.user));
      navigate("/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-root">
      {/* Background shapes */}
      <div className="al-bg">
        <div className="al-shape al-s1" />
        <div className="al-shape al-s2" />
        <div className="al-shape al-s3" />
        <div className="al-dots" />
      </div>

      {/* Top bar */}
      <header className="al-topbar">
        <Link to="/" className="al-logo">
          <div className="al-logo-mark">🥛</div>
          <span className="al-logo-text">Milk<em>man</em></span>
        </Link>
        <Link to="/login" className="al-customer-link">
          Customer login →
        </Link>
      </header>

      {/* Center content */}
      <main className="al-main">
        {/* Left info column */}
        <div className="al-info">
          <div className="al-info-badge">Admin Portal</div>
          <h1 className="al-info-title">
            Manage your<br />
            <em>dairy business</em><br />
            from one place.
          </h1>
          <p className="al-info-desc">
            Track deliveries, manage customers, update products
            and monitor subscriptions — all in one dashboard.
          </p>

          <div className="al-stats">
            <div className="al-stat">
              <span className="al-stat-n">2,841</span>
              <span className="al-stat-l">Customers</span>
            </div>
            <div className="al-stat-div" />
            <div className="al-stat">
              <span className="al-stat-n">12.4K</span>
              <span className="al-stat-l">Deliveries</span>
            </div>
            <div className="al-stat-div" />
            <div className="al-stat">
              <span className="al-stat-n">98.3%</span>
              <span className="al-stat-l">On-time</span>
            </div>
          </div>

          <div className="al-avatars">
            <div className="al-avatar-stack">
              {["R","P","M","A"].map((l,i) => (
                <div key={l} className="al-av" style={{zIndex:4-i, marginLeft: i ? "-10px" : "0"}}>{l}</div>
              ))}
            </div>
            <span className="al-avatar-label">4 admins active today</span>
          </div>
        </div>

        {/* Right form */}
        <div className="al-form-wrap">
          <div className="al-card">
            {/* Card header */}
            <div className="al-card-head">
              <div className="al-card-icon">
                <span>🔐</span>
              </div>
              <div>
                <h2 className="al-card-title">Admin Sign In</h2>
                <p className="al-card-sub">Authorized personnel only</p>
              </div>
            </div>

            <div className="al-divider" />

            {error && (
              <div className="al-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="al-form">
              <div className="al-field">
                <label className="al-label">Email Address</label>
                <div className="al-input-wrap">
                  <span className="al-icon">✉️</span>
                  <input
                    className="al-input"
                    type="email"
                    placeholder="admin@milkman.com"
                    value={form.email}
                    onChange={e => up("email", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="al-field">
                <div className="al-label-row">
                  <label className="al-label">Password</label>
                </div>
                <div className="al-input-wrap">
                  <span className="al-icon">🔒</span>
                  <input
                    className="al-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => up("password", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    autoComplete="current-password"
                  />
                  <button
                    className="al-eye"
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    tabIndex={-1}
                  >{showPass ? "🙈" : "👁️"}</button>
                </div>
              </div>

              <button
                className="al-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <><span className="al-spinner" /> Authenticating…</>
                ) : (
                  <>
                    <span className="al-btn-icon">🔓</span>
                    Access Dashboard
                  </>
                )}
              </button>
            </div>

            <div className="al-footer-note">
              <span className="al-lock-icon">🔒</span>
              <span>All sessions are encrypted and logged for security</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
