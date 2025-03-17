import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaPizzaSlice,
  FaMotorcycle,
  FaHome,
} from "react-icons/fa";
import SupportChat from "../chat/SupportChat";
import "../../styles/OrderTracking.css";

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [remainingTime, setRemainingTime] = useState(30);

  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
      return;
    }

    // Simulate order progress
    const progressTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 3) return prev + 1;
        clearInterval(progressTimer);
        return prev;
      });
    }, 10000); // Update every 10 seconds

    // Update remaining time
    const timeTimer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(timeTimer);
        return 0;
      });
    }, 60000); // Update every minute

    return () => {
      clearInterval(progressTimer);
      clearInterval(timeTimer);
    };
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return null;
  }

  const steps = [
    {
      icon: FaCheckCircle,
      title: "Order Confirmed",
      description: "Your order has been received and confirmed",
      status: currentStep >= 0 ? "completed" : "pending",
    },
    {
      icon: FaPizzaSlice,
      title: "Preparing",
      description: "Your pizza is being prepared with love",
      status:
        currentStep >= 1
          ? currentStep === 1
            ? "in-progress"
            : "completed"
          : "pending",
    },
    {
      icon: FaMotorcycle,
      title: "Out for Delivery",
      description: "Your pizza is on its way",
      status:
        currentStep >= 2
          ? currentStep === 2
            ? "in-progress"
            : "completed"
          : "pending",
    },
    {
      icon: FaHome,
      title: "Delivered",
      description: "Enjoy your meal!",
      status: currentStep >= 3 ? "completed" : "pending",
    },
  ];

  const formatAddress = (address) => {
    if (address.lat && address.lng) {
      return "Using Current Location";
    }
    return `${address.street}, ${address.city}, ${address.zipCode}`;
  };

  return (
    <div className="order-tracking-page">
      <div className="order-tracking-container">
        <div className="estimated-time">
          <h2>Estimated Delivery Time</h2>
          <div className="time">{remainingTime} minutes</div>
        </div>

        <div className="tracking-progress">
          {steps.map((step, index) => (
            <div key={index} className={`tracking-step ${step.status}`}>
              <div className="step-icon">
                <step.icon />
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>

        <div className="order-details">
          <h2>Delivery Information</h2>
          <div className="info-section">
            <div className="info-row">
              <span>Order Number:</span>
              <span>{orderDetails.orderId}</span>
            </div>
            <div className="info-row">
              <span>Delivery Address:</span>
              <span>{formatAddress(orderDetails.deliveryAddress)}</span>
            </div>
            {orderDetails.deliveryAddress.instructions && (
              <div className="info-row">
                <span>Instructions:</span>
                <span>{orderDetails.deliveryAddress.instructions}</span>
              </div>
            )}
            <div className="info-row">
              <span>Payment Method:</span>
              <span>{orderDetails.paymentMethod}</span>
            </div>
          </div>

          <h2>Order Summary</h2>
          <div className="order-items">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Size: {item.size}</p>
                  <p>Crust: {item.crust}</p>
                  {item.toppings?.length > 0 && (
                    <p>Extra Toppings: {item.toppings.join(", ")}</p>
                  )}
                </div>
                <div className="item-price">
                  <span>x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Total Amount:</span>
              <span>${orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="track-map-button" onClick={() => {}}>
            Track on Map
          </button>
          <button className="support-button" onClick={() => {}}>
            Contact Support
          </button>
        </div>
      </div>
      <SupportChat />
    </div>
  );
};

export default OrderTracking;
