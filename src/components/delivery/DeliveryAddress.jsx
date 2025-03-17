// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaMapMarkerAlt,
//   FaPhone,
//   FaPen,
//   FaSpinner,
//   FaArrowLeft,
// } from "react-icons/fa";
// import { useAuth } from "../../contexts/AuthContext";
// import "./DeliveryAddress.css";

// const DeliveryAddress = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const [addressType, setAddressType] = useState("geolocation");
//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     contactNo: "",
//     landmark: "",
//   });
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);

//   // Add useEffect to check authentication
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login", { state: { from: "/delivery" } });
//     }
//   }, [isAuthenticated, navigate]);

//   // Primary geocoding service with better address component handling
//   const geocodingServices = [
//     {
//       name: "OpenStreetMap",
//       url: (lat, lon) =>
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=en&zoom=18`,
//       headers: {
//         Accept: "application/json",
//         "User-Agent": "PizzaDeliveryApp/1.0",
//       },
//       parseResponse: (data) => ({
//         street:
//           [data.address.road, data.address.house_number]
//             .filter(Boolean)
//             .join(" ") || "",
//         city:
//           data.address.city ||
//           data.address.town ||
//           data.address.village ||
//           data.address.suburb ||
//           "",
//         state: data.address.state || "",
//         zipCode: data.address.postcode || "",
//       }),
//     },
//     {
//       name: "BigDataCloud",
//       url: (lat, lon) =>
//         `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
//       headers: {
//         Accept: "application/json",
//       },
//       parseResponse: (data) => ({
//         street: data.locality || "",
//         city: data.city || data.locality || "",
//         state: data.principalSubdivision || "",
//         zipCode: data.postcode || "",
//       }),
//     },
//   ];

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       setGeoLocationEnabled(true);
//       handleGeolocation(); // Automatically trigger geolocation
//     } else {
//       setError("Geolocation is not supported by your browser");
//       setAddressType("manual");
//     }
//   }, []);

//   const tryGeocodeService = async (service, latitude, longitude) => {
//     try {
//       const response = await fetch(service.url(latitude, longitude), {
//         headers: service.headers,
//       });

//       if (!response.ok) {
//         throw new Error(`${service.name} service failed`);
//       }

//       const data = await response.json();
//       const parsedData = service.parseResponse(data);

//       // Validate the response data
//       if (parsedData.city && parsedData.state) {
//         return parsedData;
//       }
//       return null;
//     } catch (error) {
//       console.error(`Error with ${service.name}:`, error);
//       return null;
//     }
//   };

//   const handleGeolocation = () => {
//     setLoading(true);
//     setError("");
//     setAddressType("geolocation");

//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser");
//       setLoading(false);
//       setAddressType("manual");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords;
//           let addressData = null;
//           let cityStateFound = false;

//           // Try each geocoding service until we get valid city and state data
//           for (const service of geocodingServices) {
//             addressData = await tryGeocodeService(service, latitude, longitude);
//             if (addressData?.city && addressData?.state) {
//               cityStateFound = true;
//               break;
//             }
//           }

//           // If we still don't have city and state, try a fallback approach
//           if (!cityStateFound) {
//             try {
//               const fallbackResponse = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
//               );
//               const fallbackData = await fallbackResponse.json();

//               if (fallbackData.address) {
//                 addressData = {
//                   street: addressData?.street || "",
//                   city:
//                     fallbackData.address.city ||
//                     fallbackData.address.town ||
//                     fallbackData.address.suburb ||
//                     "Unknown City",
//                   state: fallbackData.address.state || "Unknown State",
//                   zipCode:
//                     fallbackData.address.postcode || addressData?.zipCode || "",
//                 };
//                 cityStateFound = true;
//               }
//             } catch (error) {
//               console.error("Fallback geocoding failed:", error);
//             }
//           }

//           // Ensure we have some data to display
//           if (!addressData) {
//             addressData = {
//               street:
//                 "Near " + latitude.toFixed(4) + ", " + longitude.toFixed(4),
//               city: "Unknown City",
//               state: "Unknown State",
//               zipCode: "",
//             };
//           }

//           setCurrentLocation({
//             latitude,
//             longitude,
//             formattedAddress:
//               `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.zipCode}`.trim(),
//             ...addressData,
//           });

