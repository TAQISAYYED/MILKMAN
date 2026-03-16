import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";
import "./Users.css";

export default function Users() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "", email: "", phone_number: "", password: "",
  });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch { setError("Failed to load users"); }
    finally  { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) await updateUser(editingUser.id, formData);
      else await createUser(formData);
      resetForm();
      loadUsers();
    } catch { setError(`Failed to ${editingUser ? "update" : "create"} user`); }
  };

  const handleEdit = (u) => {
    setEditingUser(u);
    setFormData({ username: u.username, email: u.email, phone_number: u.phone_number || "", password: "" });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await deleteUser(id); loadUsers(); }
    catch { setError("Failed to delete user"); }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ username: "", email: "", phone_number: "", password: "" });
  };

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  if (loading) return (
    <div className="pg-loading">
      <div className="pg-spinner" />
      <p>Loading users…</p>
    </div>
  );

  return (
    <div className="pg-root">
      <div className="pg-inner">

        {/* Header */}
        <div className="pg-header">
          <div>
            <p className="pg-tag">Manage</p>
            <h1 className="pg-title">Users</h1>
            <p className="pg-sub">Manage all registered users of the platform</p>
          </div>
          <button className="pg-add-btn" onClick={() => setShowForm(true)}>+ Add User</button>
        </div>

        {/* Stats */}
        <div className="pg-stats">
          <div className="pg-stat">
            <p className="pg-stat-val">{users.length}</p>
            <p className="pg-stat-label">Total Users</p>
          </div>
          <div className="pg-stat sage">
            <p className="pg-stat-val">{users.filter(u => u.phone_number).length}</p>
            <p className="pg-stat-label">With Phone</p>
          </div>
          <div className="pg-stat terra">
            <p className="pg-stat-val">{users.filter(u => u.email).length}</p>
            <p className="pg-stat-label">With Email</p>
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
              <h2>{editingUser ? "Edit User" : "New User"}</h2>
              <button className="pg-form-close" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="pg-form">
              <div className="pg-field">
                <label className="pg-field-label">Username</label>
                <input type="text" value={formData.username} required className="pg-input"
                  placeholder="Enter username…" onChange={set("username")} />
              </div>
              <div className="pg-field">
                <label className="pg-field-label">Email Address</label>
                <input type="email" value={formData.email} required className="pg-input"
                  placeholder="Enter email…" onChange={set("email")} />
              </div>
              <div className="pg-field">
                <label className="pg-field-label">Phone Number</label>
                <input type="tel" value={formData.phone_number} className="pg-input"
                  placeholder="Enter phone…" onChange={set("phone_number")} />
              </div>
              <div className="pg-field">
                <label className="pg-field-label">Password</label>
                <input type="password" value={formData.password}
                  required={!editingUser} className="pg-input"
                  placeholder={editingUser ? "Leave blank to keep current" : "Enter password…"}
                  onChange={set("password")} />
              </div>
              <div className="pg-form-actions">
                <button type="button" className="pg-cancel-btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="pg-submit-btn">
                  {editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="pg-table-card">
          <div className="pg-table-head">
            <h2>All Users <span>{users.length}</span></h2>
          </div>

          {users.length === 0 ? (
            <div className="pg-empty">
              <span className="pg-empty-icon">👤</span>
              <p>No users yet</p>
              <span>Create your first user using the button above</span>
              <button className="pg-add-btn" onClick={() => setShowForm(true)}>+ Add User</button>
            </div>
          ) : (
            <div className="pg-table-wrap">
              <table className="pg-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className="pg-row" style={{ animationDelay: `${i * 40}ms` }}>
                      <td>
                        <div className="usr-cell">
                          <div className="usr-avatar">{u.username.charAt(0).toUpperCase()}</div>
                          <span className="pg-td-name">{u.username}</span>
                        </div>
                      </td>
                      <td className="pg-td-dim">{u.email}</td>
                      <td className="pg-td-dim">{u.phone_number || "—"}</td>
                      <td>
                        <div className="pg-td-actions">
                          <button className="pg-edit-btn" onClick={() => handleEdit(u)}>Edit</button>
                          <button className="pg-del-btn"  onClick={() => handleDelete(u.id)}>Delete</button>
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
