// src/components/About.jsx

import React from "react";

function About() {
  return (
    <>
      <h2 className="section-title">About</h2>
      <p>
        An Electronics and Instrumentation student with dual expertise in hardware and software engineering. I translate user needs into tangible solutions through Web Development and the Internet of Things (IoT). My main focus is to create seamlessly integrated systems with user experience as the highest priority. Ready to apply my fast-learning abilities in a dynamic and innovative environment.
      </p>
      <div className="button-container">
        <a 
          href="/assets/docs/CV_Hanif Nugraha.pdf" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn"
        >
          View CV
        </a>
        <a 
          href="/assets/docs/Shokumukeirekisho_Hanif_Ardiyanta_Nugraha.pdf" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn"
        >
          View Shokumukeirekisho
        </a>
      </div>
    </>
  );
}

export default About;