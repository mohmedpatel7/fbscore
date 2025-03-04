import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Genral/Navbar";
//import Footer from "./components/Genral/Footer";
import Posts from "./components/Post/Posts";
import Signup from "./components/Authentication/Signup";
import Signin from "./components/Authentication/Signin";
import Otpverify from "./components/Authentication/Otpverify";
import PlayerProfile from "./components/Authentication/PlayerProfile";
import RequestModel from "./components/Authentication/RequestModel";
import UploadPost from "./components/Post/UploadPost";
import SignupLandPage from "./components/Genral/Signuplandpage";
import SigninLandPage from "./components/Genral/Signinlandpage";
import TeamSignup from "./components/Team/TeamSignup";
import TeamSignin from "./components/Team/TeamSignin";
import TeamOtpverify from "./components/Team/TeamOtpverify";
import Dashboard from "./components/Team/Dashboard";
import TeamPlayerProfile from "./components/Team/TeamPlayerProfile";
import TeamMatchDetails from "./components/Team/TeamMatchDetails";
import TeamProfile from "./components/Team/TeamProfile";
import OtherTeamProfile from "./components/Team/OtherTeamProfile";
import PlayerTeam from "./components/Authentication/PlyerTeam";
import MatchOfficialSignup from "./components/Match/MatchOfficialSignup";
import MatchOfficialSignin from "./components/Match/MatchOfficialSignin";
import MatchOfficialOtpverify from "./components/Match/MatchOfficialOtpverify";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Router>
      <Navbar setShowModal={setShowModal} />

      <Routes>
        <Route exact path="/" element={<Posts />} />
        <Route exact path="/Signup" element={<Signup />} />
        <Route exact path="/Signin" element={<Signin />} />
        <Route exact path="/OtpVerify" element={<Otpverify />} />
        <Route exact path="/Playerprofile" element={<PlayerProfile />} />
        <Route exact path="/Upload" element={<UploadPost />} />
        <Route exact path="/SignupLandPage" element={<SignupLandPage />} />
        <Route exact path="/SigninLandPage" element={<SigninLandPage />} />
        <Route exact path="/Teamsignup" element={<TeamSignup />} />
        <Route exact path="/Teamsignin" element={<TeamSignin />} />
        <Route exact path="/Teamotpverify" element={<TeamOtpverify />} />
        <Route exact path="/TeamDashboard" element={<Dashboard />} />
        <Route exact path="/Teamprofile" element={<TeamProfile />} />
        <Route exact path="/PlayerTeam" element={<PlayerTeam />} />
        <Route
          exact
          path="/TeamPlayerProfile/:playerId"
          element={<TeamPlayerProfile />}
        />
        <Route
          exact
          path="/TeamMatchDetails/:matchId"
          element={<TeamMatchDetails />}
        />
        <Route
          exact
          path="/OtherTeamProfile/:teamid"
          element={<OtherTeamProfile />}
        />
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
      <RequestModel showModal={showModal} setShowModal={setShowModal} />

      {/*<Footer />*/}
    </Router>
  );
}

export default App;
