import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Cart.css";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    calculateDiscount,
  } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [lastViewedPizza, setLastViewedPizza] = useState(() => {
    const saved = localStorage.getItem("lastViewedPizza");
    return saved ? JSON.parse(saved) : null;
  });

  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    return (subtotal - discount) * 0.1; // 10% tax on discounted amount
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    if (activeCoupon?.description === "Free delivery on any order") {
      return 0;
    }
    return subtotal >= 50 ? 0 : 5; // Free delivery over $50
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const tax = calculateTax();
    const deliveryFee = calculateDeliveryFee();
    return subtotal - discount + tax + deliveryFee;
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    const success = applyCoupon(couponCode);
    if (success) {
      toast.success(`Coupon applied: ${activeCoupon.description}`);
      setCouponCode("");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    navigate("/delivery-address");
  };

  const handleCouponCardClick = (code) => {
    setCouponCode(code);
    handleApplyCoupon();
  };

  const handleBackClick = () => {
    if (lastViewedPizza) {
      navigate("/menu", { state: { selectedPizzaId: lastViewedPizza.id } });
    } else {
      navigate("/menu");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-container">
        <button className="back-to-menu" onClick={handleBackClick}>
          <FaArrowLeft /> Back to Previous Page
        </button>
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Add some delicious pizzas to get started!</p>
          <Link to="/menu" className="continue-shopping">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <button className="back-to-menu" onClick={handleBackClick}>
        <FaArrowLeft /> Back to Previous Page
      </button>
      <h1>Your Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <div className="item-customization">
                  <p>Size: {item.size}</p>
                  <p>Crust: {item.crust}</p>
                  {item.toppings && item.toppings.length > 0 && (
                    <p>Extra Toppings: {item.toppings.join(", ")}</p>
                  )}
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <span className="item-price">
                    ${calculateItemTotal(item).toFixed(2)}
                  </span>
                  <button
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="coupon-section">
            <h3>Available Coupons</h3>
            <div className="available-coupons">
              <div
                className="coupon-card"
                onClick={() => handleCouponCardClick("WELCOME10")}
              >
                <span className="coupon-code">WELCOME10</span>
                <span className="coupon-desc">10% off your first order</span>
              </div>
              <div
                className="coupon-card"
                onClick={() => handleCouponCardClick("FREEDEL")}
              >
                <span className="coupon-code">FREEDEL</span>
                <span className="coupon-desc">Free delivery on any order</span>
              </div>
              <div
                className="coupon-card"
                onClick={() => handleCouponCardClick("SPECIAL20")}
              >
                <span className="coupon-code">SPECIAL20</span>
                <span className="coupon-desc">20% off on orders above $50</span>
              </div>
              <div
                className="coupon-card"
                onClick={() => handleCouponCardClick("HAPPY30")}
              >
                <span className="coupon-code">HAPPY30</span>
                <span className="coupon-desc">
                  30% off on orders above $100
                </span>
              </div>
            </div>
            {activeCoupon ? (
              <div className="active-coupon">
                <span>
                  <FaTag /> {activeCoupon.description}
                </span>
                <button onClick={removeCoupon} className="remove-coupon">
                  Remove
                </button>
              </div>
            ) : (
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <button onClick={handleApplyCoupon}>Apply</button>
              </div>
            )}
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          {activeCoupon && (
            <div className="summary-row discount">
              <span>Discount</span>
              <span>-${calculateDiscount(calculateSubtotal()).toFixed(2)}</span>
            </div>
          )}
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
          {calculateDeliveryFee() > 0 &&
            !activeCoupon?.description.includes("Free delivery") && (
              <p className="free-delivery-note">
                Add ${(50 - calculateSubtotal()).toFixed(2)} more for free
                delivery!
              </p>
            )}
          <div className="summary-total">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <button className="checkout-button" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <Link to="/menu" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
