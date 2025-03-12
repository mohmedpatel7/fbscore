import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { Dropdown } from "react-bootstrap";
import Default_Pic from "./style/pic.jpg";
import { useToast } from "./ToastContext";
import { BsPlus } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserDetails } from "../../Redux/fetures/authentication";
import { fetchTeamDetails } from "../../Redux/fetures/Teamslice";

export default function Navbar({ setShowModal }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const isUser = !!localStorage.getItem("usertoken");
  const isTeamOwner = !!localStorage.getItem("teamtoken");
  const isMatchOfficial = !!localStorage.getItem("matchOfficialtoken");
  const isAmdin = !!localStorage.getItem("admintoken");

  const { data } = useSelector((state) => state.authSlice);
  const { teamData } = useSelector((state) => state.teamSlice);

  useEffect(() => {
    if (isUser) {
      dispatch(fetchUserDetails()).catch((error) => {
        console.error("Error fetching user details:", error);
      });
    }

    if (isTeamOwner) {
      dispatch(fetchTeamDetails()).catch((error) => {
        console.error("Error fetching team details:", error);
      });
    }
  }, [dispatch, isUser, isTeamOwner]);

  const handleSignOut = () => {
    const ask = window.confirm("Are you sure?");
    if (ask) {
      localStorage.removeItem("usertoken");
      localStorage.removeItem("teamtoken");
      localStorage.removeItem("matchOfficialtoken");
      localStorage.removeItem("admintoken");

      navigate("/");
      showToast("Signout Successful", "success");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand me-4" to="/">
          FbScore
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav w-100 d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <li className="nav-item me-3 mt-2 ms-1">
                <Link className="nav-link" to="/">
                  Post
                </Link>
              </li>
              <li className="nav-item me-3 mt-2">
                <Link className="nav-link" to="/Matches">
                  Match
                </Link>
              </li>
              {isTeamOwner && (
                <>
                  <li className="nav-item me-3 mt-2">
                    <Link className="nav-link" to="/TeamDashboard">
                      Team
                    </Link>
                  </li>
                  <li className="nav-item me-3 mt-2">
                    <Link className="nav-link" to="/TeamPosts">
                      Your Posts
                    </Link>
                  </li>
                </>
              )}
              {isUser && (
                <>
                  <li className="nav-item me-3 mt-2">
                    <Link className="nav-link" to="/PlayerTeam">
                      Team
                    </Link>
                  </li>
                  <li className="nav-item me-3 mt-2">
                    <Link className="nav-link" to="/UserPosts">
                      Your Posts
                    </Link>
                  </li>
                </>
              )}

              {isMatchOfficial && (
                <>
                  <li className="nav-item me-3 mt-2">
                    <Link className="nav-link" to="/MatchCreate">
                      Create Match
                    </Link>
                  </li>
                  <li className="nav-item me-3 mt-2">
                    <Link className="nav-link" to="/MatchList">
                      Matches
                    </Link>
                  </li>
                </>
              )}

              {isAmdin && (
                <>
                  <li className="nav-item me-3 mt-2">
                    <Link className="nav-link" to="/Reports">
                      Genral Reports
                    </Link>
                  </li>
                </>
              )}
            </div>

            <div className="d-flex align-items-center">
              <button
                className="btn-search me-2"
                onClick={() => navigate("/SearchData")}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <div className="vr me-3"></div>

              {/* Conditional Rendering */}
              {isUser ? (
                <>
                  {/* Upload Button for User */}
                  <button
                    className="btn btn-ps p-3 d-flex align-items-center justify-content-center ms-3 mt-1 me-1"
                    onClick={() => navigate("/Upload")}
                    style={{
                      width: "57px",
                      height: "43px",
                      backgroundColor: "#eee",
                      borderRadius: "5px",
                    }}
                  >
                    <BsPlus style={{ fontSize: "30px", color: "#000" }} />
                  </button>

                  {/* Profile Dropdown for User */}
                  <Dropdown>
                    <Dropdown.Toggle variant="light">
                      <img
                        src={data?.pic || Default_Pic}
                        alt="Profile"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <button
                          className="btn"
                          onClick={() => navigate("/Playerprofile")}
                        >
                          Profile
                        </button>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <button
                          className="btn"
                          onClick={() => setShowModal(true)}
                        >
                          Requests
                        </button>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <button className="btn" onClick={handleSignOut}>
                          Sign Out
                        </button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : isTeamOwner ? (
                <>
                  {/* Upload Button for Team Owner */}
                  <button
                    className="btn btn-ps p-3 d-flex align-items-center justify-content-center ms-3 mt-1 me-1"
                    onClick={() => navigate("/UploadTeamPost")}
                    style={{
                      width: "57px",
                      height: "43px",
                      backgroundColor: "#eee",
                      borderRadius: "5px",
                    }}
                  >
                    <BsPlus style={{ fontSize: "30px", color: "#000" }} />
                  </button>

                  {/* Profile Dropdown for Team Owner */}
                  <Dropdown>
                    <Dropdown.Toggle variant="light">
                      <img
                        src={teamData?.team?.teamlogo || Default_Pic}
                        alt="Profile"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <button
                          className="btn"
                          onClick={() => navigate("/Teamprofile")}
                        >
                          Profile
                        </button>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <button className="btn" onClick={handleSignOut}>
                          Sign Out
                        </button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : isMatchOfficial ? (
                <>
                  <button
                    className="btn btn-signup me-2"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </>
              ) : isAmdin ? (
                <>
                  {/* Upload Button for admin */}
                  <button
                    className="btn btn-ps p-3 d-flex align-items-center justify-content-center ms-3 mt-1 me-1"
                    onClick={() => navigate("/")}
                    style={{
                      width: "57px",
                      height: "43px",
                      backgroundColor: "#eee",
                      borderRadius: "5px",
                    }}
                  >
                    <BsPlus style={{ fontSize: "30px", color: "#000" }} />
                  </button>

                  {/* Profile Dropdown for Amdin */}
                  <Dropdown>
                    <Dropdown.Toggle variant="light">
                      <img
                        src={teamData?.team?.teamlogo || Default_Pic}
                        alt="Profile"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <button className="btn" onClick={() => navigate("/")}>
                          Profile
                        </button>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <button className="btn" onClick={handleSignOut}>
                          Sign Out
                        </button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <>
                  {/* Sign In and Sign Up Buttons for Unauthenticated Users */}
                  <button
                    className="btn btn-signin me-2"
                    onClick={() => navigate("/SigninLandPage")}
                  >
                    Sign In
                  </button>
                  <button
                    className="btn btn-signup"
                    onClick={() => navigate("/SignupLandPage")}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}
