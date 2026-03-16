import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";
import "./Cart.css";

// Dummy products fallback if API is empty
const DUMMY_PRODUCTS = [
  { id:1, name:"Full Cream Milk",    price:28,  unit:"500ml", category:"Milk",   emoji:"🥛", badge:"Best Seller", desc:"Rich & creamy whole milk from grass-fed cows" },
  { id:2, name:"Toned Milk",         price:22,  unit:"500ml", category:"Milk",   emoji:"🍼", badge:"Popular",     desc:"Light & nutritious low-fat daily milk" },
  { id:3, name:"Buffalo Milk",       price:35,  unit:"500ml", category:"Milk",   emoji:"🐃", badge:"Premium",     desc:"High-fat buffalo milk, perfect for chai" },
  { id:4, name:"Paneer",             price:85,  unit:"200g",  category:"Dairy",  emoji:"🧀", badge:"Fresh",       desc:"Soft homemade-style paneer, made daily" },
  { id:5, name:"Dahi (Curd)",        price:40,  unit:"400g",  category:"Dairy",  emoji:"🥣", badge:"Probiotic",   desc:"Thick set curd with live cultures" },
  { id:6, name:"Ghee",               price:320, unit:"500ml", category:"Dairy",  emoji:"✨", badge:"Pure A2",     desc:"Traditional bilona method pure ghee" },
  { id:7, name:"Buttermilk",         price:18,  unit:"200ml", category:"Drinks", emoji:"🥤", badge:"Refreshing",  desc:"Spiced chaas, perfect for summer" },
  { id:8, name:"Flavoured Milk",     price:30,  unit:"200ml", category:"Drinks", emoji:"🍫", badge:"Kids Fav",    desc:"Chocolate & strawberry variants" },
];

