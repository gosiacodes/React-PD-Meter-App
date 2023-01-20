// Copyright 2023 MediaPipe & imvi labs & Malgorzata Pick
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
      // // Hiding container with downloading info and showing results with video and explanation info
      // document.querySelector(".container-downloading").style.display = "none";
      // document.querySelector(".container-video").style.display = "flex";
      // document.querySelector(".container-info").style.display = "flex";

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

  const openApp = () => {
    // Hiding container with downloading info and showing results with video and explanation info
    document.querySelector(".container-downloading").style.display = "none";
    document.querySelector(".container-video").style.display = "flex";
    document.querySelector("#info").style.display = "flex";
  };

  const toggleInfo = () => {
    const coll = document.querySelector(".collapsible");
    const arrow = document.querySelector(".arrow");
    const content = document.querySelector(".content");
    coll.classList.toggle("coll-active");
    arrow.classList.toggle("arr-active");
    content.classList.toggle("hidden");
  };

  // DOM elements which shows depending on what's happening in app
  return (
    <Fragment>
      <div className="container-app">
        <div className="container-downloading">
          <h1>Downloading...</h1>
          <img
            src={process.env.PUBLIC_URL + "/images/imvi-logo.png"}
            id="imvi-logo"
            alt="imvi labs logo"
          ></img>
          <button
            id="open-app-btn"
            onClick={(ev) => {
              openApp();
              ev.preventDefault();
            }}
          >
            Till appen
          </button>
          <div className="container-info">
            <h2>Instruktion</h2>
            <p>
              Bäst resultat kan uppnås när ansiktet är ca 40 cm från kameran.
            </p>
            <p>Se till att det är bra belysning och att kameran är ren.</p>
            <p>Sitt väldigt stilla och rör inte på huvudet.</p>
            <p>
              Titta rakt in i kameran eller på den röda prickan överst och ta en
              bild.
            </p>
            <p>
              Resultatet ovanför bilden är det ungefärliga avståndet mellan
              pupiller.
            </p>
            <p>
              Du kan ta om bilden så många gånger du vill (vänta tills videon
              laddas igen).
            </p>
          </div>
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
                Ta bilden
              </button>
              <p>{"Medel: " + averageValue}</p>
            </div>{" "}
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
              Ta om bilden
            </button>
            <p>{"Medel: " + averageValue}</p>
          </div>
        </div>
        <div className="container-info" id="info" style={{ display: "none" }}>
          <h2
            className="collapsible info-title"
            onClick={(ev) => {
              toggleInfo();
              ev.preventDefault();
            }}
          >
            Instruktion <i class="arrow"></i>
          </h2>
          <div className="content hidden">
            <p>
              Bäst resultat kan uppnås när ansiktet är ca 40 cm från kameran.
            </p>
            <p>Se till att det är bra belysning och att kameran är ren.</p>
            <p>Sitt väldigt stilla och rör inte på huvudet.</p>
            <p>
              Titta rakt in i kameran eller på den röda prickan överst och ta en
              bild.
            </p>
            <p>
              Resultatet ovanför bilden är det ungefärliga avståndet mellan
              pupiller.
            </p>
            <p>
              Du kan ta om bilden så många gånger du vill (vänta tills videon
              laddas igen).
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WebcamImg;
