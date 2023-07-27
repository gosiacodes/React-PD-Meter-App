import React, { Fragment } from "react";

const Info = () => {
  // DOM elements with text which shows when instructions are needed
  return (
    <Fragment>
      <div className="content">
        <p>Best results can be achieved when the face is about 40 cm from the
        camera.</p>
        <p>Make sure there is good lighting and the camera is clean.</p>
        <p>Sit still and do not move your head.</p>
        <p>
          Look straight into the camera or at the red dot at the top and take a
          picture.
        </p>
        <p>
          The result on the left is the approximate distance between the pupils.
        </p>
        <p>
          The result on the right is the PD average if you take multiple shots.
        </p>
        <p>
          You can retake the picture as many times as you like (wait for the
          video to reload).
        </p>
      </div>
    </Fragment>
  );
};

export default Info;
