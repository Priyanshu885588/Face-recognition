import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { GiMoebiusTriangle } from "react-icons/gi";
import { CgSpinnerTwoAlt } from "react-icons/cg";

const Login = () => {
  const webcamRef = useRef(null);
  const overlayRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loginStatus, setLoginStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setModelsLoaded(true);
        console.log("All models loaded");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  const detectFace = async () => {
    if (webcamRef.current && modelsLoaded) {
      const video = webcamRef.current.video;
      const detection = await faceapi.detectSingleFace(
        video,
        new faceapi.SsdMobilenetv1Options()
      );

      if (detection) {
        const { x, y, width, height } = detection.box;
        drawOval(x + width / 2, y + height / 2, width, height);
      } else {
        clearCanvas(); // Clear overlay if no face is detected
      }
    }
  };

  const verifyFace = async () => {
    setLoading(true);
    if (!modelsLoaded) {
      console.log("Models are not loaded yet.");
      setLoginStatus("Models are still loading...");
      return;
    }

    if (webcamRef.current) {
      const img = webcamRef.current.getScreenshot();
      const imgElement = new Image();
      imgElement.src = img;

      imgElement.onload = async () => {
        const detections = await faceapi
          .detectAllFaces(imgElement)
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          const inputFaceDescriptor = detections[0].descriptor;

          const storedDescriptor = JSON.parse(
            localStorage.getItem("userFaceDescriptor")
          );

          if (storedDescriptor) {
            const distance = faceapi.euclideanDistance(
              inputFaceDescriptor,
              new Float32Array(storedDescriptor)
            );
            console.log("Distance between faces:", distance);

            if (distance < 0.6) {
              setLoginStatus("Login successful!");
              setLoading(false);
            } else {
              setLoginStatus("Login failed. Face not recognized.");
              setLoading(false);
            }
          } else {
            console.log("No user registered. Please register first.");
            setLoginStatus("No user registered. Please register first.");
            setLoading(false);
          }
        } else {
          console.log("No face detected. Please try again.");
          setLoginStatus("No face detected. Please try again.");
          setLoading(false);
        }
      };
    }
  };

  const drawOval = (cx, cy, width, height) => {
    if (overlayRef.current) {
      // Check if overlayRef is defined
      const canvas = overlayRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = webcamRef.current.video.videoWidth;
      canvas.height = webcamRef.current.video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
      ctx.beginPath();
      ctx.ellipse(cx, cy, width / 2, height / 2, 0, 0, 2 * Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // Green color
      ctx.stroke();
    }
  };

  const clearCanvas = () => {
    if (overlayRef.current) {
      // Check if overlayRef is defined
      const canvas = overlayRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => detectFace(), 100); // Check for face every 100ms
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  if (!modelsLoaded) {
    return (
      <div className="h-screen w-screen flex justify-center items-center ">
        <div className="animate-spin absolute -z-10">
          <CgSpinnerTwoAlt className="text-7xl text-purple-900/[0.3]" />
        </div>

        <button className="text-sm montserrat bg-black text-white rounded-full p-1 px-3">
          Loading ...
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 quicksand">
      <div className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        Login with
        <GiMoebiusTriangle className="text-purple-500 ml-3 mr-1" /> IdentiQ
      </div>
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
        className="mt-6 py-1 border-b border-black transition duration-200 hover:font-bold"
        onClick={verifyFace}
        disabled={!modelsLoaded}
      >
        Capture and Login
      </button>
      {loading ? (
        <button className=" animate-spin mt-3">
          <CgSpinnerTwoAlt className="text-base text-purple-900" />
        </button>
      ) : (
        <p className="mt-4 text-gray-700">{loginStatus}</p>
      )}
    </div>
  );
};

export default Login;
