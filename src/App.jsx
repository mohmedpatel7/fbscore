import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Genral/Navbar";
import Footer from "./components/Genral/Footer";
import Posts from "./components/Post/Posts";
import Signup from "./components/Authentication/Signup";
import Signin from "./components/Authentication/Signin";
import Otpverify from "./components/Authentication/Otpverify";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route exact path="/" element={<Posts />} />
        <Route exact path="/Signup" element={<Signup />} />
        <Route exact path="/Signin" element={<Signin />} />
        <Route exact path="/OtpVerify" element={<Otpverify />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
