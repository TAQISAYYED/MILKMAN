import { useEffect, useState } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../services/api";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) await updateCustomer(editingCustomer.id, formData);
      else await createCustomer(formData);
      resetForm();
      loadCustomers();
    } catch {
      setError(`Failed to ${editingCustomer ? "update" : "create"} customer`);
    }
  };

  const handleEdit = (c) => {
    setEditingCustomer(c);
    setFormData({ name: c.name, email: c.email, phone: c.phone || "", address: c.address || "" });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try { await deleteCustomer(id); loadCustomers(); }
    catch { setError("Failed to delete customer"); }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", address: "" });
    setShowForm(false);
    setEditingCustomer(null);
  };

  if (loading) return (
    <div className="pg-loading">
      <div className="pg-spinner" />
      <p>Loading customers…</p>
    </div>
  );

  return (
    <div className="pg-root">
      <div className="pg-inner">

        {/* Header */}
        <div className="pg-header">
          <div>
            <p className="pg-tag">Manage</p>
            <h1 className="pg-title">Customers</h1>
            <p className="pg-sub">View and manage all your dairy customers</p>
          </div>
          <button className="pg-add-btn" onClick={() => setShowForm(true)}>+ Add Customer</button>
        </div>

        {/* Stats */}
        <div className="pg-stats">
          <div className="pg-stat">
            <p className="pg-stat-val">{customers.length}</p>
            <p className="pg-stat-label">Total Customers</p>
          </div>
          <div className="pg-stat sage">
            <p className="pg-stat-val">{customers.filter(c => c.phone).length}</p>
            <p className="pg-stat-label">With Phone</p>
          </div>
          <div className="pg-stat terra">
            <p className="pg-stat-val">{customers.filter(c => c.address).length}</p>
            <p className="pg-stat-label">With Address</p>
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
              <h2>{editingCustomer ? "Edit Customer" : "New Customer"}</h2>
              <button className="pg-form-close" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="pg-form">
              <PgField label="Full Name"     name="name"    value={formData.name}    onChange={(e) => setFormData({...formData, name: e.target.value})}    type="text"  required />
              <PgField label="Email Address" name="email"   value={formData.email}   onChange={(e) => setFormData({...formData, email: e.target.value})}   type="email" required />
              <PgField label="Phone Number"  name="phone"   value={formData.phone}   onChange={(e) => setFormData({...formData, phone: e.target.value})}   type="tel" />
              <PgField label="Address"       name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} type="text" />
              <div className="pg-form-actions">
                <button type="button" className="pg-cancel-btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="pg-submit-btn">
                  {editingCustomer ? "Update Customer" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grid */}
        <div className="pg-table-card">
          <div className="pg-table-head">
            <h2>Customer Directory <span>{customers.length}</span></h2>
          </div>

          {customers.length === 0 ? (
            <div className="pg-empty">
              <span className="pg-empty-icon">👥</span>
              <p>No customers yet</p>
              <span>Add your first customer using the button above</span>
              <button className="pg-add-btn" onClick={() => setShowForm(true)}>+ Add Customer</button>
            </div>
          ) : (
            <div className="cust-grid">
              {customers.map((c, i) => (
                <div key={c.id} className="cust-card" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="cust-avatar">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="cust-info">
                    <h3 className="cust-name">{c.name}</h3>
                    <p className="cust-email">✉ {c.email}</p>
                    {c.phone   && <p className="cust-meta">📞 {c.phone}</p>}
                    {c.address && <p className="cust-meta">📍 {c.address}</p>}
                  </div>
                  <div className="cust-actions">
                    <button className="pg-edit-btn"   onClick={() => handleEdit(c)}>Edit</button>
                    <button className="pg-del-btn"    onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function PgField({ label, name, value, onChange, type = "text", required }) {
  return (
    <div className="pg-field">
      <label className="pg-field-label">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} className="pg-input" />
    </div>
  );
}

export default Customers;
