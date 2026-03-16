import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const user  = JSON.parse(localStorage.getItem("milkman_user")  || "null");
  const admin = JSON.parse(localStorage.getItem("milkman_admin") || "null");
  const isLoggedIn = !!(user || admin);
  const isAdmin    = !!admin;
  const displayName = user?.name || admin?.name || "";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const read = () => {
      const c = JSON.parse(localStorage.getItem("milkman_cart") || "{}");
      setCartCount(Object.values(c).reduce((a, b) => a + b, 0));
    };
    read();
    window.addEventListener("storage", read);
    const t = setInterval(read, 800);
    return () => { window.removeEventListener("storage", read); clearInterval(t); };
  }, []);

  const logout = () => {
    ["access_token","refresh_token","milkman_user","milkman_admin","milkman_cart"]
      .forEach(k => localStorage.removeItem(k));
    navigate("/");
    setMenuOpen(false);
  };

  const active = (p) => location.pathname === p;

  if (["/login", "/admin-login"].includes(location.pathname)) return null;

  const adminLinks = [
    { to: "/users",         label: "Users",         icon: "👥" },
    { to: "/customers",     label: "Customers",     icon: "🏠" },
    { to: "/products",      label: "Products",      icon: "🥛" },
    { to: "/categories",    label: "Categories",    icon: "🏷️" },
    { to: "/subscriptions", label: "Subscriptions", icon: "📋" },
    { to: "/api-test",      label: "API Test",      icon: "⚡" },
  ];

  const customerLinks = [
    { to: "/",              label: "Home",          icon: "🏠" },
    { to: "/subscriptions", label: "Subscriptions", icon: "📅" },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <nav className={`nb ${scrolled ? "nb-stuck" : ""}`}>
      <div className="nb-wrap">

        {/* ── Logo ── */}
        <Link to="/" className="nb-logo" onClick={() => setMenuOpen(false)}>
          <div className="nb-logo-drop">
            <span>🥛</span>
          </div>
          <div className="nb-logo-words">
            <span className="nb-logo-main">Milk<em>man</em></span>
            <span className="nb-logo-tiny">
              {isAdmin ? "Admin Dashboard" : "Fresh Dairy"}
            </span>
          </div>
        </Link>

        {/* ── Center nav ── */}
        <div className="nb-nav">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nb-item ${active(l.to) ? "nb-item-on" : ""}`}
            >
              <span className="nb-item-icon">{l.icon}</span>
              <span className="nb-item-label">{l.label}</span>
              {active(l.to) && <span className="nb-item-dot" />}
            </Link>
          ))}
        </div>

        {/* ── Right side ── */}
        <div className="nb-end">

          {/* Admin live pill */}
          {isAdmin && (
            <div className="nb-live-pill">
              <span className="nb-live-dot" />
              <span>Live</span>
            </div>
          )}

          {/* Cart — customer only, always visible even when logged out */}
          {!isAdmin && (
            <Link
              to={isLoggedIn ? "/cart" : "/login"}
              className={`nb-cart ${active("/cart") ? "nb-cart-on" : ""}`}
            >
              <span className="nb-cart-icon">🛒</span>
              <span className="nb-cart-label">Cart</span>
              {cartCount > 0 && (
                <span className="nb-cart-count">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </Link>
          )}

          {/* User chip / auth buttons */}
          {isLoggedIn ? (
            <div className="nb-chip">
              <div className="nb-chip-av">
                {displayName ? displayName[0].toUpperCase() : "?"}
              </div>
              <div className="nb-chip-info">
                <span className="nb-chip-name">{displayName || "User"}</span>
                <span className="nb-chip-role">{isAdmin ? "Admin" : "Customer"}</span>
              </div>
              <button className="nb-chip-out" onClick={logout} title="Sign out">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="nb-auth">
              <Link to="/login"       className="nb-auth-ghost">Login</Link>
              <Link to="/admin-login" className="nb-auth-solid">Admin ↗</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className={`nb-burger ${menuOpen ? "nb-burger-x" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`nb-drawer ${menuOpen ? "nb-drawer-open" : ""}`}>
        <div className="nb-drawer-links">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nb-drawer-item ${active(l.to) ? "nb-drawer-on" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          ))}
          {!isAdmin && (
            <Link
              to={isLoggedIn ? "/cart" : "/login"}
              className={`nb-drawer-item nb-drawer-cart ${active("/cart") ? "nb-drawer-on" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <span>🛒</span>
              <span>Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
            </Link>
          )}
        </div>
        <div className="nb-drawer-foot">
          {isLoggedIn ? (
            <button className="nb-drawer-logout" onClick={logout}>
              Sign out · {displayName}
            </button>
          ) : (
            <div className="nb-drawer-auth">
              <Link to="/login"       className="nb-auth-ghost" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/admin-login" className="nb-auth-solid" onClick={() => setMenuOpen(false)}>Admin ↗</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
