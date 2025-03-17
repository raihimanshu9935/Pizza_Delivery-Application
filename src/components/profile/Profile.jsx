import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const { user, users, setUsers } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the user in the users array
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          ...formData,
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaMapMarkerAlt className="input-icon" />
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
              />
            </div>
          </div>

          <div className="button-group">
            {isEditing ? (
              <>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
