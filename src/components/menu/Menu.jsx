import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaTimes,
  FaFire,
  FaLeaf,
  FaDrumstickBite,
  FaStar,
  FaStopwatch,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { GiChiliPepper, GiFishEggs } from "react-icons/gi";
import { useCart } from "../../contexts/CartContext";
import { pizzas } from "../../data/pizzas";
import { toast } from "react-toastify";
import "./Menu.css";

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1500",
    title: "Special Offer",
    description: "Get 20% off on all large pizzas",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1500",
    title: "New Arrivals",
    description: "Try our new Seafood Supreme Pizza",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1500",
    title: "Combo Deal",
    description: "Buy 2 medium pizzas and get 1 free",
  },
];

// Add the new pizzas to the pizzas array before the component
const additionalPizzas = [
  {
    id: pizzas.length + 1,
    name: "Seafood Delight",
    description: "Fresh shrimp, calamari, mussels with garlic and herbs",
    price: 24.99,
    category: "seafood",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
    rating: 4.7,
    reviews: 128,
    preparationTime: "25-30 mins",
    isPopular: true,
    isVegetarian: false,
    isSpicy: false,
    sizes: [
      { name: "Small", price: -2 },
      { name: "Medium", price: 0 },
      { name: "Large", price: 2 },
    ],
    crusts: [
      { name: "Thin", price: 0 },
      { name: "Regular", price: 0 },
      { name: "Thick", price: 1 },
    ],
    extraToppings: [
      { name: "Extra Shrimp", price: 3 },
      { name: "Extra Cheese", price: 2 },
      { name: "Garlic", price: 1 },
    ],
  },
  {
    id: pizzas.length + 2,
    name: "Mediterranean Veggie",
    description: "Olives, feta, sun-dried tomatoes, and fresh basil",
    price: 19.99,
    category: "vegetarian",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    rating: 4.6,
    reviews: 95,
    preparationTime: "20-25 mins",
    isPopular: true,
    isVegetarian: true,
    isSpicy: false,
    sizes: [
      { name: "Small", price: -2 },
      { name: "Medium", price: 0 },
      { name: "Large", price: 2 },
    ],
    crusts: [
      { name: "Thin", price: 0 },
      { name: "Regular", price: 0 },
      { name: "Thick", price: 1 },
    ],
    extraToppings: [
      { name: "Extra Feta", price: 2 },
      { name: "Extra Olives", price: 1.5 },
      { name: "Extra Basil", price: 1 },
    ],
  },
];

