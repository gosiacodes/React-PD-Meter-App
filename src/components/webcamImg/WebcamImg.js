// Copyright 2023 MediaPipe & Malgorzata Pick
import React, { Fragment, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  FaceMesh,
  // FACEMESH_TESSELATION,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_LEFT_IRIS,
  // FACEMESH_FACE_OVAL,
} from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import Info from "../../components/info/Info";
// import InfoIcon from "../../components/infoIcon/InfoIcon";

const WebcamImg = () => {
  // Global settings
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [PDValue, setPDValue] = useState("");
  const [PDResult, setPDResult] = useState("");
  const [averageValue, setAverageValue] = useState(0);
  const [numbersList, setNumbersList] = useState([]);
  const deviceWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  let width = 640.0;
  let height = 480.0;

  if (deviceWidth < 670 && deviceWidth >= 510) {
    width = 480.0;
    height = 360.0;
  }
  if (deviceWidth < 510 && deviceWidth >= 390) {
    width = 360.0;
    height = 360.0;
  }
  if (deviceWidth < 390) {
    width = 240.0;
    height = 240.0;
  }

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

        // Setting real-time pupillary distance
        setPDValue(pd.toFixed(0));

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

        // Drawing Face Mesh landmarks of iris on canvas (and face oval and tessellation if you want)
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
          // drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
          //   color: "#E0E0E0",
          // });
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
  }, [imgSrc, height, width, deviceWidth]);

  useEffect(() => {}, [numbersList, PDResult]);

  // Function for hiding container with introduction and showing container with info
  const showInfo = () => {
    document.querySelector("#card-1").style.display = "none";
    document.querySelector("#card-2").style.display = "flex";
    document.querySelector(".container-display").style.display = "none";
    document.querySelector(".container-img").style.display = "none";
  };

  // Function for hiding container with info and showing results with video
  const openApp = () => {
    document.querySelector("#card-2").style.display = "none";
    document.querySelector(".container-display").style.display = "flex";
  };

  // Function to capture image from canvas with Face Mesh and hide video section
  const capturePhoto = () => {
    document.querySelector(".container-img").style.display = "flex";
    const canvas = document.querySelector("#output-canvas");
    const data = canvas.toDataURL("image/png");
    setImgSrc(data);
    document.querySelector(".container-display").style.display = "none";
    setPDResult(PDValue);
    const tempNumbers = [...numbersList];
    tempNumbers.push(+PDValue);
    console.log("All numbers: ");
    console.log(tempNumbers);
    setNumbersList(tempNumbers);
    let average = tempNumbers.reduce((a, b) => a + b, 0) / tempNumbers.length;
    console.log("Average: ");
    console.log(average);
    setAverageValue(tempNumbers.length > 0 ? average.toFixed(0) : 0);
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
        <div className="container-card" id="card-1">
          <picture>
            <source
              srcSet={process.env.PUBLIC_URL + "/images/eye-scanner-64.png"}
              media="(max-width: 390px)"
            />
            <source
              srcSet={process.env.PUBLIC_URL + "/images/eye-scanner-96.png"}
              media="(max-width: 670px)"
            />
            <img
              src={process.env.PUBLIC_URL + "/images/eye-scanner-128.png"}
              alt="eye scanner"
            />
          </picture>
          <p>
            You can measure your PD here with this digital test, click the
            button to read instruction.
          </p>
          <button
            id="show-info-btn"
            onClick={(ev) => {
              showInfo();
              ev.preventDefault();
            }}
          >
            Instruction
          </button>
        </div>
        <div className="container-card" id="card-2" style={{ display: "none" }}>
          <div className="container-info">
            <h2 className="info-title">Instruction</h2>
            <Info />
          </div>
          <button
            id="open-app-btn"
            onClick={(ev) => {
              openApp();
              ev.preventDefault();
            }}
          >
            Measure PD
          </button>
        </div>
        <div className="container-display" style={{ display: "none" }}>
          <div className="container-video">
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
            ></canvas>
            <div className="values">
              <p>{"PD: " + PDValue}</p>
              <button
                id="capture-btn"
                onClick={(ev) => {
                  capturePhoto();
                  ev.preventDefault();
                }}
              >
                Take picture
              </button>
              <p>{"Average: " + averageValue}</p>
            </div>
          </div>
        </div>
        <div className="container-img">
          <img src={imgSrc} className="result" id="photo" alt="screenshot" />
          <div className="values">
            <p>{"PD: " + PDResult}</p>
            <button
              id="retake-btn"
              onClick={(ev) => {
                resetPhoto();
                ev.preventDefault();
              }}
            >
              Retake
            </button>
            <p>{"Average: " + averageValue}</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WebcamImg;
