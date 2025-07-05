import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import celebrationImage from './assets/celebration.png';

const Petition = () => {
  const [signatures, setSignatures] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", hometown: "" });
  const [showModal, setShowModal] = useState(false);
  const [analytics, setAnalytics] = useState({ totalSignatures: 0, hometownCounts: {} });

  const BASE_URL = "http://localhost:8080/api/signatures";

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await axios.get(BASE_URL);
        setSignatures(res.data);
      } catch (err) {
        console.error("Error fetching signatures:", err);
        alert("Failed to load signatures.");
      }
    };

    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/analytics`);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        alert("Failed to load analytics.");
      }
    };

    fetchSignatures();
    fetchAnalytics();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSign = async () => {
    if (formData.name && formData.email && formData.hometown) {
      try {
        await axios.post(BASE_URL, formData);
        setSignatures((prev) => [...prev, formData]);
        setFormData({ name: "", email: "", hometown: "" });
        setShowModal(true);

        const res = await axios.get(`${BASE_URL}/analytics`);
        setAnalytics(res.data);
      } catch (error) {
        console.error("Failed to submit form:", error);
        alert("Error submitting your signature. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setSignatures((prev) => prev.filter((sig) => sig.id !== id));

      const res = await axios.get(`${BASE_URL}/analytics`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Delete failed or analytics fetch failed:", err);
      alert("Error deleting signature.");
    }
  };


  return (
    <div className="App">
      {/* Navbar */}
      <div className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/petition">Petition</Link></li>
        </ul>
      </div>

      {/* Header */}
      <div className="header-container">
      <h1 className="main-title">Support Refugee Rights</h1>
        <p className="subtitle">
            Join a growing movement for justice, compassion, and human dignity. Your voice can make a difference.
        </p>
      </div>

      {/* Petition Form */}
      <section className="petition-section">
        <h2>Sign the Petition</h2>
        <form id="petition-form">
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
          <input type="text" name="hometown" value={formData.hometown} onChange={handleInputChange} placeholder="Hometown" required />
          <button id="signNowButton" type="button" onClick={handleSign}>Sign Now</button>
        </form>
      </section>

      {/* Signature List */}
      <section className="signature-list-section">
        <h2>Signatures</h2>
        <div className="signature-list">
          {signatures.map((sig, index) => (
            <div key={sig.id || index} className="signature-entry">
              <p>{sig.name} from {sig.hometown}</p>
              <button className="delete-btn" onClick={() => handleDelete(sig.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Section */}
      <section className="petition-analytics-section">
        <h2 className="analytics-title">Petition Analytics</h2>

        <p className="analytics-stat"><strong>Total Number of Signatures:</strong> {analytics.totalSignatures}</p>

        <h3 className="analytics-subtitle">Signatures by Hometown</h3>
        <ul className="analytics-list">
            {Object.entries(analytics.hometownCounts).map(([town, count]) => (
            <li key={town}>
                <span style={{ fontWeight: 500 }}>{town}</span>: {count} {count === 1 ? "signature" : "signatures"}
            </li>
            ))}
        </ul>
        </section>



      {/* Thank You Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div id="modal-text-container">
            <p id="thanks-modal-content">Thank you for signing the petition!</p>
            <button onClick={() => setShowModal(false)} className="modal-close-btn">Close</button>
            </div>
            <img src={celebrationImage} alt="Celebration" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Petition;
