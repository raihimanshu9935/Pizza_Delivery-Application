import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p>
          Thank you for your order. We'll start preparing your delicious pizzas
          right away!
        </p>
        <div className="estimated-time">
          <h2>Estimated Delivery Time</h2>
          <p>30-45 minutes</p>
        </div>
        <div className="order-actions">
          <Link to="/menu" className="action-button">
            Order More
          </Link>
          <Link to="/profile" className="action-button secondary">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
