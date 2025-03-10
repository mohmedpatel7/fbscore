import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchMatchDetails,
  fetchOtherTeamDetails,
} from "../../Redux/fetures/postslice";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";
import { useNavigate } from "react-router-dom";

export default function CommonMatchDetails() {
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { matchDetails } = useSelector((state) => state.postSlice);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMatchDetails(matchId));
  }, [dispatch, matchId]);

  // Compute scorers only when matchDetails changes
  const scorers = useMemo(() => {
    if (!matchDetails?.goals) return [];
    return Object.values(
      matchDetails.goals.reduce((acc, goal) => {
        if (!goal.scorer) return acc;

        const scorerId = goal.scorer.id;
        if (!acc[scorerId]) {
          acc[scorerId] = {
            ...goal.scorer,
            goalsCount: 0,
          };
        }
        acc[scorerId].goalsCount += 1;
        return acc;
      }, {})
    );
  }, [matchDetails]);

  // Compute assist provider only when matchDetails changes
  const assister = useMemo(() => {
    if (!matchDetails?.goals) return [];
    return Object.values(
      matchDetails.goals.reduce((acc, assist) => {
        if (!assist.assist) return acc;

        const assisterId = assist.assist.id;
        if (!acc[assisterId]) {
          acc[assisterId] = {
            ...assist.assist,
            assistCount: 0,
          };
        }
        acc[assisterId].assistCount += 1;
        return acc;
      }, {})
    );
  }, [matchDetails]);

  if (!matchDetails) {
    return <div className="container mt-4">Loading match details...</div>;
  }

  return (
    <div className="container mt-4">
      <div
        className="card border-0 shadow-sm text-center mx-auto mb-3"
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Match Status Banner */}
        <div
          className={`py-1 text-white fw-bold ${
            matchDetails.status === "Full Time"
              ? "bg-success"
              : matchDetails.status === "Live"
              ? "bg-danger"
              : "bg-warning"
          }`}
        >
          <span className="d-flex align-items-center justify-content-center">
            {matchDetails.status === "Live" && (
              <span className="live-indicator me-1"></span>
            )}
            <i
              className={`bi ${
                matchDetails.status === "Full Time"
                  ? "bi-flag-fill"
                  : matchDetails.status === "Live"
                  ? "bi-broadcast"
                  : "bi-hourglass-split"
              } me-1`}
            ></i>
            {matchDetails.status}
          </span>
        </div>

        <div className="card-body p-3">
          {/* Match Date and Time */}
          <div className="text-muted mb-2 small">
            <i className="bi bi-calendar-event me-1"></i>
            {matchDetails.matchDate} | <i className="bi bi-clock me-1"></i>
            {matchDetails.matchTime}
          </div>

          {/* Teams and Score */}
          <div className="row align-items-center">
            {/* Team A */}
            <div className="col-4 text-end">
              <div
                className="d-flex flex-column align-items-center align-items-md-end logo-click"
                onClick={() =>
                  handleOtherTeamProfile(matchDetails.teams.teamA.id)
                }
                style={{ cursor: "pointer" }}
              >
                <img
                  src={matchDetails.teams.teamA.logo || "/placeholder.svg"}
                  alt={matchDetails.teams.teamA.name}
                  className="rounded-circle bg-light p-1 mb-1"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    border: "2px solid #f8f9fa",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <h6 className="fw-bold mb-0">
                  {matchDetails.teams.teamA.name}
                </h6>
              </div>
            </div>

            {/* Score */}
            <div className="col-4">
              <div
                className="score-display py-2 px-3 mx-auto"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(80, 200, 120, 0.1), rgba(74, 144, 226, 0.1))",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  maxWidth: "100px",
                }}
              >
                <div className="d-flex justify-content-center align-items-center">
                  <span className="fs-4 fw-bold" style={{ color: "#50C878" }}>
                    {matchDetails.score.teamA}
                  </span>
                  <span className="fs-5 mx-1 text-muted">:</span>
                  <span className="fs-4 fw-bold" style={{ color: "#4a90e2" }}>
                    {matchDetails.score.teamB}
                  </span>
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="col-4 text-start">
              <div
                className="d-flex flex-column align-items-center align-items-md-start logo-click"
                onClick={() =>
                  handleOtherTeamProfile(matchDetails.teams.teamB.id)
                }
                style={{ cursor: "pointer" }}
              >
                <img
                  src={matchDetails.teams.teamB.logo || "/placeholder.svg"}
                  alt={matchDetails.teams.teamB.name}
                  className="rounded-circle bg-light p-1 mb-1"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    border: "2px solid #f8f9fa",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <h6 className="fw-bold mb-0">
                  {matchDetails.teams.teamB.name}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mt-4" id="matchTabs">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#tab1">
            Overview
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#tab2">
            Line Up
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#tab3">
            About Match
          </a>
        </li>
      </ul>

      <div className="tab-content">
        {["Live", "Half Time", "Full Time"].includes(matchDetails.status) ? (
          <div id="tab1" className="tab-pane fade show active">
            {matchDetails.mvp &&
            Object.keys(matchDetails.mvp).length > 0 &&
            matchDetails.mvp.name ? (
              <div className="mb-4">
                <div className="col-12 mt-3 mb-3">
                  <h4
                    className="d-flex align-items-center"
                    style={{ color: "#50C878", fontWeight: "700" }}
                  >
                    <i className="bi bi-trophy-fill me-2"></i>
                    Best Player of The Game
                  </h4>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div
                      className="card border-0 shadow-sm"
                      style={{
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, rgba(80, 200, 120, 0.15), rgba(80, 200, 120, 0.05))",
                        overflow: "hidden",
                        border: "1px solid rgba(80, 200, 120, 0.2)",
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center">
                          {/* MVP Badge */}
                          <div className="position-relative me-4">
                            <div
                              style={{
                                position: "absolute",
                                top: "-10px",
                                left: "-10px",
                                background: "#FFD700",
                                color: "#000",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px solid white",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                zIndex: 2,
                              }}
                            >
                              <i className="bi bi-star-fill"></i>
                            </div>

                            {/* Player Image */}
                            <img
                              src={matchDetails.mvp.pic || "default-pic.jpg"}
                              alt={matchDetails.mvp.name || "Unknown Player"}
                              className="rounded-circle"
                              style={{
                                width: "90px",
                                height: "90px",
                                objectFit: "cover",
                                border: "4px solid #50C878",
                                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                                transition: "transform 0.3s ease",
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.transform = "scale(1.05)")
                              }
                              onMouseOut={(e) =>
                                (e.target.style.transform = "scale(1)")
                              }
                            />
                          </div>

                          {/* Player Info */}
                          <div className="flex-grow-1">
                            <h5
                              className="mb-2 fw-bold"
                              style={{ color: "#2c3e50" }}
                            >
                              {matchDetails.mvp.name || "Unknown"}
                            </h5>
                            <div className="d-flex align-items-center flex-wrap">
                              <span
                                className="badge me-2 mb-1"
                                style={{
                                  background: "rgba(80, 200, 120, 0.2)",
                                  color: "#2c7a44",
                                  padding: "6px 12px",
                                  borderRadius: "20px",
                                  fontSize: "0.85rem",
                                }}
                              >
                                <i className="bi bi-person-badge me-1"></i>
                                {matchDetails.mvp.position || "Unknown"}
                              </span>
                              {matchDetails.mvp.teamName && (
                                <span
                                  className="badge mb-1"
                                  style={{
                                    background: "rgba(74, 144, 226, 0.2)",
                                    color: "#2c5ca2",
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  <i className="bi bi-people-fill me-1"></i>
                                  {matchDetails.mvp.teamName}
                                </span>
                              )}
                            </div>
                            <p className="mt-2 mb-0 text-muted small">
                              <i className="bi bi-award me-1"></i>
                              Selected as the most valuable player of this match
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {scorers.length > 0 && (
              <div className="mb-4">
                <div className="col-12 mt-3 mb-3">
                  <h4
                    className="d-flex align-items-center"
                    style={{ color: "#50C878", fontWeight: "700" }}
                  >
                    <i className="bi bi-bullseye me-2"></i>
                    Goal Scorers
                  </h4>
                </div>
                <div className="row">
                  {scorers.map((scorer, index) => (
                    <div key={scorer.id} className="col-md-6 mb-3">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          borderRadius: "16px",
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          border: "1px solid rgba(255, 157, 0, 0.1)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow =
                            "0 10px 20px rgba(255, 157, 0, 0.1)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 6px rgba(0, 0, 0, 0.06)";
                        }}
                      >
                        {/* Goal Count Badge - Positioned Absolutely */}
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background:
                              "linear-gradient(135deg, #ff9d00, #ff6a00)",
                            color: "white",
                            borderRadius: "30px",
                            padding: "5px 12px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            boxShadow: "0 3px 6px rgba(255, 106, 0, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            zIndex: 1,
                          }}
                        >
                          <span style={{ marginRight: "4px" }}>⚽</span>{" "}
                          {scorer.goalsCount}
                        </div>

                        <div className="card-body p-4">
                          <div className="d-flex align-items-center">
                            {/* Player Image */}
                            <div className="position-relative">
                              <img
                                src={scorer.pic || "default-pic.jpg"}
                                alt={scorer.name || "Unknown Player"}
                                className="rounded-circle"
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                  border: "3px solid rgba(255, 157, 0, 0.3)",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "-5px",
                                  right: "-5px",
                                  background: "#fff",
                                  borderRadius: "50%",
                                  width: "24px",
                                  height: "24px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "2px solid #ff9d00",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                              >
                                <i
                                  className="bi bi-dribbble"
                                  style={{ color: "#ff9d00", fontSize: "12px" }}
                                ></i>
                              </div>
                            </div>

                            {/* Player Info */}
                            <div className="ms-3 flex-grow-1">
                              <h6
                                className="mb-1 fw-bold"
                                style={{ color: "#2c3e50" }}
                              >
                                {scorer.name || "Unknown"}
                              </h6>
                              <div className="d-flex align-items-center">
                                <span
                                  className="badge"
                                  style={{
                                    background: "rgba(255, 157, 0, 0.1)",
                                    color: "#ff9d00",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {scorer.position || "Unknown"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {assister.length > 0 && (
              <div className="mb-4">
                <div className="col-12 mt-3 mb-3">
                  <h4
                    className="d-flex align-items-center"
                    style={{ color: "#50C878", fontWeight: "700" }}
                  >
                    <i className="bi bi-hand-thumbs-up me-2"></i>
                    Assist Providers
                  </h4>
                </div>
                <div className="row">
                  {assister.map((assist, index) => (
                    <div key={assist.id} className="col-md-6 mb-3">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          borderRadius: "16px",
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          border: "1px solid rgba(74, 144, 226, 0.1)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow =
                            "0 10px 20px rgba(74, 144, 226, 0.1)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 6px rgba(0, 0, 0, 0.06)";
                        }}
                      >
                        {/* Assist Count Badge - Positioned Absolutely */}
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background:
                              "linear-gradient(135deg, #4a90e2, #3672b9)",
                            color: "white",
                            borderRadius: "30px",
                            padding: "5px 12px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            boxShadow: "0 3px 6px rgba(54, 114, 185, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            zIndex: 1,
                          }}
                        >
                          <span style={{ marginRight: "4px" }}>👟</span>{" "}
                          {assist.assistCount}
                        </div>

                        <div className="card-body p-4">
                          <div className="d-flex align-items-center">
                            {/* Player Image */}
                            <div className="position-relative">
                              <img
                                src={assist.pic || "default-pic.jpg"}
                                alt={assist.name || "Unknown Player"}
                                className="rounded-circle"
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                  border: "3px solid rgba(74, 144, 226, 0.3)",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "-5px",
                                  right: "-5px",
                                  background: "#fff",
                                  borderRadius: "50%",
                                  width: "24px",
                                  height: "24px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "2px solid #4a90e2",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                              >
                                <i
                                  className="bi bi-magic"
                                  style={{ color: "#4a90e2", fontSize: "12px" }}
                                ></i>
                              </div>
                            </div>

                            {/* Player Info */}
                            <div className="ms-3 flex-grow-1">
                              <h6
                                className="mb-1 fw-bold"
                                style={{ color: "#2c3e50" }}
                              >
                                {assist.name || "Unknown"}
                              </h6>
                              <div className="d-flex align-items-center">
                                <span
                                  className="badge"
                                  style={{
                                    background: "rgba(74, 144, 226, 0.1)",
                                    color: "#4a90e2",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {assist.position || "Unknown"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center">
            <p className="text-muted text-center">
              Overview available at the time of the match!
            </p>
          </div>
        )}

        {/* Tab2 Content - Line Up (Improved UI) */}
        <div id="tab2" className="tab-pane fade">
          <div className="row">
            <div className="col-12 mt-3 mb-4">
              <h4
                className="text-center"
                style={{ color: "#50C878", fontWeight: "700" }}
              >
                <i className="bi bi-people-fill me-2"></i>
                Match Line Up
              </h4>
              <div className="text-center">
                <span className="badge bg-light text-dark px-3 py-2 shadow-sm">
                  {matchDetails.status === "Upcoming"
                    ? "Possible Playing XI"
                    : "Official Playing XI"}
                </span>
              </div>
            </div>

            {/* Teams Container */}
            <div className="col-12">
              <div className="row g-4">
                {/* Team A Section */}
                <div className="col-md-6">
                  <div
                    className="card h-100 shadow-sm border-0"
                    style={{ borderRadius: "15px", overflow: "hidden" }}
                  >
                    {/* Team Header with Gradient */}
                    <div
                      className="card-header text-white p-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #50C878 0%, #3a9c5a 100%)",
                        borderBottom: "none",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="position-relative">
                          <img
                            src={
                              matchDetails.teams.teamA.logo ||
                              "/placeholder.svg"
                            }
                            alt={matchDetails.teams.teamA.name}
                            className="rounded-circle bg-white p-1"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              border: "3px solid white",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                        </div>
                        <div className="ms-3">
                          <h5 className="mb-0 fw-bold">
                            {matchDetails.teams.teamA.name}
                          </h5>
                          <small>Home Team</small>
                        </div>
                      </div>
                    </div>

                    {/* Team A Players */}
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        {matchDetails.teams.teamA.players.map(
                          (player, index) => (
                            <div
                              key={player.id}
                              className="list-group-item list-group-item-action border-0 py-3 px-4"
                              style={{
                                background:
                                  index % 2 === 0 ? "#f8f9fa" : "white",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                              }}
                              onClick={() => playerProfileClick(player.id)}
                            >
                              <div className="d-flex align-items-center">
                                <div className="position-relative">
                                  <img
                                    src={player.pic || "default-pic.jpg"}
                                    alt={player.name}
                                    className="rounded-circle"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      border: "2px solid #e0e0e0",
                                    }}
                                  />
                                  <span
                                    className="position-absolute badge rounded-circle"
                                    style={{
                                      width: "28px",
                                      height: "28px",
                                      lineHeight: "20px",
                                      background: "#50C878",
                                      color: "white",
                                      border: "2px solid white",
                                      bottom: "-5px",
                                      right: "-5px",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {player.jeresyNo}
                                  </span>
                                </div>

                                <div className="ms-3 flex-grow-1">
                                  <h6 className="mb-0 fw-semibold">
                                    {player.name}
                                  </h6>
                                  <span className="badge bg-light text-dark mt-1">
                                    {player.position}
                                  </span>
                                </div>

                                <div className="ms-auto">
                                  <i className="bi bi-chevron-right text-muted"></i>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team B Section */}
                <div className="col-md-6">
                  <div
                    className="card h-100 shadow-sm border-0"
                    style={{ borderRadius: "15px", overflow: "hidden" }}
                  >
                    {/* Team Header with Gradient */}
                    <div
                      className="card-header text-white p-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #4a90e2 0%, #3672b9 100%)",
                        borderBottom: "none",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="position-relative">
                          <img
                            src={
                              matchDetails.teams.teamB.logo ||
                              "/placeholder.svg"
                            }
                            alt={matchDetails.teams.teamB.name}
                            className="rounded-circle bg-white p-1"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              border: "3px solid white",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                        </div>
                        <div className="ms-3">
                          <h5 className="mb-0 fw-bold">
                            {matchDetails.teams.teamB.name}
                          </h5>
                          <small>Away Team</small>
                        </div>
                      </div>
                    </div>

                    {/* Team B Players */}
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        {matchDetails.teams.teamB.players.map(
                          (player, index) => (
                            <div
                              key={player.id}
                              className="list-group-item list-group-item-action border-0 py-3 px-4"
                              style={{
                                background:
                                  index % 2 === 0 ? "#f8f9fa" : "white",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                              }}
                              onClick={() => playerProfileClick(player.id)}
                            >
                              <div className="d-flex align-items-center">
                                <div className="position-relative">
                                  <img
                                    src={player.pic || "default-pic.jpg"}
                                    alt={player.name}
                                    className="rounded-circle"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      border: "2px solid #e0e0e0",
                                    }}
                                  />
                                  <span
                                    className="position-absolute badge rounded-circle"
                                    style={{
                                      width: "28px",
                                      height: "28px",
                                      lineHeight: "20px",
                                      background: "#4a90e2",
                                      color: "white",
                                      border: "2px solid white",
                                      bottom: "-5px",
                                      right: "-5px",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {player.jeresyNo}
                                  </span>
                                </div>

                                <div className="ms-3 flex-grow-1">
                                  <h6 className="mb-0 fw-semibold">
                                    {player.name}
                                  </h6>
                                  <span className="badge bg-light text-dark mt-1">
                                    {player.position}
                                  </span>
                                </div>

                                <div className="ms-auto">
                                  <i className="bi bi-chevron-right text-muted"></i>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/**tab3 */}
        <div id="tab3" className="tab-pane fade">
          <div className="row">
            <div className="col-12 mt-3 mb-4">
              <h4
                className="d-flex align-items-center"
                style={{ color: "#50C878", fontWeight: "700" }}
              >
                <i className="bi bi-info-circle-fill me-2"></i>
                About Match
              </h4>
            </div>

            <div className="col-md-8 mx-auto">
              <div
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                {/* Card Header */}
                <div
                  className="card-header p-4 border-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(80, 200, 120, 0.15), rgba(80, 200, 120, 0.05))",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "#50C878",
                        boxShadow: "0 4px 8px rgba(80, 200, 120, 0.3)",
                      }}
                    >
                      <i className="bi bi-calendar-check text-white fs-5"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">Match Information</h5>
                      <p className="mb-0 text-muted small">
                        Details about this match
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {/* Match Official */}
                    <div className="list-group-item border-0 py-3 px-4">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(80, 200, 120, 0.1)",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className="bi bi-person-badge"
                            style={{ color: "#50C878" }}
                          ></i>
                        </div>
                        <div className="ms-3">
                          <p className="text-muted mb-0 small">
                            Match Official
                          </p>
                          <p className="mb-0 fw-semibold">
                            {matchDetails.createdBy || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Match Date */}
                    <div
                      className="list-group-item border-0 py-3 px-4"
                      style={{ background: "#f8f9fa" }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(80, 200, 120, 0.1)",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className="bi bi-calendar-date"
                            style={{ color: "#50C878" }}
                          ></i>
                        </div>
                        <div className="ms-3">
                          <p className="text-muted mb-0 small">Match Date</p>
                          <p className="mb-0 fw-semibold">
                            {matchDetails.matchDate || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Match Time */}
                    <div className="list-group-item border-0 py-3 px-4">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(80, 200, 120, 0.1)",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className="bi bi-clock"
                            style={{ color: "#50C878" }}
                          ></i>
                        </div>
                        <div className="ms-3">
                          <p className="text-muted mb-0 small">Match Time</p>
                          <p className="mb-0 fw-semibold">
                            {matchDetails.matchTime || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Home Team */}
                    <div
                      className="list-group-item border-0 py-3 px-4"
                      style={{ background: "#f8f9fa" }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(80, 200, 120, 0.1)",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className="bi bi-house"
                            style={{ color: "#50C878" }}
                          ></i>
                        </div>
                        <div className="ms-3">
                          <p className="text-muted mb-0 small">Home Team</p>
                          <div className="d-flex align-items-center">
                            {matchDetails.teams?.teamA?.logo && (
                              <img
                                src={matchDetails.teams.teamA.logo}
                                alt={matchDetails.teams?.teamA?.name}
                                className="rounded-circle me-2"
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <p className="mb-0 fw-semibold">
                              {matchDetails.teams?.teamA?.name ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="list-group-item border-0 py-3 px-4">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(74, 144, 226, 0.1)",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className="bi bi-airplane"
                            style={{ color: "#4a90e2" }}
                          ></i>
                        </div>
                        <div className="ms-3">
                          <p className="text-muted mb-0 small">Away Team</p>
                          <div className="d-flex align-items-center">
                            {matchDetails.teams?.teamB?.logo && (
                              <img
                                src={matchDetails.teams.teamB.logo}
                                alt={matchDetails.teams?.teamB?.name}
                                className="rounded-circle me-2"
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <p className="mb-0 fw-semibold">
                              {matchDetails.teams?.teamB?.name ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Match Status */}
                    <div
                      className="list-group-item border-0 py-3 px-4"
                      style={{ background: "#f8f9fa" }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(80, 200, 120, 0.1)",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className="bi bi-flag"
                            style={{ color: "#50C878" }}
                          ></i>
                        </div>
                        <div className="ms-3">
                          <p className="text-muted mb-0 small">Match Status</p>
                          <span
                            className={`badge ${
                              matchDetails.status === "Full Time"
                                ? "bg-success"
                                : matchDetails.status === "Live"
                                ? "bg-danger"
                                : "bg-warning"
                            } px-3 py-1`}
                          >
                            {matchDetails.status || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer p-3 text-center bg-light border-0">
                  <p className="text-muted mb-0 small">
                    <i className="bi bi-info-circle me-1"></i>
                    Match information is provided by the match official
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
