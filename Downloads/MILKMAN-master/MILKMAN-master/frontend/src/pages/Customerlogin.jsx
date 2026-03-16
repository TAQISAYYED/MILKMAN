import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Customerlogin.css";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [mode, setMode]         = useState("login");
  const [form, setForm]         = useState({ name:"", phone:"", password:"", address:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const up = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    if (!form.phone)    { setError("Phone number is required"); return; }
    if (!form.password) { setError("Password is required"); return; }
    if (mode === "register" && !form.name.trim()) { setError("Name is required"); return; }
    setError(""); setLoading(true);

    try {
      const endpoint = mode === "login"
        ? "/api/auth/customer-login/"
        : "/api/auth/customer-register/";
      const body = mode === "login"
        ? { phone: form.phone, password: form.password }
        : { name: form.name, phone: form.phone, password: form.password, address: form.address };

      const res  = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Something went wrong");

      localStorage.setItem("access_token",  data.tokens.access);
      localStorage.setItem("refresh_token", data.tokens.refresh);
      localStorage.setItem("milkman_user",  JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cl-root">
      {/* Soft decorative blobs */}
      <div className="cl-blob cl-blob1" />
      <div className="cl-blob cl-blob2" />
      <div className="cl-blob cl-blob3" />

      {/* Left illustration panel */}
      <div className="cl-left">
        <Link to="/" className="cl-back-link">← Back to home</Link>

        <div className="cl-illo">
          <div className="cl-illo-circle cl-ic1" />
          <div className="cl-illo-circle cl-ic2" />
          <div className="cl-illo-circle cl-ic3" />
          <div className="cl-illo-center">
            <span className="cl-illo-icon">🥛</span>
          </div>
        </div>

        <div className="cl-brand">
          <h1 className="cl-brand-name">Milk<em>man</em></h1>
          <p className="cl-brand-tagline">Farm fresh dairy,<br/>delivered to your door.</p>
        </div>

        <div className="cl-features">
          <div className="cl-feat"><span>🌿</span><span>100% Organic</span></div>
          <div className="cl-feat"><span>🚚</span><span>Before 7 AM daily</span></div>
          <div className="cl-feat"><span>❄️</span><span>Cold-chain preserved</span></div>
          <div className="cl-feat"><span>📅</span><span>Pause anytime</span></div>
        </div>

        <Link to="/admin-login" className="cl-admin-hint">Admin? Sign in here →</Link>
      </div>

      {/* Right form panel */}
      <div className="cl-right">
        <div className="cl-card">
          {/* Tab switcher */}
          <div className="cl-tabs">
            <button
              className={`cl-tab ${mode === "login" ? "cl-tab-active" : ""}`}
              onClick={() => { setMode("login"); setError(""); }}
            >Sign In</button>
            <button
              className={`cl-tab ${mode === "register" ? "cl-tab-active" : ""}`}
              onClick={() => { setMode("register"); setError(""); }}
            >Create Account</button>
            <div className={`cl-tab-indicator ${mode === "register" ? "cl-tab-right" : ""}`} />
          </div>

          <div className="cl-card-body">
            <div className="cl-greeting">
              <h2 className="cl-greeting-title">
                {mode === "login" ? "Welcome back 👋" : "Join Milkman ✨"}
              </h2>
              <p className="cl-greeting-sub">
                {mode === "login"
                  ? "Sign in to manage your deliveries"
                  : "Create your account in seconds"}
              </p>
            </div>

            {error && (
              <div className="cl-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="cl-form">
              {mode === "register" && (
                <div className="cl-field">
                  <label className="cl-label">Full Name</label>
                  <div className="cl-input-wrap">
                    <span className="cl-input-icon">👤</span>
                    <input
                      className="cl-input"
                      type="text"
                      placeholder="Priya Sharma"
                      value={form.name}
                      onChange={e => up("name", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="cl-field">
                <label className="cl-label">Phone Number</label>
                <div className="cl-input-wrap">
                  <span className="cl-input-prefix">+91</span>
                  <div className="cl-input-divider" />
                  <input
                    className="cl-input"
                    type="tel"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => up("phone", e.target.value.replace(/\D/g, ""))}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  />
                </div>
              </div>

              <div className="cl-field">
                <label className="cl-label">Password</label>
                <div className="cl-input-wrap">
                  <span className="cl-input-icon">🔒</span>
                  <input
                    className="cl-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => up("password", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  />
                  <button
                    className="cl-eye-btn"
                    onClick={() => setShowPass(s => !s)}
                    tabIndex={-1}
                    type="button"
                  >{showPass ? "🙈" : "👁️"}</button>
                </div>
              </div>

              {mode === "register" && (
                <div className="cl-field">
                  <label className="cl-label">Delivery Address <span className="cl-optional">(optional)</span></label>
                  <div className="cl-input-wrap cl-textarea-wrap">
                    <span className="cl-input-icon" style={{alignSelf:"flex-start",paddingTop:"10px"}}>📍</span>
                    <textarea
                      className="cl-input cl-textarea"
                      placeholder="House no, Street, City, Pincode"
                      rows={2}
                      value={form.address}
                      onChange={e => up("address", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                className="cl-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <><span className="cl-spinner" /> {mode === "login" ? "Signing in…" : "Creating account…"}</>
                ) : (
                  mode === "login" ? "Sign In →" : "Create Account →"
                )}
              </button>
            </div>

            <p className="cl-switch">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                className="cl-switch-btn"
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              >
                {mode === "login" ? "Register free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
