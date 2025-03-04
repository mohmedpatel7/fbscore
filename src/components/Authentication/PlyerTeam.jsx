import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";
import { fetchUserDetails } from "../../Redux/fetures/authentication";
import { useNavigate } from "react-router-dom";

export default function PlyerTeam() {
  const [activeTab, setActiveTab] = useState("matches");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isUser = localStorage.getItem("usertoken");

  const { data } = useSelector((state) => state.authSlice);

  useEffect(() => {
    try {
      dispatch(fetchUserDetails());
    } catch (error) {
      showToast(error.message || "Error while feching profile!", "danger");
    }
  }, [dispatch]);

  return (
    <div>
      {isUser && data?.playerDetails?.teamname && (
        <div className="container">
          <div className="card p-3 d-flex flex-row align-items-center mt-3 mb-3 team-profile">
            <img
              src={data.playerDetails?.teamlogo}
              alt={data.playerDetails?.teamname}
              className="rounded-circle me-3"
              style={{
                height: "150px",
                width: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <h4>{data.playerDetails?.teamname}</h4>
              <p className="text-muted mb-1">
                <strong>Owner:</strong> {data.playerDetails?.teamowner}
              </p>
              <p className="text-muted mb-1">
                <strong>Email:</strong> {data.playerDetails?.teamemail}
              </p>
              <p className="text-muted">
                <strong>Country:</strong> {data.playerDetails?.teamcountry}
              </p>
            </div>
          </div>

          {/* Navbar */}
          <ul className="nav nav-tabs mt-3 d-flex flex-nowrap overflow-auto">
            {["matches", "Teammates"].map((tab) => (
              <li key={tab} className="nav-item">
                <button
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          {activeTab === "matches" && <div></div>}
        </div>
      )}
    </div>
  );
}
