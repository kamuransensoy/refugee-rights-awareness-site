import { useState, useEffect } from 'react';
import './App.css';
import passportImage from './assets/Passport.png';
import advocacyImage from './assets/Advocacy.jpeg';
import libertyImage from './assets/Liberty.jpeg';
import celebrationImage from './assets/celebration.png';
import axios from "axios";
import { Link } from 'react-router-dom';


console.log("App component rendered");

function App() {
  const [signatures, setSignatures] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', hometown: '' });
  const [showModal, setShowModal] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Scroll reveal logic
  useEffect(() => {
    console.log("useEffect triggered");
  
    const handleScroll = () => {
      document.querySelectorAll('.revealable').forEach((el) => {
        const top = el.getBoundingClientRect().top;
        console.log("Checking element", el, "Top:", top);
    
        if (top < window.innerHeight - 150) {
          el.classList.add('active');
          console.log("Activated element");
        }
      });
    };
  
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
  
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);  

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/signatures");
        setSignatures(response.data);
      } catch (error) {
        console.error("Error fetching signatures:", error);
      }
    };
  
    fetchSignatures();
  }, []);
  

  const handleDelete = (id) => {
    console.log("Attempting to delete ID:", id);
    axios.delete(`/api/signatures/${id}`)
      .then(() => {
        console.log("Delete successful");
        setSignatures((prev) => prev.filter((s) => s.id !== id));
      })
      .catch((err) => {
        console.error("Delete failed:", err);
      });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSign = async () => {
    if (formData.name && formData.email && formData.hometown) {
      try {
        await axios.post("http://localhost:8080/api/signatures", formData);
        setSignatures([...signatures, formData]); // optional: update local list
        setFormData({ name: "", email: "", hometown: "" });
        setShowModal(true);
      } catch (error) {
        console.error("Failed to submit form:", error);
        alert("There was an error submitting your signature. Please try again.");
      }
    }
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle('dark-theme', !darkTheme);
  };

  const toggleReduceMotion = () => {
    setReduceMotion(!reduceMotion);
    document.querySelectorAll('.revealable').forEach(el => {
      el.style.transition = reduceMotion ? 'all 1s ease' : 'none';
    });
  };

  return (
    <div className={`App ${darkTheme ? 'dark-theme' : ''}`}>
      <div className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/petition">Petition</Link></li>
        </ul>
      </div>

      <div className="header-container">
        <h1>Stand for Refugee Rights</h1>
      </div>

      <div className="main-content revealable">
        <section className="guide" id="guide">
          <h2>The Ultimate Guide to Refugee Rights</h2>
          <img src={passportImage} alt="Passport and Approval Document" className="content-image" />
          <p>Refugee rights are human rights. This guide provides a comprehensive overview of the legal protections, challenges, and resources available to refugees globally.</p>
        </section>

        <section className="support" id="support">
          <h2>How to Support Refugees</h2>
          <img src={advocacyImage} alt="Advocacy Hands" className="content-image" />
          <p>Whether you're an individual or an organization, there are numerous ways to support refugees. Learn how your actions can help create safe environments for those who have been forced to flee their homes.</p>
        </section>

        <section className="stories" id="stories">
          <h2>Empowering Communities Through Stories</h2>
          <img src={libertyImage} alt="Statue of Liberty and Protesters" className="content-image" />
          <p>Stories reveal the journeys of refugees, highlighting their struggles and triumphs, bringing a human face to global statistics, and fostering empathy.</p>
        </section>
      </div>

      <section className="video-section revealable">
        <h2>Watch the Video and Learn More</h2>
        <div className="video-container">
          <iframe src="https://www.youtube.com/embed/5qqBim97CrU" title="YouTube video" frameBorder="0" allowFullScreen></iframe>
        </div>
      </section>

      <div className="horizontal-container revealable">
      <section className="call-to-action-section">
          <h2 className="cta-heading">Take Action for Refugee Rights</h2>

          <p>
            Refugees around the world are facing unimaginable challenges from displacement to discrimination. 
            Your voice has the power to bring visibility, hope, and lasting change.
            By <strong>signing the petition</strong>, you are joining a growing movement advocating for dignity, justice, 
            and legal protection for every refugee.
          </p>
          <br />
          <p>
            To view real-time signature data and add your name to the cause, please{' '}
            <Link to="/petition" className="petition-link"><strong>visit the Petition page</strong></Link>.
          </p>


        </section>



        <section className="petition-section">
          <h2>Sign the Petition</h2>
          <form id="petition-form">
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
            <input type="text" name="hometown" value={formData.hometown} onChange={handleInputChange} placeholder="Hometown" required />
            <button id="signNowButton" type="button" onClick={handleSign}>Sign Now</button>
          </form>
        </section>

        <section className="signature-list-section">
          <h2>Signatures</h2>
          <div className="signature-list">
          {signatures.map((sig) => (
            <div key={sig.id} className="signature-entry">
              <p>{sig.name} from {sig.hometown}</p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(sig.id)}
              >
                Delete
              </button>
            </div>
          ))}

          </div>
        </section>
      </div>

      {showModal && (
        <div id="thanks-modal" className="modal">
          <div className="modal-content">
            <div id="modal-text-container">
              <p id="thanks-modal-content">Thank you for signing the petition!</p>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">Close</button>
            </div>
            <img src={celebrationImage} alt="Celebration" className="modal-image" />
          </div>
        </div>
      )}

      <button id="theme-toggle" className="theme-toggle" onClick={toggleTheme}>Toggle Light/Dark Mode</button>

    </div>
  );
}

export default App;
