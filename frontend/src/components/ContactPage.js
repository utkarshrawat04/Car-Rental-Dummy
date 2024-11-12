import React from 'react';
import '../css/ContactPage.css';


const ContactPage = () => {
  return (
    <div className="contact-page">
      <main>
        <section className="contact-section">
          <h2>Contact Us</h2>
          <p>For any inquiries, please contact us at:</p>
          <p>Bedi Rentals</p>
          <p>15 Yemen Road</p>
          <p>Yemen</p>
          <p>
            Phone: <a href="tel:+123456789">+91 7021484750</a>
          </p>
          <p>
            Email: <a href="mailto:senrentals@gmail.comm">mailto:senrentals@gmail.comm</a>
          </p>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Bedi Rentals.</p>
      </footer>
    </div>
  );
};

export default ContactPage;
