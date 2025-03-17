import React, { useState } from "react";
import {
  FaUser,
  FaHistory,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";
import "../../styles/UserProfile.css";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    addresses: [
      {
        id: 1,
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
        default: true,
      },
    ],
    paymentMethods: [
      {
        id: 1,
        type: "Credit Card",
        number: "**** **** **** 4242",
        expiry: "12/24",
        default: true,
      },
    ],
  });

  const [orderHistory] = useState([
    {
      id: "#123456",
      date: "2024-02-20",
      items: ["Margherita Pizza", "Pepperoni Pizza"],
      total: 32.98,
      status: "Delivered",
    },
    {
      id: "#123457",
      date: "2024-02-18",
      items: ["BBQ Chicken Pizza"],
      total: 18.99,
      status: "Delivered",
    },
  ]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Handle profile update logic
    alert("Profile updated successfully!");
  };

  const handleAddAddress = () => {
    // Handle adding new address
    alert("Address added successfully!");
  };

  const handleAddPayment = () => {
    // Handle adding new payment method
    alert("Payment method added successfully!");
  };

  return (
    <div className="user-profile">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <FaUser size={40} />
          <h2>{profile.name}</h2>
        </div>
        <div className="profile-tabs">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser /> Profile
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <FaHistory /> Order History
          </button>
          <button
            className={activeTab === "addresses" ? "active" : ""}
            onClick={() => setActiveTab("addresses")}
          >
            <FaMapMarkerAlt /> Addresses
          </button>
          <button
            className={activeTab === "payments" ? "active" : ""}
            onClick={() => setActiveTab("payments")}
          >
            <FaCreditCard /> Payment Methods
          </button>
        </div>
      </div>

      <div className="profile-content">
        {activeTab === "profile" && (
          <div className="profile-section">
            <h2>Personal Information</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={profile.name} onChange={() => {}} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={profile.email} onChange={() => {}} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={profile.phone} onChange={() => {}} />
              </div>
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            <h2>Order History</h2>
            <div className="order-list">
              {orderHistory.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">{order.id}</span>
                    <span
                      className={`order-status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="order-items">{order.items.join(", ")}</div>
                  <div className="order-footer">
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                    <span className="order-total">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="addresses-section">
            <h2>Delivery Addresses</h2>
            <div className="address-list">
              {profile.addresses.map((address) => (
                <div key={address.id} className="address-card">
                  <div className="address-info">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.zipCode}
                    </p>
                    {address.default && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>
                  <div className="address-actions">
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
                  </div>
                </div>
              ))}
              <button className="add-button" onClick={handleAddAddress}>
                Add New Address
              </button>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="payments-section">
            <h2>Payment Methods</h2>
            <div className="payment-list">
              {profile.paymentMethods.map((payment) => (
                <div key={payment.id} className="payment-card">
                  <div className="payment-info">
                    <p>{payment.type}</p>
                    <p>{payment.number}</p>
                    <p>Expires: {payment.expiry}</p>
                    {payment.default && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>
                  <div className="payment-actions">
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
                  </div>
                </div>
              ))}
              <button className="add-button" onClick={handleAddPayment}>
                Add New Payment Method
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
