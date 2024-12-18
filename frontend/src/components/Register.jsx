import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";

import { useSearchParams } from "react-router-dom";
import { registerface } from "./services/api";

const Register = () => {
  const webcamRef = useRef(null);
  const overlayRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(0);
  const [searchParams] = useSearchParams();
  const userid = searchParams.get("userid");
  const batch = searchParams.get("batch");

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        setModelsLoaded(true);
        console.log("Models loaded successfully for registration");
      } catch (error) {
        console.error("Error loading models for registration", error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      const interval = setInterval(async () => {
        if (webcamRef.current && overlayRef.current) {
          const video = webcamRef.current.video;

          if (video && !video.paused && !video.ended) {
            const detections = await faceapi
              .detectAllFaces(video)
              .withFaceLandmarks()
              .withFaceDescriptors();

            if (detections.length > 0) {
              const { x, y, width, height } = detections[0].detection.box;
              drawOval(x + width / 2, y + height / 2, width, height);
              setFaceDetected(true);
            } else {
              clearCanvas();
              setFaceDetected(false);
            }
          }
        }
      }, 100); // Adjust interval as needed for performance

      return () => clearInterval(interval);
    }
  }, [modelsLoaded]);

  const drawOval = (cx, cy, width, height) => {
    const canvas = overlayRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = webcamRef.current.video.videoWidth;
    canvas.height = webcamRef.current.video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.ellipse(cx, cy, width * 0.6, height * 0.8, 0, 0, 2 * Math.PI); // Adjusted scaling
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
    ctx.stroke();
  };

  const clearCanvas = () => {
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext("2d");
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
  };

  const saveFaceDescriptor = async () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        const faceDescriptor = detections[0].descriptor;

        try {
          const resp = await registerface({
            userId: userid,
            faceInfo: Array.from(faceDescriptor),
          });
          console.log(resp);
          setRegistrationSuccess(1);
          window.open(
            `http://localhost:5173/login?userid=${userid}&batch=${batch}`,
            "_blank"
          );
        } catch (error) {
          console.error("Error in registering face data:", error);
          setRegistrationSuccess(2);
        }
      } else {
        setRegistrationSuccess(2);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 quicksand">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Register with IdentiQ
      </h2>
      <div className="absolute h-1/2 w-screen phonebg1 top-20"></div>

      <div className="relative w-full max-w-md">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-lg shadow-md w-full border border-gray-300 p-4"
        />
        <canvas
          ref={overlayRef}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>
      <button
        onClick={saveFaceDescriptor}
        disabled={!modelsLoaded}
        className="mt-6 py-1 border-b border-black transition duration-200 hover:font-bold"
      >
        Register
      </button>

      <div className="absolute right-2 rounded-xl bg-gray-200 flex flex-col justify-center items-center py-1 px-2 top-2">
        {faceDetected && (
          <p className=" text-md font-medium text-green-700">Face Detected</p>
        )}
        {registrationSuccess === 1 && (
          <p className=" text-md font-medium text-green-700">
            Registration Successful!
          </p>
        )}
        {registrationSuccess === 2 && (
          <p className=" text-md font-medium text-red-700">
            Registration Unsuccessful!
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
