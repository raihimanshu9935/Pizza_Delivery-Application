import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [activeCoupon, setActiveCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (i) =>
          i.id === item.id && i.size === item.size && i.crust === item.crust
      );

      if (existingItem) {
        return prev.map((i) =>
          i === existingItem ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const applyCoupon = (code) => {
    const coupons = {
      WELCOME10: { discount: 0.1, description: "10% off your first order" },
      FREEDEL: { discount: 0, description: "Free delivery on any order" },
      SPECIAL20: { discount: 0.2, description: "20% off on orders above $50" },
      HAPPY30: { discount: 0.3, description: "30% off on orders above $100" },
    };

    const coupon = coupons[code.toUpperCase()];
    if (coupon) {
      setActiveCoupon(coupon);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const calculateDiscount = (subtotal) => {
    if (!activeCoupon) return 0;

    if (activeCoupon.discount === 0) return 0; // For free delivery coupon

    if (activeCoupon.description.includes("above $50") && subtotal < 50)
      return 0;
    if (activeCoupon.description.includes("above $100") && subtotal < 100)
      return 0;

    return subtotal * activeCoupon.discount;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
