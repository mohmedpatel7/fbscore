import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Genral/Navbar";
//import Footer from "./components/Genral/Footer";
import Posts from "./components/Post/Posts";
import Signup from "./components/Authentication/Signup";
import Signin from "./components/Authentication/Signin";
import Otpverify from "./components/Authentication/Otpverify";
import UploadPost from "./components/Post/UploadPost";
import SignupLandPage from "./components/Genral/Signuplandpage";
import SigninLandPage from "./components/Genral/Signinlandpage";
import TeamSignup from "./components/Team/TeamSignup";
import TeamSignin from "./components/Team/TeamSignin";
import TeamOtpverify from "./components/Team/TeamOtpverify";
import Dashboard from "./components/Team/Dashboard";
import MatchOfficialSignup from "./components/Match/MatchOfficialSignup";
import MatchOfficialSignin from "./components/Match/MatchOfficialSignin";
import MatchOfficialOtpverify from "./components/Match/MatchOfficialOtpverify";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route exact path="/" element={<Posts />} />
        <Route exact path="/Signup" element={<Signup />} />
        <Route exact path="/Signin" element={<Signin />} />
        <Route exact path="/OtpVerify" element={<Otpverify />} />
        <Route exact path="/Upload" element={<UploadPost />} />
        <Route exact path="/SignupLandPage" element={<SignupLandPage />} />
        <Route exact path="/SigninLandPage" element={<SigninLandPage />} />
        <Route exact path="/Teamsignup" element={<TeamSignup />} />
        <Route exact path="/Teamsignin" element={<TeamSignin />} />
        <Route exact path="/Teamotpverify" element={<TeamOtpverify />} />
        <Route exact path="/TeamDashboard" element={<Dashboard />} />
        <Route
          exact
          path="/Matchofficialsignup"
          element={<MatchOfficialSignup />}
        />
        <Route
          exact
          path="/Matchofficialsignin"
          element={<MatchOfficialSignin />}
        />
        <Route
          exact
          path="/Matchofficialotpverify"
          element={<MatchOfficialOtpverify />}
        />
      </Routes>

      {/*<Footer />*/}
    </Router>
  );
}

export default App;
