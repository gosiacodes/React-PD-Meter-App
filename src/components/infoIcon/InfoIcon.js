import React, { Fragment } from "react";

const InfoIcon = () => {
  // Function for hiding container with introduction and showing container with info
  const showInfo = () => {
    document.querySelector("#card-1").style.display = "none";
    document.querySelector("#card-2").style.display = "flex";
    document.querySelector(".container-display").style.display = "none";
    document.querySelector(".container-img").style.display = "none";
  };
  // DOM elements with info icon
  return (
    <Fragment>
      <picture
        alt="info icon"
        onClick={(ev) => {
          showInfo();
          ev.preventDefault();
        }}
      >
        <source
          srcSet={process.env.PUBLIC_URL + "/images/info-24.png"}
          media="(max-width: 390px)"
        />
        <source
          srcSet={process.env.PUBLIC_URL + "/images/info-32.png"}
          media="(max-width: 670px)"
        />
        <img
          className="info-icon"
          src={process.env.PUBLIC_URL + "/images/info-48.png"}
          alt="info icon"
          title="Instruktion"
        />
      </picture>
    </Fragment>
  );
};

export default InfoIcon;
