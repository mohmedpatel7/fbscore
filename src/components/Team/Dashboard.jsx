import React, { useState, useEffect, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  fetchTeamDetails,
  fetchAvailableUsers,
  SendPlayerReq,
  fetchPlayerProfile,
} from "../../Redux/fetures/Teamslice";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";
import { useNavigate } from "react-router-dom";

const TeamDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isPending, startTransition] = useTransition(); // Manage pending state for async transitions
  const [formData, setFormData] = useState({
    playerno: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isTeamOwner = localStorage.getItem("teamtoken");

  const { teamData, availableUsers } = useSelector((state) => state.teamSlice);

  useEffect(() => {
    if (isTeamOwner) {
      dispatch(fetchTeamDetails()).catch(() =>
        showToast("Error while fetching team details!", "danger")
      );
      dispatch(fetchAvailableUsers()).catch(() =>
        showToast("Error while fetching available users!", "danger")
      );
    }
  }, [dispatch, isTeamOwner]);

  // handle send player request.
  const handleSendPlayerReq = async (userId, playerNo, event) => {
    try {
      event.preventDefault(); // Prevent default form submission behavior

      startTransition(async () => {
        try {
          //Dispatch.
          const result = await dispatch(
            SendPlayerReq({ userId, playerNo })
          ).unwrap();
          // If we get here, it's a success
          showToast(
            result?.message || "Player request sent successfully.",
            "success"
          );
          setFormData({ playerno: "" });
          await dispatch(fetchAvailableUsers());
        } catch (error) {
          showToast(error.message || "Error while sending request!", "danger");
        }
      });
    } catch (error) {
      showToast(error.message || " Please try again after few time.", "danger");
    }
  };

  const playerProfileClick = (playerId) => {
    try {
      dispatch(fetchPlayerProfile(playerId)); // Fetch player details
      navigate(`/TeamPlayerProfile/${playerId}`);
    } catch (error) {
      showToast(error.message || "Error while fetching player profile!");
    }
  };

  // Handles input changes and updates formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isPending) return showToast("Please wait!", "warnig");

  const teamDatas = {
    logo: teamData?.team?.teamlogo || "default-logo.png",
    name: teamData?.team?.teamname || "Unknown Team",
    country: teamData?.team?.country || "Unknown",
    owner: teamData?.team?.createdBy || "Unknown",
    email: teamData?.team?.email || "N/A",
    matches: [
      { id: 1, opponent: "Titans FC", result: "Win 2-1", date: "2024-09-01" },
      { id: 2, opponent: "Falcons", result: "Loss 0-1", date: "2024-08-25" },
    ],
  };

  return (
    <div>
      {isTeamOwner && (
        <div className="container mt-4">
          {/* Profile Section */}
          <div className="card p-3 d-flex flex-row align-items-center team-profile">
            <img
              src={teamDatas.logo}
              alt="Team Logo"
              className="rounded-circle me-3"
              style={{
                height: "150px",
                width: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <h4>{teamDatas.name}</h4>
              <p className="text-muted mb-1">
                <strong>Owner:</strong> {teamDatas.owner}
              </p>
              <p className="text-muted mb-1">
                <strong>Email:</strong> {teamDatas.email}
              </p>
              <p className="text-muted">
                <strong>Country:</strong> {teamDatas.country}
              </p>
            </div>
          </div>

          {/* Navbar */}
          <ul className="nav nav-tabs mt-3 d-flex flex-nowrap overflow-auto">
            {["dashboard", "squad", "matches", "recruitment"].map((tab) => (
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

          {/* Tab Content */}
          <div className="mt-3">
            {activeTab === "dashboard" && (
              <div className="card p-3">
                <h5>Team Dashboard</h5>
                <p>Total Matches: {teamDatas.matches.length}</p>
              </div>
            )}

            {activeTab === "squad" && (
              <div className="card card-squad-list p-3">
                <h5 className="mb-3">Squad List</h5>
                <div className="d-flex flex-column gap-2">
                  {teamData.players.map((player) => (
                    <div
                      key={player.playerId}
                      className="card card-squad-item d-flex flex-row align-items-center p-2 position-relative"
                      onClick={() => playerProfileClick(player.playerId)}
                    >
                      {/* Player Image */}
                      <img
                        src={player.users.pic || "default-pic.jpg"}
                        alt={player.users.name}
                        className="rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />

                      {/* Player Name & Position */}
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1">{player.users.name}</h6>
                        <small className="text-muted">
                          {player.users.position}
                        </small>
                      </div>

                      {/* Player Number */}
                      <span className="player-number px-3 py-1">
                        {player.playerNo}
                      </span>

                      {/* Three-Dot Menu */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "matches" && (
              <div className="card p-3">
                <h5>Match History</h5>
                <ul className="list-group">
                  {teamDatas.matches.map((match) => (
                    <li key={match.id} className="list-group-item">
                      {match.opponent} - {match.result} ({match.date})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "recruitment" && (
              <div className="card p-3">
                <h5 className="mb-3">Add New Player</h5>

                <div className="accordion" id="recruitmentAccordion">
                  {Array.isArray(availableUsers.users) &&
                    availableUsers?.users?.map((user, index) => (
                      <div className="accordion-item mt-3" key={user.userId}>
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                            aria-expanded="true"
                            aria-controls={`collapse${index}`}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }} // Ensures proper spacing
                          >
                            {/* Left side: Image and Name */}
                            <div className="d-flex align-items-center">
                              <img
                                src={user.pic || "default-pic.jpg"}
                                alt={user.name}
                                className="rounded-circle me-2"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                              <span className="fw-bold">{user.name}</span>
                            </div>

                            {/* Right side: Position */}
                            <span
                              className="fw-bold"
                              style={{ marginLeft: "auto" }}
                            >
                              {user.position}
                            </span>
                          </button>
                        </h2>
                        <div
                          id={`collapse${index}`}
                          className="accordion-collapse collapse"
                          data-bs-parent="#recruitmentAccordion"
                        >
                          <div className="accordion-body">
                            <p className="mb-1">
                              <strong>Email:</strong> {user.email}
                            </p>
                            <p className="mb-1">
                              <strong>Country:</strong> {user.country}
                            </p>
                            <p className="mb-1">
                              <strong>Gender:</strong> {user.gender}
                            </p>
                            <p className="mb-1">
                              <strong>Age:</strong> {user.age}
                            </p>
                            <p className="mb-1">
                              <strong>Foot:</strong> {user.foot}
                            </p>

                            <div className="mb-2">
                              <label className="form-label">
                                <strong>Player Number:</strong>
                              </label>
                              <input
                                type="text"
                                name="playerno"
                                value={formData.playerno}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter player number"
                              />
                            </div>

                            <button
                              className="btn btn-signup w-100 mt-2"
                              disabled={isPending}
                              onClick={(event) =>
                                handleSendPlayerReq(
                                  user.userId,
                                  formData.playerno,
                                  event
                                )
                              }
                            >
                              Send Recruitment Request
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;
