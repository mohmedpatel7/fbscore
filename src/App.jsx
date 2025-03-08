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
import PlayerTeam from "./components/Authentication/PlyerTeam";
import PlayerMatchDetails from "./components/Authentication/PlayerMatchDetails";
import PlayerOtherTeamProfile from "./components/Authentication/PlayerOtherTeamProfile";
import OtherPlayerProfile from "./components/Authentication/OtherPlayerProfile";
import UpdateUserProfile from "./components/Authentication/updateUserProfile";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import UploadPost from "./components/Post/UploadPost";
import SignupLandPage from "./components/Genral/Signuplandpage";
import SigninLandPage from "./components/Genral/Signinlandpage";
import Matches from "./components/Genral/Matches";
import CommonMatchDetails from "./components/Genral/CommonMatchDetails";
import TeamSignup from "./components/Team/TeamSignup";
import TeamSignin from "./components/Team/TeamSignin";
import TeamOtpverify from "./components/Team/TeamOtpverify";
import Dashboard from "./components/Team/Dashboard";
import TeamPlayerProfile from "./components/Team/TeamPlayerProfile";
import TeamMatchDetails from "./components/Team/TeamMatchDetails";
import TeamProfile from "./components/Team/TeamProfile";
import OtherTeamProfile from "./components/Team/OtherTeamProfile";
import TeamForgotPassword from "./components/Team/TeamForgotPassword";
import UpdateTeamProfile from "./components/Team/UpdateTeamProfile";
import MatchOfficialSignup from "./components/Match/MatchOfficialSignup";
import MatchOfficialSignin from "./components/Match/MatchOfficialSignin";
import MatchOfficialOtpverify from "./components/Match/MatchOfficialOtpverify";
import MatchOfficialForgotPassword from "./components/Match/MatchOfficialForgorPassword";
import MatchCreate from "./components/Match/MatchCreate";
import MatchOperations from "./components/Match/MatchOpration";
import MatchList from "./components/Match/MatchLIst";

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
        <Route
          exact
          path="/PlayerMatchDetails/:matchId"
          element={<PlayerMatchDetails />}
        />
        <Route
          exact
          path="/PlayerOtherTeamProfile/:teamid"
          element={<PlayerOtherTeamProfile />}
        />
        <Route
          exact
          path="/OtherPlayerProfile/:playerId"
          element={<OtherPlayerProfile />}
        />
        <Route
          exact
          path="/UpdateUserProfile"
          element={<UpdateUserProfile />}
        />
        <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
        <Route exact path="/Upload" element={<UploadPost />} />
        <Route exact path="/SignupLandPage" element={<SignupLandPage />} />
        <Route exact path="/SigninLandPage" element={<SigninLandPage />} />
        <Route exact path="/Teamsignup" element={<TeamSignup />} />
        <Route exact path="/TeamSignin" element={<TeamSignin />} />
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
          path="/TeamForgotPassword"
          element={<TeamForgotPassword />}
        />
        <Route
          exact
          path="/UpdateTeamProfile"
          element={<UpdateTeamProfile />}
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
        <Route
          exact
          path="/MatchOfficialForgotPassword"
          element={<MatchOfficialForgotPassword />}
        />
        <Route exact path="/MatchCreate" element={<MatchCreate />} />
        <Route exact path="/MatchOperations" element={<MatchOperations />} />
        <Route exact path="/MatchList" element={<MatchList />} />

        <Route exact path="/Matches" element={<Matches />} />
        <Route
          exact
          path="/CommonMatchDetails/:matchId"
          element={<CommonMatchDetails />}
        />
      </Routes>
      <RequestModel showModal={showModal} setShowModal={setShowModal} />

      {/*<Footer />*/}
    </Router>
  );
}

export default App;