export default function Cart() {
  const navigate  = useNavigate();
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [cart, setCart]         = useState({}); // { productId: qty }
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]     = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderDone, setOrderDone]       = useState(false);

  // Try to load real products from API
  useEffect(() => {
    getProducts().then(data => {
      if (data && data.length > 0) setProducts(data);
    }).catch(() => {});
    // Load saved cart
    const saved = localStorage.getItem("milkman_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart on change
  useEffect(() => {
    localStorage.setItem("milkman_cart", JSON.stringify(cart));
  }, [cart]);

  const user = JSON.parse(localStorage.getItem("milkman_user") || "null");

  const addToCart    = (id) => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(p => {
    const next = { ...p };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });
  const deleteFromCart = (id) => setCart(p => { const n={...p}; delete n[id]; return n; });

  // Derived
  const categories = ["All", ...new Set(products.map(p => p.category || "Other"))];
  const filtered   = products.filter(p => {
    const inCat  = activeCategory === "All" || p.category === activeCategory;
    const inSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return inCat && inSearch;
  });

  const cartItems  = products.filter(p => cart[p.id]);
  const cartCount  = Object.values(cart).reduce((a,b) => a+b, 0);
  const cartTotal  = cartItems.reduce((sum,p) => sum + (p.price * cart[p.id]), 0);

  const placeOrder = () => {
    setCheckoutOpen(false);
    setOrderDone(true);
    setCart({});
    localStorage.removeItem("milkman_cart");
    setTimeout(() => setOrderDone(false), 4000);
  };

  return (
    <div className="cart-root">
      {/* ── Header ── */}
      <div className="cart-header">
        <Link to="/" className="cart-logo">
          <span>🥛</span> Milkman
        </Link>
        <div className="cart-search-wrap">
          <span>🔍</span>
          <input
            className="cart-search"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="cart-header-right">
          <span className="cart-user">👋 {user?.name || "Guest"}</span>
          <button className="cart-icon-btn" onClick={() => setCheckoutOpen(true)}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* ── Success toast ── */}
      {orderDone && (
        <div className="cart-toast">
          ✅ Order placed successfully! Delivery before 7 AM tomorrow.
        </div>
      )}

      {/* ── Category filter ── */}
      <div className="cart-cats">
        {categories.map(c => (
          <button
            key={c}
            className={`cart-cat ${activeCategory===c?"active":""}`}
            onClick={() => setActiveCategory(c)}
          >{c}</button>
        ))}
      </div>

      {/* ── Page title ── */}
      <div className="cart-page-head">
        <h1 className="cart-page-title">
          {activeCategory === "All" ? "All Products" : activeCategory}
        </h1>
        <p className="cart-page-sub">{filtered.length} items available · Farm fresh daily</p>
      </div>

      {/* ── Product Grid ── */}
      <div className="cart-grid">
        {filtered.map(product => {
          const qty = cart[product.id] || 0;
          return (
            <div key={product.id} className={`cart-card ${qty>0?"in-cart":""}`}>
              {/* Badge */}
              {product.badge && <div className="cart-card-badge">{product.badge}</div>}

              {/* Image area */}
              <div className="cart-card-img">
                <span className="cart-card-emoji">{product.emoji || "🥛"}</span>
                <div className="cart-card-img-bg" />
              </div>

              {/* Info */}
              <div className="cart-card-body">
                <div className="cart-card-cat">{product.category || "Dairy"}</div>
                <h3 className="cart-card-name">{product.name}</h3>
                <p className="cart-card-desc">{product.desc || product.description || ""}</p>
                <div className="cart-card-meta">
                  <span className="cart-card-unit">per {product.unit || "unit"}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="cart-card-footer">
                <span className="cart-card-price">₹{product.price}</span>
                {qty === 0 ? (
                  <button className="cart-add-btn" onClick={() => addToCart(product.id)}>
                    + Add
                  </button>
                ) : (
                  <div className="cart-qty-ctrl">
                    <button onClick={() => removeFromCart(product.id)}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => addToCart(product.id)}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Sticky Cart Bar ── */}
      {cartCount > 0 && (
        <div className="cart-sticky-bar">
          <div className="cart-sticky-info">
            <span className="cart-sticky-count">{cartCount} item{cartCount>1?"s":""}</span>
            <span className="cart-sticky-total">₹{cartTotal}</span>
          </div>
          <button className="cart-sticky-btn" onClick={() => setCheckoutOpen(true)}>
            View Cart & Checkout →
          </button>
        </div>
      )}

      {/* ── Cart Drawer ── */}
      {checkoutOpen && (
        <div className="cart-overlay" onClick={() => setCheckoutOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-drawer-head">
              <h2>🛒 Your Cart</h2>
              <button onClick={() => setCheckoutOpen(false)}>✕</button>
            </div>

            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <span>🛒</span>
                <p>Your cart is empty</p>
                <button onClick={() => setCheckoutOpen(false)}>Browse Products</button>
              </div>
            ) : (
              <>
                <div className="cart-drawer-items">
                  {cartItems.map(p => (
                    <div key={p.id} className="cart-drawer-item">
                      <span className="cart-drawer-emoji">{p.emoji || "🥛"}</span>
                      <div className="cart-drawer-info">
                        <div className="cart-drawer-name">{p.name}</div>
                        <div className="cart-drawer-price">₹{p.price} × {cart[p.id]}</div>
                      </div>
                      <div className="cart-drawer-qty">
                        <button onClick={() => removeFromCart(p.id)}>−</button>
                        <span>{cart[p.id]}</span>
                        <button onClick={() => addToCart(p.id)}>+</button>
                      </div>
                      <button className="cart-drawer-del" onClick={() => deleteFromCart(p.id)}>🗑️</button>
                    </div>
                  ))}
                </div>

                <div className="cart-drawer-footer">
                  <div className="cart-drawer-summary">
                    <div className="cart-drawer-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                    <div className="cart-drawer-row"><span>Delivery</span><span className="free">FREE</span></div>
                    <div className="cart-drawer-row total"><span>Total</span><span>₹{cartTotal}</span></div>
                  </div>
                  {user ? (
                    <button className="cart-place-btn" onClick={placeOrder}>
                      Place Order · ₹{cartTotal}
                    </button>
                  ) : (
                    <button className="cart-place-btn" onClick={() => navigate("/login")}>
                      Login to Place Order →
                    </button>
                  )}
                  <p className="cart-delivery-note">🚚 Delivery before 7 AM tomorrow</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
