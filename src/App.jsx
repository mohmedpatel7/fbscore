import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Navbar from "./components/Genral/Navbar";
import MobileNavbar from "./components/Genral/MobileNav";
//import Footer from "./components/Genral/Footer";
import AdminSignin from "./components/Admin/AdminSignin";
import Reports from "./components/Admin/Reports";
import Requests from "./components/Admin/Requests";
import Graph from "./components/Admin/Graph";
import PostMaintain from "./components/Admin/PostsMaintian";
import Posts from "./components/Post/Posts";
import TeamPosts from "./components/Post/TeamPosts";
import UserPosts from "./components/Post/UserPosts";
import Signup from "./components/Authentication/Signup";
import Signin from "./components/Authentication/Signin";
import Otpverify from "./components/Authentication/Otpverify";
import PlayerProfile from "./components/Authentication/PlayerProfile";
import RequestModel from "./components/Authentication/RequestModel";
import PlayerTeam from "./components/Authentication/PlyerTeam";
import PlayerMatchDetails from "./components/Authentication/PlayerMatchDetails";
import PlayerOtherTeamProfile from "./components/Authentication/PlayerOtherTeamProfile";
import OtherPlayerProfile from "./components/Authentication/OtherPlayerProfile";
import UpdateUserProfile from "./components/Authentication/UpdateUserProfile";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import UploadPost from "./components/Post/UploadPost";
import UploadTeamPost from "./components/Post/UploadTeamPost";
import SignupLandPage from "./components/Genral/Signuplandpage";
import SigninLandPage from "./components/Genral/Signinlandpage";
import SearchData from "./components/Genral/SearchData";
import Matches from "./components/Genral/Matches";
import CommonMatchDetails from "./components/Genral/CommonMatchDetails";
import CommonTeamProfile from "./components/Genral/CommonTeamProfile";
import CommonUser from "./components/Genral/CommonUser";
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
import MatchList from "./components/Match/MatchList";
import MatchDetails from "./components/Match/MatchDetails";
import MatchStatusUpdate from "./components/Match/MatchStatusUpdate";
import MatchStatsUpdate from "./components/Match/MatchStatsUpdate";
import MatchMvp from "./components/Match/MatchMvp";

function App() {
  const [showModal, setShowModal] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Router>
      {/* Conditional Navbar Rendering */}
      {isMobile ? (
        <MobileNavbar setShowModal={setShowModal} />
      ) : (
        <Navbar setShowModal={setShowModal} />
      )}

      <Routes>
        {/**Admin routes */}
        <Route exact path="/AdminSignin" element={<AdminSignin />} />
        <Route exact path="/Reports" element={<Reports />} />
        <Route exact path="/Requests" element={<Requests />} />
        <Route exact path="/Graph" element={<Graph />} />
        <Route exact path="/PostMaintain" element={<PostMaintain />} />

        <Route exact path="/" element={<Posts />} />
        <Route exact path="/TeamPosts" element={<TeamPosts />} />
        <Route exact path="/UserPosts" element={<UserPosts />} />
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
        <Route exact path="/UploadTeamPost" element={<UploadTeamPost />} />
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
        <Route
          exact
          path="/MatchOperations/:matchId"
          element={<MatchOperations />}
        />
        <Route exact path="/MatchList" element={<MatchList />} />
        <Route exact path="/MatchDetails/:matchId" element={<MatchDetails />} />
        <Route
          exact
          path="/MatchStatusUpdate/:matchId"
          element={<MatchStatusUpdate />}
        />
        <Route
          exact
          path="/MatchStatsUpdate/:matchId"
          element={<MatchStatsUpdate />}
        />
        <Route exact path="/MatchMvp/:matchId" element={<MatchMvp />} />

        <Route exact path="/Matches" element={<Matches />} />
        <Route
          exact
          path="/CommonMatchDetails/:matchId"
          element={<CommonMatchDetails />}
        />
        <Route exact path="/SearchData" element={<SearchData />} />
        <Route
          exact
          path="/CommonTeamProfile/:teamid"
          element={<CommonTeamProfile />}
        />
        <Route exact path="/CommonUser/:userId" element={<CommonUser />} />
      </Routes>
      <RequestModel showModal={showModal} setShowModal={setShowModal} />

      {/*<Footer />*/}
    </Router>
  );
}

export default App;
