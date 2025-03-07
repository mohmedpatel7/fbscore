import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeamDetails } from "../../Redux/fetures/Teamslice";
import { useNavigate } from "react-router-dom";

export default function TeamProfile() {
  const isTeamOwner = localStorage.getItem("teamtoken");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teamData } = useSelector((state) => state.teamSlice);

  useEffect(() => {
    if (isTeamOwner) {
      dispatch(fetchTeamDetails()).catch(() =>
        showToast("Error while fetching team details!", "danger")
      );
    }
  }, [dispatch, isTeamOwner]);

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        {/* Three Dots Dropdown Menu */}
        <div className="position-absolute top-0 end-0 mt-2 me-2">
          <div className="dropdown">
            <button
              className="btn btn-light border-0"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
            >
              <li>
                <button
                  className="dropdown-item "
                  onClick={() => navigate("/UpdateTeamProfile")}
                >
                  Edit
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="row align-items-center">
          {/* Left Side - Team Image & Name */}
          <div className="col-md-4 text-center">
            <img
              src={teamData?.team?.teamlogo}
              alt={teamData?.team?.teamname}
              className="rounded-circle"
              style={{
                width: "140px",
                height: "140px",
                objectFit: "cover",
              }}
            />
            <h4 className="mt-3 fw-bold">{teamData?.team?.teamname}</h4>
          </div>

          {/* Vertical Line */}
          <div className="col-md-1 d-none d-md-block">
            <div
              className="vr"
              style={{ height: "100%", width: "2px", backgroundColor: "#ddd" }}
            ></div>
          </div>

          {/* Right Side - Team Details */}
          <div className="col-md-7">
            <div className="row">
              {/* Contact Details */}
              <div className="col-12 mb-3">
                <h5 style={{ color: "#45b469" }}>Contact Details</h5>
                <hr />
                <p className="mb-1">
                  <strong>Email:</strong> {teamData?.team?.email}
                </p>
                <p className="mb-1">
                  <strong>Owner:</strong> {teamData?.team?.createdBy}
                </p>
              </div>

              {/* Team Information */}
              <div className="col-12">
                <h5 style={{ color: "#45b469" }}>Team Information</h5>
                <hr />
                <p className="mb-1">
                  <strong>Country:</strong> {teamData?.team?.country}
                </p>
                <p className="mb-1">
                  <strong>Created At:</strong>{" "}
                  {new Date(teamData?.team?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Line for Mobile View */}
        <div className="d-md-none mt-3">
          <hr />
        </div>
      </div>
    </div>
  );
}
