// src/components/Hero.jsx

import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">Hi, I'm Hanif Nugraha.</h1>
        <p className="hero__subtitle">I build things for the web & IoT.</p>
        <p className="hero__description">
          An Electronics and Instrumentation (UGM) student with a passion for developing innovative digital solutions, ranging from intuitive web interfaces to integrated IoT systems.
        </p>
        <a href="#projects" className="btn btn--hero">View My Projects</a>
      </div>
    </section>
  );
}

export default Hero;