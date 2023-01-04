// Copyright 2023 MediaPipe & imvi labs & Malgorzata Pick
import React, { Fragment, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  FaceMesh,
  // FACEMESH_TESSELATION,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_LEFT_IRIS,
  FACEMESH_FACE_OVAL,
} from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";

const WebcamImg = () => {
  // Global settings
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const width = 640.0;
  const height = 360.0;
  const videoConstraints = {
    width: width,
    height: height,
    facingMode: "user",
  };

  // Function to calculate distance between two points / pupils
  const getDistance = (p1, p2) => {
    return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.z - p2.z, 2)
    );
  };

  // Loading webcam and setting Face Mesh API when image source changes
  useEffect(() => {
    // Function to run canvas with video and Face Mesh when ready
    const onResults = (results) => {
      // Hiding container with downloading info and showing results with video and explanation info
      document.querySelector(".container-downloading").style.display = "none";
      document.querySelector(".container-video").style.display = "flex";
      document.querySelector(".container-info").style.display = "flex";

      // Setting canvas - references and context
      const canvasElement = canvasRef.current;
      canvasElement.width = width;
      canvasElement.height = height;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Loading Face Mesh landmarks for iris and getting coordinates for pupils
      if (results.multiFaceLandmarks && results.multiFaceLandmarks[0]) {
        let pupils = {
          left: {
            x:
              (results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]].x +
                results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]].x) /
              2.0,
            y:
              (results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]].y +
                results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]].y) /
              2.0,
            z:
              (results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]].z +
                results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]].z) /
              2.0,
            width: getDistance(
              results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]],
              results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]]
            ),
          },
          right: {
            x:
              (results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]].x +
                results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]].x) /
              2.0,
            y:
              (results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]].y +
                results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]].y) /
              2.0,
            z:
              (results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]].z +
                results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]].z) /
              2.0,
            width: getDistance(
              results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]],
              results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]]
            ),
          },
        };

        // Setting variables for calculation disance between pupils
        let distance = getDistance(pupils.left, pupils.right);
        let irisWidthInMM = 12.0;
        let pupilWidth = Math.min(pupils.left.width, pupils.right.width);
        let pd = (irisWidthInMM / pupilWidth) * distance;

        // Drawing result of pupils distance on canvas
        canvasCtx.font = "20px Arial";
        canvasCtx.fillStyle = "#4379b8";
        canvasCtx.fillRect(canvasElement.width / 2 - 300, 20, 100, 50);
        canvasCtx.fillStyle = "#fff";
        canvasCtx.fillText(
          "PD: " + pd.toFixed(0),
          canvasElement.width / 2 - 280,
          50
        );

        // Drawing Face Mesh results of pupils on canvas
        canvasCtx.fillStyle = "#4379b8";
        // Left
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]].x * width - 2,
          results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]].y * height -
            2,
          4,
          4
        );
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]].x * width - 2,
          results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]].y * height -
            2,
          4,
          4
        );
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[1][0]].x * width - 2,
          results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[1][0]].y * height -
            2,
          4,
          4
        );
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[3][0]].x * width - 2,
          results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[3][0]].y * height -
            2,
          4,
          4
        );
        canvasCtx.fillRect(
          pupils.left.x * width - 2,
          pupils.left.y * height - 2,
          4,
          4
        );
        // Right
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]].x * width -
            2,
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]].y * height -
            2,
          4,
          4
        );
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]].x * width -
            2,
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]].y * height -
            2,
          4,
          4
        );
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[1][0]].x * width -
            2,
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[1][0]].y * height -
            2,
          4,
          4
        );
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[3][0]].x * width -
            2,
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[3][0]].y * height -
            2,
          4,
          4
        );
        canvasCtx.fillRect(
          pupils.right.x * width - 2,
          pupils.right.y * height - 2,
          4,
          4
        );

        // Drawing Face Mesh landmarks of iris and face oval on canvas (and tessellation if you want)
        for (const landmarks of results.multiFaceLandmarks) {
          // drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
          //   color: "#C0C0C070",
          //   lineWidth: 1,
          // });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {
            color: "#FF3030",
            lineWidth: 1,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {
            color: "#FF3030",
            lineWidth: 1,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
            color: "#E0E0E0",
          });
        }
      }
      canvasCtx.restore();
    };

    // Starting new Face Mesh
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(onResults);

    // Starting new camera
    const videoElement = webcamRef.current;
    if (
      imgSrc === null &&
      typeof videoElement !== "undefined" &&
      videoElement !== null
    ) {
      const camera = new Camera(videoElement.video, {
        onFrame: async () => {
          await faceMesh.send({ image: videoElement.video });
        },
        width: width,
        height: height,
      });
      camera.start();
      document.querySelector(".container-img").style.display = "none";
    }
    return () => {};
  }, [imgSrc]);

  // Function to capture image from canvas with Face Mesh and hide video section
  const capturePhoto = () => {
    document.querySelector(".container-img").style.display = "flex";
    const canvas = document.querySelector("#output-canvas");
    const data = canvas.toDataURL("image/png");
    setImgSrc(data);
    document.querySelector(".container-display").style.display = "none";
  };

  // Function to reset image source and showing back video section
  const resetPhoto = () => {
    setImgSrc(null);
    document.querySelector(".container-display").style.display = "flex";
  };

  // DOM elements which shows depending on what's happening in app
  return (
    <Fragment>
      <div className="container-app">
        <div className="container-downloading">
          <h1>Downloading...</h1>
          <img
            src="/images/imvi-logo.png"
            id="imvi-logo"
            alt="imvi labs logo"
          ></img>
        </div>
        <div className="container-display">
          <div className="container-video" style={{ display: "none" }}>
            <Webcam
              ref={webcamRef}
              videoConstraints={videoConstraints}
              width={width}
              height={height}
              audio={false}
              imageSmoothing={true}
              screenshotFormat="image/jpeg"
              id="input-video"
              className="result"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                display: "none",
              }}
            />{" "}
            <canvas
              ref={canvasRef}
              id="output-canvas"
              className="result"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: width,
                height: height,
              }}
            ></canvas>{" "}
            <button
              id="capture-btn"
              onClick={(ev) => {
                capturePhoto();
                ev.preventDefault();
              }}
            >
              Capture photo
            </button>
          </div>
        </div>
        <div className="container-img">
          <img src={imgSrc} className="result" id="photo" alt="screenshot" />
          <button
            id="retake-btn"
            onClick={(ev) => {
              resetPhoto();
              ev.preventDefault();
            }}
          >
            Retake
          </button>
        </div>
        <div className="container-info" style={{ display: "none" }}>
          <p>
            Best result can be achieved, when the face is about 40 cm from the
            camera.
          </p>
          <p>Sit very still and don't move your head, then take a picture.</p>
          <p>
            The result number on snapshot is your approximate distance between
            the pupils.
          </p>
          <p>
            You can retake the picture as many times as you want.
          </p>
          <p>
            It is good to take the picture a few times and calculate the
            average.
          </p>
          <p>
            (Add all numbers and then divide sum by the count of those numbers.)
          </p>
          <p>
            You can save pictures locally on your computer if you want.
          </p>   
          <p>
            (Right-click on the picture and choose "Save image as..." from menu.)
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default WebcamImg;

// document.querySelector("#input-video").style.display = "none";
