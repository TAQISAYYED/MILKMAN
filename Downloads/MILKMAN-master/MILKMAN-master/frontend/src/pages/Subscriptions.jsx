import { useEffect, useState } from "react";
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getCustomers,
  getProducts,
} from "../services/api";
import "./Subscriptions.css";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers]         = useState([]);
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [editingSub, setEditingSub]       = useState(null);
  const [formData, setFormData] = useState({
    customer: "", product: "", start_date: "",
    end_date: "", status: "active", subscription_type: "daily",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [subs, custs, prods] = await Promise.all([
        getSubscriptions(), getCustomers(), getProducts(),
      ]);
      setSubscriptions(subs);
      setCustomers(custs);
      setProducts(prods);
      setError(null);
    } catch (err) {
      setError("Failed to load subscriptions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSub) await updateSubscription(editingSub.id, formData);
      else await createSubscription(formData);
      resetForm();
      loadAll();
    } catch (err) {
      setError(`Failed to ${editingSub ? "update" : "create"} subscription`);
    }
  };

  const handleEdit = (sub) => {
    setEditingSub(sub);
    setFormData({
      customer: sub.customer, product: sub.product,
      start_date: sub.start_date, end_date: sub.end_date || "",
      status: sub.status, subscription_type: sub.subscription_type || "daily",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscription?")) return;
    try {
      await deleteSubscription(id);
      loadAll();
    } catch { setError("Failed to delete subscription"); }
  };

  const resetForm = () => {
    setFormData({ customer: "", product: "", start_date: "", end_date: "", status: "active", subscription_type: "daily" });
    setShowForm(false);
    setEditingSub(null);
  };

  const getName = (arr, id, key = "name") => arr.find((i) => i.id === id)?.[key] || "—";

  const statusColor = (s) => s === "active" ? "green" : s === "paused" ? "amber" : "red";

  if (loading) return (
    <div className="sub-loading">
      <div className="sub-spinner" />
      <p>Loading subscriptions…</p>
    </div>
  );

  return (
    <div className="sub-root">
      <div className="sub-inner">

        {/* ── Header ── */}
        <div className="sub-header">
          <div>
            <p className="sub-header-tag">Manage</p>
            <h1 className="sub-header-title">Subscriptions</h1>
            <p className="sub-header-sub">Track and manage all customer subscriptions</p>
          </div>
          <button className="sub-new-btn" onClick={() => setShowForm(true)}>
            + New Subscription
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="sub-error">
            <span>⚠</span> {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="sub-stats">
          {[
            { label: "Total",    val: subscriptions.length },
            { label: "Active",   val: subscriptions.filter((s) => s.status === "active").length,   color: "green" },
            { label: "Paused",   val: subscriptions.filter((s) => s.status === "paused").length,   color: "amber" },
            { label: "Inactive", val: subscriptions.filter((s) => s.status === "inactive").length, color: "red" },
          ].map((s) => (
            <div key={s.label} className={`sub-stat ${s.color || ""}`}>
              <p className="sub-stat-val">{s.val}</p>
              <p className="sub-stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Form ── */}
        {showForm && (
          <div className="sub-form-card">
            <div className="sub-form-head">
              <h2>{editingSub ? "Edit Subscription" : "New Subscription"}</h2>
              <button className="sub-form-close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="sub-form">
              <SubField label="Customer" name="customer" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} type="select"
                options={[{ value: "", label: "Select customer" }, ...customers.map((c) => ({ value: c.id, label: c.name }))]} />

              <SubField label="Product" name="product" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} type="select"
                options={[{ value: "", label: "Select product" }, ...products.map((p) => ({ value: p.id, label: p.name }))]} />

              <SubField label="Start Date" name="start_date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} type="date" />

              <SubField label="End Date" name="end_date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} type="date" />

              <SubField label="Status" name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} type="select"
                options={[{ value: "active", label: "Active" }, { value: "paused", label: "Paused" }, { value: "inactive", label: "Inactive" }]} />

              <SubField label="Frequency" name="subscription_type" value={formData.subscription_type} onChange={(e) => setFormData({ ...formData, subscription_type: e.target.value })} type="select"
                options={[{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }]} />

              <div className="sub-form-actions">
                <button type="button" className="sub-form-cancel" onClick={resetForm}>Cancel</button>
                <button type="submit" className="sub-form-submit">
                  {editingSub ? "Update Subscription" : "Create Subscription"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Table ── */}
        <div className="sub-table-card">
          <div className="sub-table-head">
            <h2>All Subscriptions <span>{subscriptions.length}</span></h2>
          </div>

          {subscriptions.length === 0 ? (
            <div className="sub-empty">
              <span className="sub-empty-icon">📋</span>
              <p>No subscriptions yet</p>
              <span>Create your first subscription using the button above</span>
              <button className="sub-new-btn" onClick={() => setShowForm(true)}>+ New Subscription</button>
            </div>
          ) : (
            <div className="sub-table-wrap">
              <table className="sub-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Frequency</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub, i) => (
                    <tr key={sub.id} className="sub-row" style={{ animationDelay: `${i * 40}ms` }}>
                      <td className="sub-td-name">
                        {sub.customer_name || getName(customers, sub.customer)}
                      </td>
                      <td className="sub-td-product">
                        {sub.product_name || getName(products, sub.product)}
                      </td>
                      <td>{sub.start_date}</td>
                      <td>{sub.end_date || "—"}</td>
                      <td>
                        <span className={`sub-status ${statusColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <span className="sub-type">{sub.subscription_type}</span>
                      </td>
                      <td>
                        <div className="sub-actions">
                          <button className="sub-edit-btn" onClick={() => handleEdit(sub)}>Edit</button>
                          <button className="sub-del-btn" onClick={() => handleDelete(sub.id)}>Delete</button>
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

function SubField({ label, name, value, onChange, type = "text", options = [] }) {
  return (
    <div className="sub-field">
      <label className="sub-field-label">{label}</label>
      {type === "select" ? (
        <select name={name} value={value} onChange={onChange} required className="sub-input">
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} className="sub-input" />
      )}
    </div>
  );
}
