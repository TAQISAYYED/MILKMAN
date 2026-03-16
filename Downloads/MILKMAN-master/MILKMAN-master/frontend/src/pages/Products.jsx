import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from "../services/api";
import "./Products.css";

function Products() {
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "", packet_size: "1L", stock_quantity: "",
  });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      setError(null);
    } catch { setError("Failed to load products"); }
    finally  { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: parseFloat(formData.price), stock_quantity: parseInt(formData.stock_quantity) };
      if (editingProduct) await updateProduct(editingProduct.id, payload);
      else await createProduct(payload);
      resetForm();
      loadAll();
    } catch { setError(`Failed to ${editingProduct ? "update" : "create"} product`); }
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setFormData({ name: p.name, description: p.description || "", price: p.price, category: p.category, packet_size: p.packet_size, stock_quantity: p.stock_quantity });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await deleteProduct(id); loadAll(); }
    catch { setError("Failed to delete product"); }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "", packet_size: "1L", stock_quantity: "" });
    setShowForm(false);
    setEditingProduct(null);
  };

  const stockBadge = (qty) => {
    if (qty === 0)  return <span className="pg-stock-badge zero">Out of Stock</span>;
    if (qty < 10)   return <span className="pg-stock-badge low">{qty} left</span>;
    return              <span className="pg-stock-badge high">{qty} in stock</span>;
  };

  const getCatName = (id) => categories.find((c) => c.id === id)?.name || "—";

  if (loading) return (
    <div className="pg-loading">
      <div className="pg-spinner" />
      <p>Loading products…</p>
    </div>
  );

  return (
    <div className="pg-root">
      <div className="pg-inner">

        {/* Header */}
        <div className="pg-header">
          <div>
            <p className="pg-tag">Manage</p>
            <h1 className="pg-title">Products</h1>
            <p className="pg-sub">Manage your dairy product catalogue</p>
          </div>
          <button className="pg-add-btn" onClick={() => setShowForm(true)}>+ Add Product</button>
        </div>

        {/* Stats */}
        <div className="pg-stats">
          <div className="pg-stat">
            <p className="pg-stat-val">{products.length}</p>
            <p className="pg-stat-label">Total Products</p>
          </div>
          <div className="pg-stat sage">
            <p className="pg-stat-val">{products.filter(p => p.stock_quantity > 0).length}</p>
            <p className="pg-stat-label">In Stock</p>
          </div>
          <div className="pg-stat terra">
            <p className="pg-stat-val">{products.filter(p => p.stock_quantity === 0).length}</p>
            <p className="pg-stat-label">Out of Stock</p>
          </div>
          <div className="pg-stat amber">
            <p className="pg-stat-val">{categories.length}</p>
            <p className="pg-stat-label">Categories</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="pg-error">
            <span>⚠</span> {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="pg-form-card">
            <div className="pg-form-head">
              <h2>{editingProduct ? "Edit Product" : "New Product"}</h2>
              <button className="pg-form-close" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="pg-form">

              <div className="pg-field">
                <label className="pg-field-label">Product Name</label>
                <input type="text" value={formData.name} required className="pg-input"
                  placeholder="e.g. Fresh Toned Milk"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div className="pg-field">
                <label className="pg-field-label">Price (₹)</label>
                <input type="number" value={formData.price} required className="pg-input"
                  placeholder="0.00" step="0.01" min="0"
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>

              <div className="pg-field pg-field-full">
                <label className="pg-field-label">Description</label>
                <textarea value={formData.description} className="pg-textarea"
                  placeholder="Short product description…"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="pg-field">
                <label className="pg-field-label">Category</label>
                <select value={formData.category} required className="pg-input"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="pg-field">
                <label className="pg-field-label">Packet Size</label>
                <select value={formData.packet_size} required className="pg-input"
                  onChange={(e) => setFormData({ ...formData, packet_size: e.target.value })}>
                  <option value="500ml">Half Litre (500ml)</option>
                  <option value="1L">One Litre (1L)</option>
                  <option value="2L">Two Litre (2L)</option>
                </select>
              </div>

              <div className="pg-field">
                <label className="pg-field-label">Stock Quantity</label>
                <input type="number" value={formData.stock_quantity} required className="pg-input"
                  placeholder="0" min="0"
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} />
              </div>

              <div className="pg-form-actions">
                <button type="button" className="pg-cancel-btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="pg-submit-btn">
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="pg-table-card">
          <div className="pg-table-head">
            <h2>Product Catalogue <span>{products.length}</span></h2>
          </div>

          {products.length === 0 ? (
            <div className="pg-empty">
              <span className="pg-empty-icon">🧀</span>
              <p>No products yet</p>
              <span>Add your first product using the button above</span>
              <button className="pg-add-btn" onClick={() => setShowForm(true)}>+ Add Product</button>
            </div>
          ) : (
            <div className="pg-table-wrap">
              <table className="pg-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} className="pg-row" style={{ animationDelay: `${i * 40}ms` }}>
                      <td>
                        <p className="pg-td-name">{p.name}</p>
                        {p.description && <p className="pg-td-dim">{p.description.slice(0, 50)}{p.description.length > 50 ? "…" : ""}</p>}
                      </td>
                      <td className="pg-td-dim">{p.category_name || getCatName(p.category)}</td>
                      <td className="pg-td-dim">{p.packet_size}</td>
                      <td><span className="pg-price">₹{p.price}</span></td>
                      <td>{stockBadge(p.stock_quantity)}</td>
                      <td>
                        <div className="pg-td-actions">
                          <button className="pg-edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                          <button className="pg-del-btn"  onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Products;