//           setAddress((prev) => ({
//             ...prev,
//             ...addressData,
//           }));

//           setLoading(false);
//           if (!cityStateFound) {
//             setError(
//               "Could not determine exact city and state. Please verify the information."
//             );
//           } else {
//             setError("");
//           }
//         } catch (err) {
//           console.error("Geolocation error:", err);
//           handleLocationError(
//             "Unable to get precise location. Please try again or enter manually."
//           );
//         }
//       },
//       (err) => {
//         let errorMessage = "Failed to get your location. ";
//         switch (err.code) {
//           case err.PERMISSION_DENIED:
//             errorMessage +=
//               "Please enable location permissions in your browser.";
//             break;
//           case err.POSITION_UNAVAILABLE:
//             errorMessage += "Location information is unavailable.";
//             break;
//           case err.TIMEOUT:
//             errorMessage += "Location request timed out.";
//             break;
//           default:
//             errorMessage += "Please try again or enter manually.";
//         }
//         handleLocationError(errorMessage);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 30000, // Increased timeout for better accuracy
//         maximumAge: 0,
//       }
//     );
//   };

//   const handleLocationError = (message) => {
//     setError(message);
//     setLoading(false);
//   };

//   const handleSwitchToManual = () => {
//     setAddressType("manual");
//     setAddress({
//       street: "",
//       city: "",
//       state: "",
//       zipCode: "",
//       contactNo: address.contactNo, // Preserve contact number
//       landmark: "",
//     });
//     setCurrentLocation(null);
//     setError("");
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     let processedValue = value;

//     // Special handling for ZIP code
//     if (name === "zipCode") {
//       processedValue = value.replace(/[^0-9]/g, "").slice(0, 6); // Allow only numbers, max 6 digits
//     }

//     setAddress((prev) => ({
//       ...prev,
//       [name]: processedValue,
//     }));
//     setError("");
//   };

//   const validateForm = (silent = false) => {
//     const contactNoRegex = /^\d{10}$/;
//     if (!address.contactNo || !contactNoRegex.test(address.contactNo.trim())) {
//       if (!silent) setError("Please enter a valid 10-digit contact number");
//       return false;
//     }

//     const requiredFields = {
//       street: "Street Address",
//       city: "City",
//       state: "State",
//       zipCode: "ZIP Code",
//     };

//     for (const [field, label] of Object.entries(requiredFields)) {
//       if (!address[field] || !address[field].trim()) {
//         if (!silent) setError(`Please fill in ${label}`);
//         return false;
//       }
//     }

//     // Additional ZIP code validation
//     const zipRegex = /^\d{5,6}$/;
//     if (!zipRegex.test(address.zipCode.trim())) {
//       if (!silent) setError("Please enter a valid ZIP code (5-6 digits)");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const deliveryDetails = {
//         type: addressType,
//         ...address,
//         ...(addressType === "geolocation" &&
//           currentLocation && {
//             location: {
//               latitude: currentLocation.latitude,
//               longitude: currentLocation.longitude,
//               formattedAddress: currentLocation.formattedAddress,
//             },
//           }),
//       };

//       localStorage.setItem("deliveryDetails", JSON.stringify(deliveryDetails));

//       // Use navigate instead of window.location.href
//       navigate("/payment");
//     } catch (err) {
//       console.error("Submission error:", err);
//       setError("Failed to process delivery details. Please try again.");
//     }
//   };

//   const handleBackToCart = () => {
//     navigate("/cart");
//   };

//   return (
//     <>
//       <div className="delivery-container">
//         <button
//           type="button"
//           onClick={handleBackToCart}
//           className="back-button"
//           aria-label="Back to Cart"
//         >
//           <FaArrowLeft /> Back to Cart
//         </button>

//         <h1>Delivery Address</h1>