// Add the new pizzas to the existing ones
pizzas.push(...additionalPizzas);

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCrust, setSelectedCrust] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const categories = [
    { id: "all", name: "All", icon: FaFire },
    { id: "vegetarian", name: "Vegetarian", icon: FaLeaf },
    { id: "meat", name: "Meat", icon: FaDrumstickBite },
    { id: "spicy", name: "Spicy", icon: GiChiliPepper },
    { id: "seafood", name: "Seafood", icon: GiFishEggs },
  ];

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(nextBanner, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {}, 300);
    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  useEffect(() => {
    if (location.state?.selectedPizzaId) {
      const pizza = pizzas.find((p) => p.id === location.state.selectedPizzaId);
      if (pizza) {
        handlePizzaClick(pizza);
      }
    }
  }, [location.state]);

  const handlePizzaClick = (pizza) => {
    setSelectedPizza(pizza);
    setSelectedSize(pizza.sizes[0]);
    setSelectedCrust(pizza.crusts[0]);
    setSelectedToppings([]);
    localStorage.setItem("lastViewedPizza", JSON.stringify(pizza));
  };

  const handleAddToCart = () => {
    if (isAddingToCart) return;

    if (!selectedSize || !selectedCrust) {
      toast.error("Please select size and crust type");
      return;
    }

    setIsAddingToCart(true);

    try {
      const totalPrice = calculateTotalPrice();
      const cartItem = {
        ...selectedPizza,
        size: selectedSize.name,
        crust: selectedCrust.name,
        toppings: selectedToppings.map((t) => t.name),
        price: totalPrice,
        quantity: 1,
      };

      addToCart(cartItem);
      toast.success(`${selectedPizza.name} added to cart!`);
      setSelectedSize(selectedPizza.sizes[0]);
      setSelectedCrust(selectedPizza.crusts[0]);
      setSelectedToppings([]);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedPizza || !selectedSize || !selectedCrust) return 0;
    let total = selectedPizza.price;
    total += selectedSize.price;
    total += selectedCrust.price;
    selectedToppings.forEach((topping) => {
      total += topping.price;
    });
    return total;
  };

  const handleBackClick = () => {
    setSelectedPizza(null);
    setSelectedSize(null);
    setSelectedCrust(null);
    setSelectedToppings([]);
  };

  const toggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.name === topping.name);
      if (exists) {
        return prev.filter((t) => t.name !== topping.name);
      }
      return [...prev, topping];
    });
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("default"); // Reset sort when clearing search
  };

  const getFilteredPizzas = () => {
    let filtered = pizzas
      .filter((pizza) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase().trim();
        const name = pizza.name.toLowerCase();
        const description = pizza.description.toLowerCase();
        const category = pizza.category ? pizza.category.toLowerCase() : "";
        return (
          name.includes(query) ||
          description.includes(query) ||
          category.includes(query)
        );
      })
      .filter((pizza) => {
        if (selectedCategory === "all") return true;
        if (selectedCategory === "vegetarian") return pizza.isVegetarian;
        if (selectedCategory === "meat")
          return !pizza.isVegetarian && pizza.category !== "seafood";
        if (selectedCategory === "spicy") return pizza.isSpicy;
        if (selectedCategory === "seafood") return pizza.category === "seafood";
        return true;
      })
      .filter(
        (pizza) =>
          pizza.price >= priceRange.min && pizza.price <= priceRange.max
      );

    // Apply sorting
    switch (sortBy) {
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "default":
      default:
        return filtered; // Maintain original order
    }
  };

  const filteredPizzas = getFilteredPizzas();

  if (selectedPizza) {
    return (
      <div className="menu-container">
        <div className="pizza-details-container">
          <h1 className="details-heading">Pizza Details</h1>
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft /> Back to Menu
          </button>
          <div className="pizza-details">
            <div className="pizza-details-image">
              <img src={selectedPizza.image} alt={selectedPizza.name} />
              {selectedPizza.isPopular && (
                <span className="popular-badge">
                  <FaFire /> Popular
                </span>
              )}
            </div>
            <div className="pizza-details-info">
              <h2>{selectedPizza.name}</h2>
              <div className="pizza-meta">
                <span className="rating">
                  <FaStar /> {selectedPizza.rating} ({selectedPizza.reviews}{" "}
                  reviews)
                </span>
                <span className="prep-time">
                  <FaStopwatch /> {selectedPizza.preparationTime}
                </span>
              </div>
              <p className="description">{selectedPizza.description}</p>

              <div className="customization-section">
                <h3>Choose Size</h3>
                <div className="options-grid">
                  {selectedPizza.sizes.map((size) => (
                    <button
                      key={size.name}
                      className={`option-button ${
                        selectedSize?.name === size.name ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.name}
                      {size.price > 0 && <span>+${size.price.toFixed(2)}</span>}
                    </button>
                  ))}
                </div>

                <h3>Select Crust</h3>
                <div className="options-grid">
                  {selectedPizza.crusts.map((crust) => (
                    <button
                      key={crust.name}
                      className={`option-button ${
                        selectedCrust?.name === crust.name ? "active" : ""
                      }`}
                      onClick={() => setSelectedCrust(crust)}
                    >
                      {crust.name}
                      {crust.price > 0 && (
                        <span>+${crust.price.toFixed(2)}</span>
                      )}
                    </button>
                  ))}
                </div>

                <h3>Extra Toppings</h3>
                <div className="options-grid">
                  {selectedPizza.extraToppings.map((topping) => (
                    <button
                      key={topping.name}
                      className={`option-button ${
                        selectedToppings.find((t) => t.name === topping.name)
                          ? "active"
                          : ""
                      }`}
                      onClick={() => toggleTopping(topping)}
                    >
                      {topping.name}
                      <span>+${topping.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>

                <div className="total-section">
                  <h3>Total Price</h3>
                  <span className="total-price">
                    ${calculateTotalPrice().toFixed(2)}
                  </span>
                  <button
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
                  </button>
                  <button
                    className="proceed-button"
                    onClick={() => navigate("/cart")}
                  >
                    Proceed to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
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
            <h2>{banners[currentBanner].title}</h2>
            <p>{banners[currentBanner].description}</p>
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

      <div className="menu-header">
        <h1>Our Menu</h1>
        <div className="search-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search pizzas..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoComplete="off"
            />
            {searchQuery && (
              <button className="clear-search" onClick={handleClearSearch}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category ${category.id} ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <category.icon />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="price-range">
        {/* ... existing price range slider ... */}
      </div>

      <div className="sort-section">
        <label htmlFor="sort-select">Sort by: </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-dropdown"
        >
          <option value="default">Default</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>

      {filteredPizzas.length === 0 ? (
        <div className="no-results">
          <p>No pizzas found matching your criteria</p>
          <button className="clear-filters" onClick={handleClearSearch}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="pizza-grid">
          {filteredPizzas.map((pizza) => (
            <div
              key={pizza.id}
              className="pizza-card"
              onClick={() => handlePizzaClick(pizza)}
            >
              <div className="pizza-image">
                <img src={pizza.image} alt={pizza.name} />
                {pizza.isPopular && (
                  <span className="popular-badge">
                    <FaFire /> Popular
                  </span>
                )}
              </div>
              <div className="pizza-info">
                <h3>{pizza.name}</h3>
                <div className="pizza-meta">
                  <span className="rating">
                    <FaStar /> {pizza.rating}
                  </span>
                  <span className="prep-time">
                    <FaStopwatch /> {pizza.preparationTime}
                  </span>
                </div>
                <p className="description">{pizza.description}</p>
                <div className="price-category">
                  <span className="price">${pizza.price.toFixed(2)}</span>
                  <span className={`category ${pizza.category.toLowerCase()}`}>
                    {pizza.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;