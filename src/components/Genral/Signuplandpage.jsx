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

  const roles = [
    {
      role: "Team Owner",
      path: "/Teamsignup",
      icon: "fa-solid fa-user-tie",
      description: [
        "Create and manage your own team",
        "Add or remove players from your team",
        "Schedule and manage team matches",
      ],
    },
    {
      role: "Player",
      path: "/Signup",
      icon: "fa-solid fa-person-running",
      description: [
        "Join a team as a player",
        "View match schedules and results",
        "Track your individual performance stats",
      ],
    },
    {
      role: "Match Official",
      path: "/Matchofficialsignup",
      icon: "fa-solid fa-users",
      description: [
        "Officiate matches and ensure fair play",
        "Record match results and update scores",
        "Manage disputes and enforce match rules",
      ],
    },
  ];

  return (
    <div className="signin-container">
      <div className="container">
        <h1 className="signin-title">Choose Your Role For Registration</h1>
        <div className="row justify-content-center g-4">
          {roles.map(({ role, path, icon, description }) => (
            <div key={role} className="col-md-4">
              <div className="role-card" onClick={() => handleRoleSelect(path)}>
                <div className="card-body p-4">
                  <div className="role-icon">
                    <i className={`${icon} fa-roles`}></i>
                  </div>
                  <h3 className="role-title text-center">{role}</h3>
                  <ul className="role-description">
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
    </div>
  );
};

export default SignupLandPage;
