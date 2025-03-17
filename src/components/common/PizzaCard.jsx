import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/PizzaCard.css";

const PizzaCard = ({ pizza, showCustomization = false }) => {
  const { addToCart } = useCart();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    size: pizza.customization.sizes[0],
    crust: pizza.customization.crusts[0],
    toppings: [],
  });

  const calculateTotal = () => {
    const basePrice = pizza.price;
    const sizePrice = selectedOptions.size.price;
    const crustPrice = selectedOptions.crust.price;
    const toppingsPrice = selectedOptions.toppings.reduce(
      (total, topping) => total + topping.price,
      0
    );
    return (basePrice + sizePrice + crustPrice + toppingsPrice).toFixed(2);
  };

  const handleAddToCart = () => {
    if (showCustomization && !isCustomizing) {
      setIsCustomizing(true);
      return;
    }

    const cartItem = {
      id: pizza.id,
      name: pizza.name,
      price: parseFloat(calculateTotal()),
      image: pizza.image,
      size: selectedOptions.size.name,
      crust: selectedOptions.crust.name,
      toppings: selectedOptions.toppings.map((t) => t.name),
    };

    addToCart(cartItem);
    setIsCustomizing(false);
  };

  const toggleTopping = (topping) => {
    setSelectedOptions((prev) => {
      const exists = prev.toppings.find((t) => t.name === topping.name);
      if (exists) {
        return {
          ...prev,
          toppings: prev.toppings.filter((t) => t.name !== topping.name),
        };
      }
      return {
        ...prev,
        toppings: [...prev.toppings, topping],
      };
    });
  };

  return (
    <div className="pizza-card">
      <div className="pizza-image">
        <img src={pizza.image} alt={pizza.name} />
        {pizza.isVeg ? (
          <span className="veg-badge">🥬 Veg</span>
        ) : (
          <span className="non-veg-badge">🍖 Non-Veg</span>
        )}
        {pizza.isBestseller && (
          <span className="bestseller-badge">👑 Bestseller</span>
        )}
      </div>

      <div className="pizza-info">
        <h3>{pizza.name}</h3>
        <p className="description">{pizza.description}</p>
        <div className="rating">
          <span className="stars">{"⭐".repeat(Math.floor(pizza.rating))}</span>
          <span className="rating-text">({pizza.reviews} reviews)</span>
        </div>
        <div className="price">Starting from ${pizza.price}</div>
      </div>

      {showCustomization && isCustomizing ? (
        <div className="customization-panel">
          <h4>Customize Your Pizza</h4>

          <div className="option-section">
            <h5>Size</h5>
            <div className="options">
              {pizza.customization.sizes.map((size) => (
                <button
                  key={size.name}
                  className={`option-btn ${
                    selectedOptions.size.name === size.name ? "selected" : ""
                  }`}
                  onClick={() =>
                    setSelectedOptions((prev) => ({ ...prev, size }))
                  }
                >
                  {size.name} {size.price > 0 && `(+$${size.price})`}
                </button>
              ))}
            </div>
          </div>

          <div className="option-section">
            <h5>Crust</h5>
            <div className="options">
              {pizza.customization.crusts.map((crust) => (
                <button
                  key={crust.name}
                  className={`option-btn ${
                    selectedOptions.crust.name === crust.name ? "selected" : ""
                  }`}
                  onClick={() =>
                    setSelectedOptions((prev) => ({ ...prev, crust }))
                  }
                >
                  {crust.name} {crust.price > 0 && `(+$${crust.price})`}
                </button>
              ))}
            </div>
          </div>

          <div className="option-section">
            <h5>Extra Toppings</h5>
            <div className="options">
              {pizza.customization.toppings.map((topping) => (
                <button
                  key={topping.name}
                  className={`option-btn ${
                    selectedOptions.toppings.find(
                      (t) => t.name === topping.name
                    )
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => toggleTopping(topping)}
                >
                  {topping.name} (+${topping.price})
                </button>
              ))}
            </div>
          </div>

          <div className="total-section">
            <span>Total: ${calculateTotal()}</span>
          </div>
        </div>
      ) : null}

      <button className="add-to-cart" onClick={handleAddToCart}>
        {showCustomization && !isCustomizing
          ? "Customize & Add"
          : "Add to Cart"}
      </button>
    </div>
  );
};

export default PizzaCard;
