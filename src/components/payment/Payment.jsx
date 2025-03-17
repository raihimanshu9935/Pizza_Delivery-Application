import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { FaCreditCard, FaMoneyBill, FaArrowLeft, FaQrcode } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card"); // Default payment method
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState(""); // State for UPI ID

  useEffect(() => {
    // Check if we have the delivery address
    if (!location.state?.address) {
      toast.error("Please provide delivery address first");
      navigate("/delivery-address");
    }
  }, [location.state, navigate]);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 5; // Free delivery over $50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "upiId") {
      setUpiId(value); // Handle UPI ID input
    } else {
      setCardDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber.trim()) {
        toast.error("Please enter card number");
        return false;
      }
      if (!cardDetails.expiryDate.trim()) {
        toast.error("Please enter expiry date");
        return false;
      }
      if (!cardDetails.cvv.trim()) {
        toast.error("Please enter CVV");
        return false;
      }
    } else if (paymentMethod === "upi") {
      const upiRegex = /^[\w.-]+@[\w]+$/; // Basic UPI ID validation
      if (!upiId.trim() || !upiRegex.test(upiId.trim())) {
        toast.error("Please enter a valid UPI ID (e.g., example@upi)");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePaymentDetails()) {
      return;
    }

    // Here you would typically process the payment
    // For demo purposes, we'll just show a success message
    clearCart();
    toast.success("Order placed successfully!");
    navigate("/order-success", {
      state: {
        orderDetails: {
          orderId: `#${Math.floor(Math.random() * 1000000)}`,
          deliveryAddress: location.state?.address,
          total: calculateTotal(),
        },
      },
    });
  };

  return (
    <div className="payment-container">
      <button
        className="back-button"
        onClick={() => navigate("/delivery-address")}
      >
        <FaArrowLeft /> Back to Delivery
      </button>
      <div className="payment-content">
        <div className="payment-header">
          <h1>Payment Details</h1>
        </div>
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="payment-methods">
            {/* Credit Card Option */}
            <label
              className={`payment-method ${
                paymentMethod === "card" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaCreditCard />
              <span>Credit Card</span>
            </label>

            {/* UPI Option */}
            <label
              className={`payment-method ${
                paymentMethod === "upi" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaQrcode />
              <span>UPI</span>
            </label>

            {/* Cash on Delivery Option */}
            <label
              className={`payment-method ${
                paymentMethod === "cash" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaMoneyBill />
              <span>Cash on Delivery</span>
            </label>
          </div>

          {/* Card Details (Visible only if payment method is card) */}
          {paymentMethod === "card" && (
            <div className="card-details">
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="16"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Details (Visible only if payment method is UPI) */}
          {paymentMethod === "upi" && (
            <div className="upi-details">
              <div className="form-group">
                <label htmlFor="upiId">UPI ID</label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={upiId}
                  onChange={handleInputChange}
                  placeholder="example@upi"
                />
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              {calculateDeliveryFee() === 0 ? (
                <span className="free-delivery">FREE</span>
              ) : (
                <span>${calculateDeliveryFee().toFixed(2)}</span>
              )}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="place-order-button">
            {paymentMethod === "card"
              ? "Pay Now"
              : paymentMethod === "upi"
              ? "Pay via UPI"
              : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;