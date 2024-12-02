import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { Home } from "./components/Home";

const App = () => {
  return (
    <Router>
      <div className="con1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* You can add a default route or redirect if needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
