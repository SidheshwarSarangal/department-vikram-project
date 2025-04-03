/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import "../Assets/css/landing.css";
import img2 from "./landing.jpg";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="land-top" style={{ backgroundImage: `url(${img2})` }}>
      <div className="land-inner-top">
        <div className={`land-banner-image ${isLoading ? "loading" : ""}`}>
          {isLoading && (
            <div className="loaders book">
              <figure className="page"></figure>
              <figure className="page"></figure>
              <figure className="page"></figure>
            </div>
          )}
        </div>
        <div className="land-banner-slogan">
          <div className="land-banner-slogan-inner">
            <div className="land-logo">Biotech Library</div>
            <div className="land-motto">Discover, Learn, Grow</div>
            <div className="land-button">
              <a className="landing-button-hover" href="/home">
                <span>GO!!</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
