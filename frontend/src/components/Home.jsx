import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FaCircleNodes } from "react-icons/fa6";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { FaApple } from "react-icons/fa";
import { GiMoebiusTriangle } from "react-icons/gi";
import homeimage from "../assets/homeimage.png";
import phoneimage from "../assets/phoneimage.png";

export const Home = () => {
  return (
    <div className="min-h-screen w-screen px-5 pt-3 pb-5 montserrat flex flex-col justify bghome">
      <div className="flex w-full justify-between">
        <div className="font-bold montserrat flex gap-1 items-center">
          <span>
            <GiMoebiusTriangle className="text-lg text-purple-500" />
          </span>{" "}
          IdentiQ
        </div>
        <div className="font-bold flex gap-2">
          <p>Try out</p>
          <div className="p-1 border border-black rounded-full">
            <FaApple className="text-sm" />
          </div>
          <div className="p-1 border border-black rounded-full">
            <IoLogoGooglePlaystore className="text-sm" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center quicksand text-3xl mb-6 mt-12">
        <div className="font-bold flex gap-2 items-center">
          Relaible Face
          <span>
            <FaCircleNodes className="text-purple-500 hover:animate-spin" />
          </span>
          Auth
        </div>
        <h1 className="font-bold">Partner Grounded in Science</h1>
        <h1 className="font-bold bg-gradient-to-r from-purple-600 via-purple-800 to-pink-400 inline-block text-transparent bg-clip-text hover:animate-pulse cursor-pointer">
          Trusted by You.
        </h1>
      </div>
      <div className="h-full flex justify-center ">
        <div className="phonebg h-full w-full absolute top-32 animate-pulse"></div>
        <div className="absolute -z-10 flex">
          <img
            src={homeimage}
            alt=""
            className="h-[290px] w-[150px] relative"
          />
        </div>
        <div className="">
          <img src={phoneimage} alt="" className="h-[300px] w-[173px]" />
        </div>
      </div>
      <nav className="flex justify-center mt-3">
        <ul className="flex text-lg font-bold">
          <li>
            <Link
              to="/register"
              className="border-b border-black p-1 hover:text-xl"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="border-t border-black p-1 hover:text-xl"
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
