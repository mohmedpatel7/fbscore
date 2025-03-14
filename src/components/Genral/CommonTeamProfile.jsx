import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchCommonTeams } from "../../Redux/fetures/Teamslice";
import { useParams } from "react-router-dom";
import "./style/style.css";

export default function OtherTeamProfile() {
  const dispatch = useDispatch();
  const { teamid } = useParams();
  const { CommonTeamDetails } = useSelector((state) => state.teamSlice);

  useEffect(() => {
    dispatch(fetchCommonTeams(teamid)).catch(() =>
      showToast("Error while fetching team details!", "danger")
    );
  }, [dispatch, teamid]);

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <div className="row align-items-center">
          {/* Left Side - Team Image & Name */}
          <div className="col-md-4 text-center">
            <img
              src={CommonTeamDetails?.team?.teamlogo}
              alt={CommonTeamDetails?.team?.teamname}
              className="rounded-circle"
              style={{ width: "140px", height: "140px", objectFit: "cover" }}
            />
            <h4 className="mt-3 fw-bold">
              {CommonTeamDetails?.team?.teamname}
            </h4>
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
                <h5 style={{ color: "#50C878" }}>Contact Details</h5>
                <hr />
                <p className="mb-1">
                  <strong>Email:</strong> {CommonTeamDetails?.team?.email}
                </p>
                <p className="mb-1">
                  <strong>Owner:</strong> {CommonTeamDetails?.team?.createdBy}
                </p>
              </div>

              {/* Team Information */}
              <div className="col-12">
                <h5 style={{ color: "#50C878" }}>Team Information</h5>
                <hr />
                <p className="mb-1">
                  <strong>Country:</strong> {CommonTeamDetails?.team?.country}
                </p>
                <p className="mb-1">
                  <strong>Created At:</strong>{" "}
                  {new Date(
                    CommonTeamDetails?.team?.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="col-12 my-3">
          <hr />
        </div>

        {/* Match Stats - Total Matches & Wins */}
        <div className="row text-center">
          <div className="col-md-6">
            <h5 style={{ color: "#50C878" }}>Total Matches</h5>
            <p className="fw-bold">
              {CommonTeamDetails?.team?.totalMatches || 0}
            </p>
          </div>

          {/* Vertical Line */}
          <div className="col-md-1 d-none d-md-block">
            <div
              className="vr"
              style={{ height: "100%", width: "2px", backgroundColor: "#ddd" }}
            ></div>
          </div>

          <div className="col-md-5">
            <h5 style={{ color: "#50C878" }}>Wins</h5>
            <p className="fw-bold">{CommonTeamDetails?.team?.totalWins || 0}</p>
          </div>
        </div>

        {/* Horizontal Line for Mobile View */}
        <div className="d-md-none mt-3">
          <hr />
        </div>

        {/* Squad Section */}
        {CommonTeamDetails?.players?.length > 0 ? (
          <>
            <div className="col-12 mt-4">
              <h4 className="mb-3" style={{ color: "#50C878" }}>
                Squad
              </h4>
            </div>
            {CommonTeamDetails?.players?.map((player) => (
              <div
                key={player.playerId}
                className="card d-flex flex-row align-items-center p-2 mb-2"
              >
                <img
                  src={player?.users?.pic || "default-pic.jpg"}
                  alt={player?.users?.name || "Unknown Player"}
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <div className="ms-3 flex-grow-1">
                  <h6 className="mb-1">{player?.users?.name || "Unknown"}</h6>
                  <small className="text-muted">
                    {player?.users?.position || "Unknown"}
                  </small>
                </div>
                <span className="player-number px-3 py-1">
                  {player.playerNo}
                </span>
              </div>
            ))}
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center">
            <p className="text-muted text-center">Squad is not available!</p>
          </div>
        )}
      </div>
    </div>
  );
}
