import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import "./PizzaDetails.css";

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedCrust, setSelectedCrust] = useState("regular");
  const [notification, setNotification] = useState(null);

  // This should match the data structure in Menu.jsx
  const pizzaMenu = [
    {
      id: 1,
      name: "Margherita Supreme",
      description:
        "Fresh mozzarella, basil, olive oil, and San Marzano tomatoes",
      price: 14.99,
      category: "vegetarian",
      image: "/images/pizzas/margherita.jpg",
      spicyLevel: 0,
      bestseller: true,
      ingredients: [
        "Fresh Mozzarella",
        "Basil",
        "Olive Oil",
        "San Marzano Tomatoes",
      ],
      nutritionalInfo: {
        calories: 250,
        protein: "12g",
        carbs: "30g",
        fat: "10g",
      },
    },
    // Add more pizza data here to match your menu
  ];

  const pizza = pizzaMenu.find((p) => p.id === parseInt(id));

  if (!pizza) {
    return (
      <div className="error-container">
        <h2>Pizza not found</h2>
        <button onClick={() => navigate("/menu")} className="back-button">
          <FaArrowLeft /> Back to Menu
        </button>
      </div>
    );
  }

  const sizes = {
    small: { label: "Small", price: -2 },
    medium: { label: "Medium", price: 0 },
    large: { label: "Large", price: 2 },
  };

  const crusts = {
    regular: { label: "Regular", price: 0 },
    thin: { label: "Thin", price: 0 },
    stuffed: { label: "Stuffed", price: 3 },
  };

  const calculatePrice = () => {
    const basePrice = pizza.price;
    const sizePrice = sizes[selectedSize].price;
    const crustPrice = crusts[selectedCrust].price;
    return (basePrice + sizePrice + crustPrice).toFixed(2);
  };

  const handleAddToCart = () => {
    addToCart({
      ...pizza,
      size: selectedSize,
      crust: selectedCrust,
      price: parseFloat(calculatePrice()),
      quantity: 1,
    });
    setNotification("Added to cart!");
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="pizza-details-container">
      <button onClick={() => navigate("/menu")} className="back-button">
        <FaArrowLeft /> Back to Menu
      </button>

      <div className="pizza-details-content">
        <div className="pizza-details-image">
          <img src={pizza.image} alt={pizza.name} />
          {pizza.bestseller && (
            <span className="bestseller-badge">Bestseller</span>
          )}
        </div>

        <div className="pizza-details-info">
          <h1>{pizza.name}</h1>
          <p className="description">{pizza.description}</p>

          <div className="ingredients-section">
            <h3>Ingredients</h3>
            <ul>
              {pizza.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="customization-section">
            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="options-grid">
                {Object.entries(sizes).map(([size, { label, price }]) => (
                  <button
                    key={size}
                    className={`option-btn ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {label}
                    {price !== 0 && (
                      <span>
                        {price > 0 ? `+$${price}` : `-$${Math.abs(price)}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="crust-selection">
              <h3>Select Crust</h3>
              <div className="options-grid">
                {Object.entries(crusts).map(([crust, { label, price }]) => (
                  <button
                    key={crust}
                    className={`option-btn ${
                      selectedCrust === crust ? "selected" : ""
                    }`}
                    onClick={() => setSelectedCrust(crust)}
                  >
                    {label}
                    {price !== 0 && <span>+${price}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="nutritional-info">
            <h3>Nutritional Information</h3>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span>Calories</span>
                <span>{pizza.nutritionalInfo.calories}</span>
              </div>
              <div className="nutrition-item">
                <span>Protein</span>
                <span>{pizza.nutritionalInfo.protein}</span>
              </div>
              <div className="nutrition-item">
                <span>Carbs</span>
                <span>{pizza.nutritionalInfo.carbs}</span>
              </div>
              <div className="nutrition-item">
                <span>Fat</span>
                <span>{pizza.nutritionalInfo.fat}</span>
              </div>
            </div>
          </div>

          <div className="add-to-cart-section">
            <div className="price-display">
              <span>Price:</span>
              <span className="price">${calculatePrice()}</span>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default PizzaDetails;
