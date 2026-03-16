import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Customerlogin.css";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name:"", phone:"", password:"", address:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const up = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    if (!form.phone || !form.password) { setError("Phone and password are required"); return; }
    if (mode === "register" && !form.name.trim()) { setError("Name is required"); return; }
    setError(""); setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/customer-login/" : "/api/auth/customer-register/";
      const body = mode === "login"
        ? { phone: form.phone, password: form.password }
        : { name: form.name, phone: form.phone, password: form.password, address: form.address };

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
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
      <div className="cl-bg">
        <div className="cl-orb cl-o1" /><div className="cl-orb cl-o2" />
        <div className="cl-dots" />
      </div>

      {/* LEFT */}
      <div className="cl-left">
        <Link to="/" className="cl-back">← Home</Link>
        <div className="cl-brand">
          <div className="cl-brand-icon">🥛</div>
          <h1 className="cl-brand-name">Milk<em>man</em></h1>
          <p className="cl-brand-tag">Farm fresh · Delivered daily</p>
        </div>
        <div className="cl-perks">
          {[
            { icon:"🌿", t:"100% Organic",    s:"Pure, natural dairy" },
            { icon:"🚚", t:"Before 7 AM",     s:"Fresh every morning" },
            { icon:"📅", t:"Flexible Plans",  s:"Pause anytime" },
            { icon:"⭐", t:"500+ Families",   s:"Trusted since 2010" },
          ].map(p => (
            <div key={p.t} className="cl-perk">
              <span>{p.icon}</span>
              <div><div className="cl-perk-t">{p.t}</div><div className="cl-perk-s">{p.s}</div></div>
            </div>
          ))}
        </div>
        <Link to="/admin-login" className="cl-admin-link">🔐 Admin Portal</Link>
      </div>

      {/* RIGHT */}
      <div className="cl-right">
        <div className="cl-card">
          {/* Toggle */}
          <div className="cl-toggle">
            <button className={`cl-tog ${mode==="login"?"active":""}`} onClick={() => { setMode("login"); setError(""); }}>Login</button>
            <button className={`cl-tog ${mode==="register"?"active":""}`} onClick={() => { setMode("register"); setError(""); }}>Register</button>
            <span className={`cl-tog-slider ${mode==="register"?"right":""}`} />
          </div>

          <h2 className="cl-title">{mode==="login" ? "Welcome back 👋" : "Create account ✨"}</h2>
          <p className="cl-sub">{mode==="login" ? "Sign in to your account" : "Join the Milkman family"}</p>

          {error && <div className="cl-error">⚠️ {error}</div>}

          <div className="cl-form">
            {mode === "register" && (
              <div className="cl-field">
                <label>Full Name</label>
                <div className="cl-input">
                  <span>👤</span>
                  <input placeholder="Priya Sharma" value={form.name} onChange={e => up("name", e.target.value)} />
                </div>
              </div>
            )}

            <div className="cl-field">
              <label>Phone Number</label>
              <div className="cl-input">
                <span className="cl-prefix">+91</span>
                <div className="cl-divv" />
                <input type="tel" placeholder="98765 43210" maxLength={10}
                  value={form.phone} onChange={e => up("phone", e.target.value.replace(/\D/g,""))}
                  onKeyDown={e => e.key==="Enter" && handleSubmit()}
                />
              </div>
            </div>

            <div className="cl-field">
              <label>Password</label>
              <div className="cl-input">
                <span>🔒</span>
                <input type={showPass?"text":"password"} placeholder="••••••••"
                  value={form.password} onChange={e => up("password", e.target.value)}
                  onKeyDown={e => e.key==="Enter" && handleSubmit()}
                />
                <button className="cl-eye" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div className="cl-field">
                <label>Delivery Address</label>
                <div className="cl-input cl-input-tall">
                  <span>📍</span>
                  <textarea placeholder="House no, Street, City, Pincode"
                    value={form.address} onChange={e => up("address", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            )}

            <button className="cl-btn" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <><span className="cl-spin" /> {mode==="login" ? "Signing in…" : "Creating account…"}</>
                : mode==="login" ? "Sign In →" : "Create Account →"
              }
            </button>
          </div>

          <p className="cl-switch">
            {mode==="login" ? "New here? " : "Have an account? "}
            <button onClick={() => { setMode(mode==="login"?"register":"login"); setError(""); }}>
              {mode==="login" ? "Register free" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