//         <div className="address-type-selector">
//           <button
//             className={`type-btn ${
//               addressType === "geolocation" ? "active" : ""
//             } ${!geoLocationEnabled ? "disabled" : ""}`}
//             onClick={handleGeolocation}
//             disabled={loading || !geoLocationEnabled}
//             type="button"
//           >
//             {loading ? <FaSpinner className="spinner" /> : <FaMapMarkerAlt />}
//             {loading ? "Getting Location..." : "Use Current Location"}
//           </button>
//           <button
//             className={`type-btn ${addressType === "manual" ? "active" : ""}`}
//             onClick={handleSwitchToManual}
//             type="button"
//           >
//             <FaPen /> Enter Manually
//           </button>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="delivery-form">
//           <div className="contact-section">
//             <label>
//               Contact Number*
//               <div className="input-with-icon">
//                 <FaPhone className="input-icon" />
//                 <input
//                   type="tel"
//                   name="contactNo"
//                   value={address.contactNo}
//                   onChange={handleInputChange}
//                   placeholder="Enter 10-digit mobile number"
//                   required
//                   pattern="[0-9]{10}"
//                 />
//               </div>
//             </label>
//           </div>

//           <div
//             className={`address-fields ${
//               addressType === "geolocation" ? "geolocation-active" : ""
//             }`}
//           >
//             <label>
//               Street Address*
//               <input
//                 type="text"
//                 name="street"
//                 value={address.street}
//                 onChange={handleInputChange}
//                 placeholder="Enter street address"
//                 required
//                 readOnly={addressType === "geolocation" && loading}
//               />
//             </label>

//             <div className="address-grid">
//               <label>
//                 City*
//                 <input
//                   type="text"
//                   name="city"
//                   value={address.city}
//                   onChange={handleInputChange}
//                   placeholder="Enter city"
//                   required
//                   readOnly={addressType === "geolocation" && loading}
//                 />
//               </label>

//               <label>
//                 State*
//                 <input
//                   type="text"
//                   name="state"
//                   value={address.state}
//                   onChange={handleInputChange}
//                   placeholder="Enter state"
//                   required
//                   readOnly={addressType === "geolocation" && loading}
//                 />
//               </label>

//               <label>
//                 ZIP Code*
//                 <input
//                   type="text"
//                   name="zipCode"
//                   value={address.zipCode}
//                   onChange={handleInputChange}
//                   placeholder="Enter ZIP code"
//                   required
//                   readOnly={addressType === "geolocation" && loading}
//                 />
//               </label>

//               <label>
//                 Landmark
//                 <input
//                   type="text"
//                   name="landmark"
//                   value={address.landmark}
//                   onChange={handleInputChange}
//                   placeholder="Enter landmark (optional)"
//                 />
//               </label>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className={`submit-btn ${!validateForm(true) ? "disabled" : ""}`}
//           >
//             Proceed to Payment
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default DeliveryAddress;







import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaPen,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import "./DeliveryAddress.css";

const DeliveryAddress = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [addressType, setAddressType] = useState("geolocation");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    contactNo: "",
    landmark: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/delivery" } });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "zipCode") {
      processedValue = value.replace(/[^0-9]/g, "").slice(0, 6);
    }
    setAddress((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const validateForm = () => {
    const contactNoRegex = /^\d{10}$/;
    if (!address.contactNo || !contactNoRegex.test(address.contactNo.trim())) {
      return false;
    }
    return Object.values(address).every((val) => val.trim() !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill in all required fields correctly.");
      return;
    }
    navigate("/payment", { state: { address } });
  };

  return (
    <div className="delivery-container">
      <button type="button" onClick={() => navigate("/cart")} className="back-button">
        <FaArrowLeft /> Back to Cart
      </button>

      <h1>Delivery Address</h1>

      <form onSubmit={handleSubmit} className="delivery-form">
        <label>
          Contact Number*
          <div className="input-with-icon">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              name="contactNo"
              value={address.contactNo}
              onChange={handleInputChange}
              placeholder="Enter 10-digit mobile number"
              required
            />
          </div>
        </label>

        <label>
          Street Address*
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleInputChange}
            placeholder="Enter street address"
            required
          />
        </label>

        <div className="address-grid">
          <label>
            City*
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleInputChange}
              placeholder="Enter city"
              required
            />
          </label>

          <label>
            State*
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleInputChange}
              placeholder="Enter state"
              required
            />
          </label>

          <label>
            ZIP Code*
            <input
              type="text"
              name="zipCode"
              value={address.zipCode}
              onChange={handleInputChange}
              placeholder="Enter ZIP code"
              required
            />
          </label>

          <label>
            Landmark
            <input
              type="text"
              name="landmark"
              value={address.landmark}
              onChange={handleInputChange}
              placeholder="Enter landmark"
            />
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={!validateForm()}>
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default DeliveryAddress;



