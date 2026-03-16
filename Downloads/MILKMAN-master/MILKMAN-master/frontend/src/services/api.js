// ============================================================
// frontend/src/services/api.js
// All API calls — JWT token auto-attached to every request
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

// ─────────────────────────────────────────
// Token Helpers
// ─────────────────────────────────────────
const getAccessToken  = () => localStorage.getItem("access_token")
const getRefreshToken = () => localStorage.getItem("refresh_token")

const saveAccessToken = (token) => localStorage.setItem("access_token", token)

const clearAuth = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("milkman_user")
  localStorage.removeItem("milkman_admin")
}

// ─────────────────────────────────────────
// Silent Token Refresh
// Called automatically when a 401 is received
// ─────────────────────────────────────────
const refreshAccessToken = async () => {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error("No refresh token — please login again")

  const res = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  })

  if (!res.ok) {
    clearAuth()
    window.location.href = "/login"   // Force re-login
    throw new Error("Session expired. Please login again.")
  }

  const data = await res.json()
  saveAccessToken(data.access)
  return data.access
}

// ─────────────────────────────────────────
// Core API Request Handler
// Automatically:
//   1. Attaches JWT Bearer token
//   2. Retries once with refreshed token on 401
//   3. Redirects to /login if refresh fails
// ─────────────────────────────────────────
const apiRequest = async (endpoint, options = {}, retry = true) => {
  const token = getAccessToken()

  // Build headers — attach token if available
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      mode: "cors",
    })

    // ── 401 Unauthorized: try to refresh token once ──
    if (response.status === 401 && retry) {
      try {
        const newToken = await refreshAccessToken()
        // Retry original request with new token
        return await apiRequest(endpoint, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
        }, false)  // false = don't retry again
      } catch {
        clearAuth()
        window.location.href = "/login"
        return
      }
    }

    // ── 204 No Content (DELETE responses) ──
    if (response.status === 204) return null

    // ── Other errors ──
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }))
      const message   = errorData.detail || errorData.error || errorData.message
        || Object.values(errorData).flat().join(", ")
        || `HTTP ${response.status}`
      throw new Error(message)
    }

    return await response.json()

  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message)
    throw error
  }
}

// ─────────────────────────────────────────
// Auth API  (no token needed for these)
// ─────────────────────────────────────────
export const authAPI = {
  sendOTP: (phone, name = "", email = "") =>
    apiRequest("/api/auth/send-otp/", {
      method: "POST",
      body: JSON.stringify({ phone, name, email }),
    }),

  verifyOTP: async (phone, otp) => {
    const data = await apiRequest("/api/auth/verify-otp/", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    })
    // Save tokens on success
    if (data?.tokens) {
      saveAccessToken(data.tokens.access)
      localStorage.setItem("refresh_token", data.tokens.refresh)
      localStorage.setItem("milkman_user",  JSON.stringify(data.user))
    }
    return data
  },

  adminLogin: async (email, password, secret_key) => {
    const data = await apiRequest("/api/auth/admin-login/", {
      method: "POST",
      body: JSON.stringify({ email, password, secret_key }),
    })
    // Save tokens on success
    if (data?.tokens) {
      saveAccessToken(data.tokens.access)
      localStorage.setItem("refresh_token",  data.tokens.refresh)
      localStorage.setItem("milkman_admin",  JSON.stringify(data.user))
    }
    return data
  },

  me: () => apiRequest("/api/auth/me/"),

  logout: async () => {
    const refresh = getRefreshToken()
    try {
      await apiRequest("/api/auth/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh }),
      })
    } finally {
      clearAuth()
      window.location.href = "/login"
    }
  },
}

// ─────────────────────────────────────────
// Auth State Helpers
// ─────────────────────────────────────────
export const isLoggedIn = () => !!getAccessToken()

export const isAdmin = () => {
  const admin = JSON.parse(localStorage.getItem("milkman_admin") || "null")
  return !!(admin?.is_admin)
}

export const currentUser = () =>
  JSON.parse(
    localStorage.getItem("milkman_user") ||
    localStorage.getItem("milkman_admin") ||
    "null"
  )

// ─────────────────────────────────────────
// Users API
// ─────────────────────────────────────────
export const getUsers = ()           => apiRequest("/users/")
export const createUser = (data)     => apiRequest("/users/",     { method: "POST",   body: JSON.stringify(data) })
export const updateUser = (id, data) => apiRequest(`/users/${id}/`, { method: "PUT",  body: JSON.stringify(data) })
export const deleteUser = (id)       => apiRequest(`/users/${id}/`, { method: "DELETE" })

// ─────────────────────────────────────────
// Categories API
// ─────────────────────────────────────────
export const getCategories    = ()           => apiRequest("/categories/")
export const createCategory   = (data)       => apiRequest("/categories/",     { method: "POST",   body: JSON.stringify(data) })
export const updateCategory   = (id, data)   => apiRequest(`/categories/${id}/`, { method: "PUT",  body: JSON.stringify(data) })
export const deleteCategory   = (id)         => apiRequest(`/categories/${id}/`, { method: "DELETE" })

// ─────────────────────────────────────────
// Products API
// ─────────────────────────────────────────
export const getProducts    = ()           => apiRequest("/products/")
export const createProduct  = (data)       => apiRequest("/products/",     { method: "POST",   body: JSON.stringify(data) })
export const updateProduct  = (id, data)   => apiRequest(`/products/${id}/`, { method: "PUT",  body: JSON.stringify(data) })
export const deleteProduct  = (id)         => apiRequest(`/products/${id}/`, { method: "DELETE" })

// ─────────────────────────────────────────
// Customers API
// ─────────────────────────────────────────
export const getCustomers    = ()           => apiRequest("/customers/")
export const createCustomer  = (data)       => apiRequest("/customers/",     { method: "POST",   body: JSON.stringify(data) })
export const updateCustomer  = (id, data)   => apiRequest(`/customers/${id}/`, { method: "PUT",  body: JSON.stringify(data) })
export const deleteCustomer  = (id)         => apiRequest(`/customers/${id}/`, { method: "DELETE" })

// ─────────────────────────────────────────
// Subscriptions API
// ─────────────────────────────────────────
export const getSubscriptions    = ()           => apiRequest("/subscriptions/")
export const createSubscription  = (data)       => apiRequest("/subscriptions/",     { method: "POST",   body: JSON.stringify(data) })
export const updateSubscription  = (id, data)   => apiRequest(`/subscriptions/${id}/`, { method: "PUT",  body: JSON.stringify(data) })
export const deleteSubscription  = (id)         => apiRequest(`/subscriptions/${id}/`, { method: "DELETE" })