import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const register = async (name, email, password) => {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: password.trim(), // Ensure password is trimmed
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setUser(newUser);
    navigate("/");
  };

  const login = async (email, password) => {
    // Trim both email and password
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Find user by email first
    const foundUser = users.find((u) => u.email === trimmedEmail);

    if (!foundUser) {
      throw new Error("No account found with this email");
    }

    // Then check password
    if (foundUser.password !== trimmedPassword) {
      throw new Error("Incorrect password");
    }

    setUser(foundUser);
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    users,
    setUsers,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
