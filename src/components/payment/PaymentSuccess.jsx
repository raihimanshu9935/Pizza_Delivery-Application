import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaMotorcycle,
  FaBox,
  FaHouseUser,
} from "react-icons/fa";
import "../../styles/PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails || {};

  const orderSteps = [
    { icon: FaCheckCircle, text: "Order Confirmed", status: "completed" },
    { icon: FaBox, text: "Preparing Your Pizza", status: "in-progress" },
    { icon: FaMotorcycle, text: "Out for Delivery", status: "pending" },
    { icon: FaHouseUser, text: "Delivered", status: "pending" },
  ];

  return (
    <div className="payment-success">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your order. Your delicious pizza is being prepared.</p>

        <div className="order-details">
          <h2>Order Details</h2>
          <div className="detail-row">
            <span>Order ID:</span>
            <span>{orderDetails.orderId || "#123456"}</span>
          </div>
          <div className="detail-row">
            <span>Delivery To:</span>
            <span>{orderDetails.deliveryAddress?.street || "123 Main St"}</span>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <span>${orderDetails.total?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="detail-row">
            <span>Estimated Delivery:</span>
            <span>30-45 minutes</span>
          </div>
        </div>

        <div className="order-tracking">
          <h2>Track Your Order</h2>
          <div className="tracking-steps">
            {orderSteps.map((step, index) => (
              <div key={index} className={`tracking-step ${step.status}`}>
                <div className="step-icon">
                  <step.icon />
                </div>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button className="track-order" onClick={() => navigate("/orders")}>
            View All Orders
          </button>
          <button
            className="continue-shopping"
            onClick={() => navigate("/menu")}
          >
            Order More
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;


