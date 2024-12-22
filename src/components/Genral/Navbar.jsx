import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { Dropdown } from "react-bootstrap";
import Default_Pic from "./style/pic.jpg";
import { useToast } from "./ToastContext";

export default function Navbar() {
  const navigate = useNavigate(); // naviagate object..
  const { showToast } = useToast();

  const isUser = localStorage.getItem("token");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light ">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand me-4" to="/">
          FbScore
        </Link>

        {/* Toggler */}
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

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav w-100 d-flex justify-content-between align-items-center">
            <div className="d-flex">
              {/* Links Section */}
              <li className="nav-item me-3 mt-2 ms-1">
                <Link className="nav-link " to="/">
                  Post
                </Link>
              </li>
              <li className="nav-item me-3 mt-2">
                <Link className="nav-link" to="/features">
                  Match
                </Link>
              </li>
              <li className="nav-item me-3 mt-2">
                <Link className="nav-link" to="/pricing">
                  Team
                </Link>
              </li>
            </div>

            {/* Vertical Line and Buttons */}
            <div className="d-flex align-items-center">
              {/* Search Button */}
              <button className="btn-search me-2">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <div className="vr me-3"></div> {/* Vertical line */}
              {!isUser && (
                <>
                  <button
                    className="btn btn-signin me-2"
                    type="button"
                    onClick={() => navigate("/Signin")}
                  >
                    Sign In
                  </button>
                  <button
                    className="btn btn-signup"
                    type="button"
                    onClick={() => navigate("/Signup")}
                  >
                    Sign Up
                  </button>
                </>
              )}
              {isUser && (
                <>
                  <button
                    className="btn btn-primary me-2 ms-2"
                    onClick={() => navigate("/")}
                  >
                    Post
                  </button>

                  {/* Profile part*/}
                  <Dropdown>
                    <Dropdown.Toggle variant="light">
                      <img src={Default_Pic} alt="Profile" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <button className="btn">Profile</button>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <button
                          className="btn"
                          onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                            showToast("Singout Successfuly", "success");
                          }}
                        >
                          Sign Out
                        </button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}
