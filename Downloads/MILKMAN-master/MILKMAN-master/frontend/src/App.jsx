import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar         from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Homepage      from "./components/Homepage";
import CustomerLogin from "./pages/Customerlogin";
import AdminLogin    from "./pages/Adminlogin";
import Cart          from "./pages/Cart";
import Customers     from "./pages/Customers";
import Categories    from "./pages/Categories";
import Subscriptions from "./pages/Subscriptions";
import Users         from "./pages/Users";
import Products      from "./pages/Products";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* ── Public ── */}
        <Route path="/"            element={<Homepage />} />
        <Route path="/login"       element={<CustomerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ── Customer protected ── */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />

        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
        } />

        {/* ── Admin only ── */}
        <Route path="/users" element={
          <ProtectedRoute adminOnly>
            <Users />
          </ProtectedRoute>
        } />

        <Route path="/customers" element={
          <ProtectedRoute adminOnly>
            <Customers />
          </ProtectedRoute>
        } />

        <Route path="/categories" element={
          <ProtectedRoute adminOnly>
            <Categories />
          </ProtectedRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute adminOnly>
            <Products />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}
