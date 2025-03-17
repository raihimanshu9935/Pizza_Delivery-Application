import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Pizza Delivery
        </Link>

        <button className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/menu"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
          </li>
          {isAuthenticated() ? (
            <>
              <li className="nav-item">
                <Link
                  to="/cart"
                  className="nav-link cart-link"
                  onClick={() => setIsOpen(false)}
                >
                  <FaShoppingCart />
                  {cart.length > 0 && (
                    <span className="cart-badge">{cart.length}</span>
                  )}
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle">
                  <FaUser /> {user?.name}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/order-tracking"
                      className="dropdown-item"
                      onClick={() => setIsOpen(false)}
                    >
                      Track Order
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link
                to="/login"
                className="nav-link login-button"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
