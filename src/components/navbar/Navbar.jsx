import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { FaShoppingCart, FaUser, FaPizzaSlice } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-container">
            <FaPizzaSlice className="logo-icon" />
            <span className="logo-text">Pizza Paradise</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link to="/menu" className="nav-link">
            Menu
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <FaShoppingCart />
            <span className="cart-count">{getCartItemCount()}</span>
            Cart
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-link">
                <FaUser /> {user.name}
              </Link>
              <button onClick={handleLogout} className="nav-link logout-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
