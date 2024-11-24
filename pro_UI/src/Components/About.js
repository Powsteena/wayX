import React from 'react';
import '../CSS/About.css';

const About = () => {
  return (
    <div className="container-fluid about-container">
      <div className="row about-content">
        <div className="col-md-6 about-text">
          <h1>About WayX</h1>
          <p>
            WayX is a smart urban platform that aims to transform the way you travel. Whether you are a passenger or a driver, our platform offers convenience and flexibility to meet your transportation needs.
          </p>
          <button className="btn cta-button">Discover Our Platform</button>
        </div>

        <div className="col-md-6 what-we-do">
          <h2>What We Do</h2>
          <div className="row">
            <div className="col-12 service-item">
              <span className="icon">🚗</span>
              <h3>Ride Sharing</h3>
              <p>
                Offering smart ride-sharing solutions for long and short-distance travel.
              </p>
            </div>

            <div className="col-12 service-item">
              <span className="icon">📱</span>
              <h3>App Integration</h3>
              <p>
                Seamless app integration for payments, and driver information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
