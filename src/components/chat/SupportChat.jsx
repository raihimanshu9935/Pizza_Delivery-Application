import React, { useState, useEffect, useRef } from "react";
import {
  FaRegPaperPlane,
  FaTimes,
  FaComments,
  FaPaperclip,
  FaTrash,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/SupportChat.css";

const SupportChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            id: 1,
            text: "Hello! How can we help you today?",
            sender: "support",
            timestamp: new Date().toISOString(),
          },
        ];
  });
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to delete chat history
  const deleteChatHistory = () => {
    if (window.confirm("Are you sure you want to delete the chat history?")) {
      localStorage.removeItem("chatMessages");
      setMessages([
        {
          id: 1,
          text: "Hello! How can we help you today?",
          sender: "support",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const generateSupportResponse = (userMessage) => {
    const responses = [
      "I understand. Let me help you with that.",
      "Thank you for your message. Could you please provide more details?",
      "I'll look into this right away.",
      "Is there anything else you'd like to know?",
      "Let me connect you with a specialist who can better assist you.",
      "Could you clarify your question so I can assist you better?",
      "I’m here to help! What seems to be the issue?",
      "Please give me a moment to check that for you.",
      "That’s a great question! Let me find the best answer for you.",
      "I appreciate your patience. Let me assist you with this.",
      "I’m sorry to hear that. Let’s resolve this together.",
      "Thank you for reaching out! How can I assist you today?",
      "I’m glad you asked! Here’s what I can tell you.",
      "Let me guide you through this step by step.",
      "I’m here to ensure you have the best experience possible.",
    ];

    // Convert the user message to lowercase for easier matching
    const lowerCaseMessage = userMessage.toLowerCase();

    // Keyword-based responses
    if (lowerCaseMessage.includes("delivery")) {
      return "Our delivery time is usually 30-45 minutes. Would you like to track your order?";
    } else if (lowerCaseMessage.includes("payment")) {
      return "We accept all major credit cards, PayPal, and cash on delivery.";
    } else if (lowerCaseMessage.includes("menu")) {
      return "You can check our full menu in the Menu section. Would you like me to help you find something specific?";
    } else if (lowerCaseMessage.includes("order status")) {
      return "To check your order status, please provide your order number.";
    } else if (lowerCaseMessage.includes("refund")) {
      return "For refund requests, please contact our support team with your order details.";
    } else if (lowerCaseMessage.includes("cancel")) {
      return "If you wish to cancel your order, please provide your order number and we'll assist you.";
    } else if (lowerCaseMessage.includes("hours")) {
      return "Our support team is available 24/7. How can we assist you today?";
    } else if (lowerCaseMessage.includes("contact")) {
      return "You can contact us via email at support@example.com or call us at +123-456-7890.";
    } else if (lowerCaseMessage.includes("discount")) {
      return "We currently have a 10% discount on all orders above $50. Use code SAVE10 at checkout!";
    } else if (lowerCaseMessage.includes("allergy")) {
      return "Please let us know about any allergies, and we'll ensure your meal is prepared safely.";
    } else if (lowerCaseMessage.includes("feedback")) {
      return "We appreciate your feedback! Please share your experience with us.";
    } else if (lowerCaseMessage.includes("complaint")) {
      return "We apologize for the inconvenience. Please provide details, and we'll resolve it as soon as possible.";
    } else if (lowerCaseMessage.includes("track")) {
      return "To track your order, please provide your order number.";
    } else if (lowerCaseMessage.includes("return")) {
      return "For returns, please ensure the item is in its original condition and contact us with your order details.";
    } else if (lowerCaseMessage.includes("shipping")) {
      return "We offer free shipping on orders above $100. For other orders, shipping costs are calculated at checkout.";
    } else if (lowerCaseMessage.includes("promo")) {
      return "Check out our latest promotions in the Promotions section. Use the code at checkout to avail discounts!";
    } else if (lowerCaseMessage.includes("account")) {
      return "You can manage your account settings, including password and email, in the Account section.";
    } else if (lowerCaseMessage.includes("password")) {
      return "If you've forgotten your password, click on 'Forgot Password' on the login page to reset it.";
    } else if (lowerCaseMessage.includes("login")) {
      return "Please ensure you're using the correct email and password. If issues persist, try resetting your password.";
    } else if (lowerCaseMessage.includes("sign up")) {
      return "You can create a new account by clicking on 'Sign Up' and filling in your details.";
    } else if (lowerCaseMessage.includes("subscription")) {
      return "We offer monthly and yearly subscription plans. You can manage your subscription in the Account section.";
    } else if (lowerCaseMessage.includes("quality")) {
      return "We strive to provide the best quality products. If you're unsatisfied, please let us know.";
    } else if (lowerCaseMessage.includes("damage")) {
      return "If your order arrived damaged, please provide photos and details, and we'll assist you.";
    } else if (lowerCaseMessage.includes("missing")) {
      return "If any items are missing from your order, please contact us with your order details.";
    } else if (lowerCaseMessage.includes("price")) {
      return "Our prices are competitive and reflect the quality of our products. Check out our discounts for savings!";
    } else if (lowerCaseMessage.includes("availability")) {
      return "Please check the product page for availability. If out of stock, you can sign up for restock notifications.";
    } else if (lowerCaseMessage.includes("support")) {
      return "Our support team is here to help! Please describe your issue, and we'll assist you.";
    } else if (lowerCaseMessage.includes("thank you")) {
      return "You're welcome! Let us know if there's anything else we can assist you with.";
    } else if (lowerCaseMessage.includes("help")) {
      return "Sure! Please describe your issue, and we'll do our best to assist you.";
    } else if (lowerCaseMessage.includes("hello")) {
      return "Hello! How can we assist you today?";
    } else if (lowerCaseMessage.includes("hi")) {
      return "Hi there! How can we help you?";
    } else if (lowerCaseMessage.includes("bye")) {
      return "Goodbye! Feel free to reach out if you have more questions.";
    }

    // Default random response
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    let messageText = newMessage;
    if (selectedFile) {
      // In a real app, you would upload the file to a server
      messageText = selectedFile.name + " (File attached)";
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      userName: user?.name || "Guest",
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setSelectedFile(null);

    // Show typing indicator
    setIsTyping(true);

    // Simulate support response with typing delay
    setTimeout(() => {
      const supportMessage = {
        id: Date.now() + 1,
        text: generateSupportResponse(messageText),
        sender: "support",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, supportMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should not exceed 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="support-chat">
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <FaComments />
          <span>Need Help?</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Support Chat</h3>
            <div className="chat-header-buttons">
              <button className="delete-chat" onClick={deleteChatHistory}>
                <FaTrash />
              </button>
              <button className="close-chat" onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === "user" ? "user" : "support"
                }`}
              >
                <div className="message-content">
                  {message.sender === "user" && (
                    <span className="user-name">{message.userName}</span>
                  )}
                  <p>{message.text}</p>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message support">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
              accept="image/*,.pdf,.doc,.docx"
            />
            <button
              type="button"
              className="attach-button"
              onClick={() => fileInputRef.current.click()}
            >
              <FaPaperclip />
            </button>
            <button type="submit">
              <FaRegPaperPlane />
            </button>
          </form>
          {selectedFile && (
            <div className="selected-file">
              Selected file: {selectedFile.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportChat;