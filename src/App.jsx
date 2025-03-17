import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Menu from "./components/menu/Menu";
import PizzaDetails from "./components/menu/PizzaDetails";
import Cart from "./components/cart/Cart";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/profile/Profile";
import DeliveryAddress from "./components/delivery/DeliveryAddress";
import Payment from "./components/payment/Payment";
import OrderSuccess from "./components/order/OrderSuccess";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SupportChat from "./components/chat/SupportChat";
import "./App.css";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if current route is login or register
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="app">
      {!isAuthPage && <Navbar />}
      <main className={`main-content ${isAuthPage ? "auth-page" : ""}`}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu/:id"
            element={
              <ProtectedRoute>
                <PizzaDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery-address"
            element={
              <ProtectedRoute>
                <DeliveryAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <SupportChat />}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
