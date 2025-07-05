import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // assuming your styles are here

const SignatureForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hometown: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/signatures", formData);
      if (response.status === 200) {
        setSuccessMessage("🎉 Thank you for signing!");
        setFormData({ name: "", email: "", hometown: "" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Support Refugee Rights</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="hometown"
          placeholder="Hometown"
          value={formData.hometown}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Petition</button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default SignatureForm;
