import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css"; // Keep your custom styles

const SigninLandPage = () => {
  const navigate = useNavigate();

  // Role selection handler
  const handleRoleSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Choose Your Role to Sign In</h2>
      <div className="row justify-content-center">
        {[
          {
            role: "Team Owner",
            path: "/TeamSignin",
            icon: "fa-solid fa-user-tie fa-roles",
            description: [
              "Manage your team and players.",
              "Schedule and oversee team matches.",
              "Track team performance and stats.",
            ],
          },
          {
            role: "Player",
            path: "/Signin",
            icon: "fa-solid fa-person-running fa-roles",
            description: [
              "Access your team dashboard.",
              "View match schedules and stats.",
              "Update personal and performance info.",
            ],
          },
          {
            role: "Match Official",
            path: "/Matchofficialsignin",
            icon: "fa-solid fa-users fa-roles",
            description: [
              "Sign in to officiate matches.",
              "Update match results and reports.",
              "Ensure fair play and rule enforcement.",
            ],
          },
        ].map(({ role, path, icon, description }) => (
          <div key={role} className="col-md-4">
            <div
              className="card text-center p-4 shadow-lg"
              style={{ cursor: "pointer", height: "300px" }}
              onClick={() => handleRoleSelect(path)}
            >
              <div className="card-body">
                <i className={`${icon} fa-3x mb-3`}></i>
                <h5 className="card-title">{role}</h5>
                <ul className="text-start">
                  {description.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SigninLandPage;
