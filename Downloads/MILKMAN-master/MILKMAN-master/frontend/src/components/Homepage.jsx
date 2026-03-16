import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

export default function Homepage() {
  const [cart, setCart] = useState([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionForm, setSubscriptionForm] = useState({
    product: "",
    subscription_type: "daily",
    quantity: 1,
    start_date: "",
  });
  const navigate = useNavigate();

  const products = [
    { id: 1, name: "Fresh Milk",    price: 60,  image: "/images/milk2.png", unit: "litre", desc: "Farm-fresh A2 milk delivered daily to your door", tag: "Best Seller" },
    { id: 2, name: "Pure Ghee",     price: 600, image: "/images/ghee2.png",  unit: "kg",    desc: "Hand-churned desi ghee from Gir cow milk",      tag: "Premium"    },
    { id: 3, name: "Creamy Cheese", price: 400, image: "/images/cheese2.png",unit: "kg",    desc: "Artisan cheese made from pure farm milk",        tag: "Artisan"    },
  ];

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const updateCartQty = (id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const handleQuickSubscribe = (product) => {
    setSubscriptionForm({ ...subscriptionForm, product: product.id, start_date: new Date().toISOString().split("T")[0] });
    setShowSubscriptionModal(true);
  };

  const updateSubQty = (type) => {
    setSubscriptionForm((prev) => ({
      ...prev,
      quantity: type === "inc" ? prev.quantity + 1 : prev.quantity > 1 ? prev.quantity - 1 : 1,
    }));
  };

  const closeModal = () => {
    setShowSubscriptionModal(false);
    setSubscriptionForm({ product: "", subscription_type: "daily", quantity: 1, start_date: "" });
  };

  const getCartTotal = () => cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const selectedProduct = products.find((p) => p.id === subscriptionForm.product);

  return (
    <div className="hp-root">

      {/* ── Cart Pill ── */}
      {cart.length > 0 && (
        <div className="hp-cart-pill">
          <button onClick={() => navigate("/cart", { state: { cart } })} className="hp-cart-btn">
            <span className="hp-cart-icon">🛒</span>
            <span className="hp-cart-count">{cart.length}</span>
            <span className="hp-cart-sep">·</span>
            <span>₹{getCartTotal()}</span>
          </button>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="hp-hero">
        {/* Background blobs */}
        <div className="hp-hero-bg">
          <div className="hp-blob hp-blob-1" />
          <div className="hp-blob hp-blob-2" />
          <div className="hp-blob hp-blob-3" />
          <div className="hp-grid-lines" />
        </div>

        <div className="hp-hero-content">
          <div className="hp-hero-badge">
            <span className="hp-hero-badge-dot" />
            Pure · Farm Fresh · Daily Delivery
          </div>

          <h1 className="hp-hero-title">
            Fresh Milk
            <span className="hp-hero-title-accent">Delivered Daily</span>
          </h1>

          <p className="hp-hero-sub">
            Pure, farm-fresh Milk, Ghee &amp; Cheese subscription service
            straight from our farm to your table.
          </p>

          <div className="hp-hero-btns">
            <button className="hp-btn-primary" onClick={() => navigate("/products")}>
              Shop All Products
              <span className="hp-btn-arrow">→</span>
            </button>
            <button className="hp-btn-secondary" onClick={() => navigate("/subscriptions")}>
              My Subscriptions
            </button>
          </div>

          {/* Inline trust badges */}
          <div className="hp-hero-trust">
            {["🌿 100% Organic", "🚚 Free Delivery", "⭐ 500+ Customers"].map((t) => (
              <span key={t} className="hp-trust-badge">{t}</span>
            ))}
          </div>
        </div>

        <div className="hp-hero-visual">
          <div className="hp-hero-img-wrap">
            <div className="hp-hero-ring hp-ring-1" />
            <div className="hp-hero-ring hp-ring-2" />
            <div className="hp-hero-circle">
              <img src="/images/milk1.webp" alt="Fresh milk" />
            </div>
            {/* Floating cards */}
            <div className="hp-float-card hp-float-1">
              <span className="hp-float-icon">🥛</span>
              <div>
                <div className="hp-float-label">Daily Delivery</div>
                <div className="hp-float-val">Before 7 AM</div>
              </div>
            </div>
            <div className="hp-float-card hp-float-2">
              <span className="hp-float-icon">✓</span>
              <div>
                <div className="hp-float-label">This Month</div>
                <div className="hp-float-val">124 Orders</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="hp-stats">
        {[
          { num: "500+",   label: "Happy Customers", icon: "👨‍👩‍👧‍👦" },
          { num: "100%",   label: "Organic",          icon: "🌿" },
          { num: "Daily",  label: "Fresh Delivery",   icon: "🚚" },
          { num: "3+",     label: "Product Types",    icon: "🥛" },
        ].map((s) => (
          <div key={s.label} className="hp-stat">
            <span className="hp-stat-icon">{s.icon}</span>
            <span className="hp-stat-num">{s.num}</span>
            <span className="hp-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Products ── */}
      <section className="hp-products">
        <div className="hp-section-head">
          <div className="hp-section-tag">What We Offer</div>
          <h2 className="hp-section-title">Our Fresh Products</h2>
          <p className="hp-section-sub">Sourced daily from our farm, delivered fresh to your doorstep</p>
        </div>

        <div className="hp-products-grid">
          {products.map((product, i) => (
            <div key={product.id} className="hp-product-card" style={{ animationDelay: `${i * 120}ms` }}>
              {product.tag && <div className="hp-product-tag">{product.tag}</div>}
              <div className="hp-product-img">
                <img src={product.image} alt={product.name} loading="lazy" />
                <div className="hp-product-overlay">
                  <button className="hp-overlay-btn hp-overlay-primary" onClick={() => addToCart(product)}>
                    🛒 Add to Cart
                  </button>
                  <button className="hp-overlay-btn hp-overlay-secondary" onClick={() => handleQuickSubscribe(product)}>
                    📅 Subscribe
                  </button>
                </div>
              </div>
              <div className="hp-product-body">
                <h3 className="hp-product-name">{product.name}</h3>
                <p className="hp-product-desc">{product.desc}</p>
                <div className="hp-product-footer">
                  <div className="hp-product-price">
                    ₹{product.price}
                    <span>/ {product.unit}</span>
                  </div>
                  <div className="hp-product-actions">
                    <button className="hp-action-cart" onClick={() => addToCart(product)}>+ Cart</button>
                    <button className="hp-action-sub" onClick={() => handleQuickSubscribe(product)}>Subscribe</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="hp-why">
        <div className="hp-section-head">
          <div className="hp-section-tag">Our Promise</div>
          <h2 className="hp-section-title">Why Choose Us?</h2>
          <p className="hp-section-sub">Everything we do is built around freshness, trust and your family's health</p>
        </div>
        <div className="hp-why-grid">
          {[
            { icon: "🌿", title: "100% Organic",      desc: "No hormones, no antibiotics. Pure natural milk from happy cows.",        color: "mint"  },
            { icon: "🚚", title: "Daily Delivery",    desc: "Fresh milk at your doorstep every morning before 7am.",                   color: "teal"  },
            { icon: "📅", title: "Flexible Plans",    desc: "Daily, weekly or monthly subscriptions. Pause anytime.",                  color: "sky"   },
            { icon: "❤️", title: "Trusted Since 2010",desc: "Over 500 families trust us for their daily dairy needs.",                 color: "coral" },
          ].map((w) => (
            <div key={w.title} className={`hp-why-card hp-why-card--${w.color}`}>
              <div className="hp-why-icon-wrap">
                <span className="hp-why-icon">{w.icon}</span>
              </div>
              <h4 className="hp-why-title">{w.title}</h4>
              <p className="hp-why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Subscription Modal ── */}
      {showSubscriptionModal && (
        <div className="hp-modal-overlay" onClick={closeModal}>
          <div className="hp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-modal-top">
              <div>
                <div className="hp-modal-eyebrow">Quick Subscribe</div>
                <h3 className="hp-modal-title">Start Subscription</h3>
              </div>
              <button className="hp-modal-close" onClick={closeModal}>✕</button>
            </div>

            {selectedProduct && (
              <div className="hp-modal-product">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <div>
                  <p className="hp-modal-product-name">{selectedProduct.name}</p>
                  <p className="hp-modal-product-price">₹{selectedProduct.price} / {selectedProduct.unit}</p>
                </div>
              </div>
            )}

            <div className="hp-modal-form">
              <div className="hp-modal-field">
                <label>Frequency</label>
                <select
                  value={subscriptionForm.subscription_type}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, subscription_type: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div className="hp-modal-row">
                <div className="hp-modal-field">
                  <label>Quantity</label>
                  <div className="hp-qty">
                    <button type="button" onClick={() => updateSubQty("dec")}>−</button>
                    <span>{subscriptionForm.quantity}</span>
                    <button type="button" onClick={() => updateSubQty("inc")}>+</button>
                  </div>
                </div>
                <div className="hp-modal-field">
                  <label>Total / delivery</label>
                  <div className="hp-modal-total">
                    ₹{selectedProduct ? selectedProduct.price * subscriptionForm.quantity : 0}
                  </div>
                </div>
              </div>

              <div className="hp-modal-field">
                <label>Start Date</label>
                <input
                  type="date"
                  value={subscriptionForm.start_date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, start_date: e.target.value })}
                />
              </div>
            </div>

            <div className="hp-modal-actions">
              <button className="hp-modal-cancel" onClick={closeModal}>Cancel</button>
              <button
                className="hp-modal-confirm"
                onClick={() => {
                  alert(`Subscription started for ${subscriptionForm.quantity}x ${selectedProduct?.name} (${subscriptionForm.subscription_type})`);
                  closeModal();
                  navigate("/subscriptions");
                }}
              >
                Start Subscription →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Cart Drawer ── */}
      {cart.length > 0 && (
        <div className="hp-cart-drawer">
          <h4>Cart ({cart.length})</h4>
          {cart.map((item) => (
            <div key={item.id} className="hp-cart-item">
              <span>{item.name} × {item.quantity}</span>
              <div className="hp-cart-item-right">
                <span>₹{item.price * item.quantity}</span>
                <button onClick={() => updateCartQty(item.id, item.quantity - 1)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="hp-cart-total">Total: ₹{getCartTotal()}</div>
        </div>
      )}
    </div>
  );
}
