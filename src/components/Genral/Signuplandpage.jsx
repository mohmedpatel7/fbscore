import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css"; // Keep your custom styles

const SignupLandPage = () => {
  const navigate = useNavigate();

  // Role selection handler
  const handleRoleSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Choose Your Role For Registration</h2>
      <div className="row justify-content-center">
        {[
          {
            role: "Team Owner",
            path: "/Teamsignup",
            icon: "fa-solid fa-user-tie fa-roles",
            description: [
              "Create and manage your own team.",
              "Add or remove players from your team.",
              "Schedule and manage team matches.",
            ],
          },
          {
            role: "Player",
            path: "/Signup",
            icon: "fa-solid fa-person-running fa-roles",
            description: [
              "Join a team as a player.",
              "View match schedules and results.",
              "Track your individual performance stats.",
            ],
          },
          {
            role: "Match Official",
            path: "/Matchofficialsignup",
            icon: "fa-solid fa-users fa-roles",
            description: [
              "Officiate matches and ensure fair play.",
              "Record match results and update scores.",
              "Manage disputes and enforce match rules.",
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

export default SignupLandPage;
