import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaPizzaSlice,
  FaMotorcycle,
  FaStar,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./Home.css";

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1500",
    title: "Welcome to Pizza Paradise",
    description: "Discover the perfect slice of happiness",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1500",
    title: "Special Offers",
    description: "Get 20% off on your first order",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1500",
    title: "Fresh & Hot",
    description: "Made with love, delivered with care",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOrderNow = () => {
    if (isAuthenticated) {
      navigate("/menu");
    } else {
      navigate("/login");
    }
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const goBack = () => {
    navigate(-1);
  };

  const popularPizzas = [
    {
      id: 1,
      name: "Margherita Supreme",
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      price: 14.99,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Pepperoni Feast",
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      price: 16.99,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Veggie Paradise",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      price: 15.99,
      rating: 4.7,
    },
  ];

  return (
    <div className="home-container">
      <button className="back-button" onClick={goBack}>
        <FaArrowLeft /> Back
      </button>

      <div className="banner-carousel">
        <button className="carousel-button prev" onClick={prevBanner}>
          <FaChevronLeft />
        </button>
        <div className="banner-slide">
          <img
            src={banners[currentBanner].image}
            alt={banners[currentBanner].title}
          />
          <div className="banner-content">
            <h1>{banners[currentBanner].title}</h1>
            <p>{banners[currentBanner].description}</p>
            <button className="cta-button" onClick={handleOrderNow}>
              {isAuthenticated ? "Order Now" : "Login to Order"}
            </button>
          </div>
        </div>
        <button className="carousel-button next" onClick={nextBanner}>
          <FaChevronRight />
        </button>
        <div className="banner-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentBanner ? "active" : ""}`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <FaPizzaSlice className="feature-icon" />
          <h3>Fresh Ingredients</h3>
          <p>We use only the finest and freshest ingredients in our pizzas</p>
        </div>
        <div className="feature-card">
          <FaMotorcycle className="feature-icon" />
          <h3>Quick Delivery</h3>
          <p>Fast and reliable delivery to your doorstep</p>
        </div>
        <div className="feature-card">
          <FaStar className="feature-icon" />
          <h3>Custom Orders</h3>
          <p>Customize your pizza just the way you like it</p>
        </div>
      </div>

      <div className="popular-section">
        <h2>Popular Pizzas</h2>
        <div className="pizza-grid">
          {popularPizzas.map((pizza) => (
            <div
              key={pizza.id}
              className="pizza-card"
              onClick={() => navigate("/menu")}
            >
              <div className="pizza-image">
                <img src={pizza.image} alt={pizza.name} />
              </div>
              <div className="pizza-details">
                <h3>{pizza.name}</h3>
                <div className="pizza-info">
                  <span className="price">${pizza.price}</span>
                  <span className="rating">
                    <FaStar /> {pizza.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
