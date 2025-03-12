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

  const roles = [
    {
      role: "Team Owner",
      path: "/TeamSignin",
      icon: "fa-solid fa-user-tie",
      description: [
        "Manage your team and players",
        "Schedule and oversee team matches",
        "Track team performance and stats",
      ],
    },
    {
      role: "Player",
      path: "/Signin",
      icon: "fa-solid fa-person-running",
      description: [
        "Access your team dashboard",
        "View match schedules and stats",
        "Update personal and performance info",
      ],
    },
    {
      role: "Match Official",
      path: "/Matchofficialsignin",
      icon: "fa-solid fa-users",
      description: [
        "Sign in to officiate matches",
        "Update match results and reports",
        "Ensure fair play and rule enforcement",
      ],
    },
  ];

  return (
    <div className="signin-container">
      <div className="container">
        <h1 className="signin-title">Choose Your Role to Sign In</h1>
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

export default SigninLandPage;
