import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMatchDetails } from "../../Redux/fetures/Teamslice";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";

export default function TeamMatchDetails() {
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { matchDetails } = useSelector((state) => state.teamSlice);

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
        className="card shadow-sm text-center mx-auto"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <div className="card-body p-3">
          {/* Teams and Score */}
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            {/* Team A */}
            <div className="d-flex align-items-center flex-column flex-sm-row">
              <img
                src={matchDetails.teams.teamA.logo || "/placeholder.svg"}
                alt={matchDetails.teams.teamA.name}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <span className="ms-sm-2 mt-2 mt-sm-0 fw-semibold">
                {matchDetails.teams.teamA.name}
              </span>
            </div>

            {/* Score */}
            <div className="text-center my-2" style={{ fontWeight: "bolder" }}>
              <span className="fs-4">
                {matchDetails.score.teamA} - {matchDetails.score.teamB}
              </span>
            </div>

            {/* Team B (Name Below Logo on Mobile) */}
            <div className="d-flex align-items-center flex-column flex-sm-row">
              <img
                src={matchDetails.teams.teamB.logo || "/placeholder.svg"}
                alt={matchDetails.teams.teamB.name}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <span className="ms-sm-2 mt-2 mt-sm-0 fw-semibold">
                {matchDetails.teams.teamB.name}
              </span>
            </div>
          </div>

          {/* Horizontal Line */}
          <hr className="my-3" />

          {/* Match Status and Date */}
          <div className="d-flex justify-content-between flex-column flex-sm-row text-center">
            <span
              className={`badge ${
                matchDetails.status === "Full Time"
                  ? "bg-success"
                  : matchDetails.status === "Live"
                  ? "bg-danger"
                  : "bg-warning"
              } px-3 py-1`}
            >
              {matchDetails.status}
            </span>
            <span className="text-muted small mt-2 mt-sm-0">
              {matchDetails.matchDate} | {matchDetails.matchTime}
            </span>
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
      </ul>

      <div className="tab-content">
        <div id="tab1" className="tab-pane fade  show active">
          {scorers.length > 0 && (
            <>
              <div className="mb-2">
                <div className="col-12 mt-3">
                  <h4
                    style={{
                      color: "#50C878",
                      fontWeight: "600",
                      marginBottom: "20px",
                    }}
                  >
                    Scorer
                  </h4>
                </div>
                <div className="row">
                  {scorers.map((scorer) => (
                    <div
                      key={scorer.id}
                      className="card card-squad-item d-flex flex-row align-items-center p-2 position-relative mb-2"
                    >
                      {/* Player Image */}
                      <img
                        src={scorer.pic || "default-pic.jpg"}
                        alt={scorer.name || "Unknown Player"}
                        className="rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />

                      {/* Player Name & Position */}
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1">{scorer.name || "Unknown"}</h6>
                        <small className="text-muted">
                          {scorer.position || "Unknown"}
                        </small>
                      </div>

                      {/* Goal Count - Right End */}
                      <span className="player-number px-3 py-1">
                        ⚽ {scorer.goalsCount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {assister.length > 0 && (
            <>
              <div className="mb-2">
                <div className="col-12 mt-3">
                  <h4
                    style={{
                      color: "#50C878",
                      fontWeight: "600",
                      marginBottom: "20px",
                    }}
                  >
                    Assist Provider
                  </h4>
                </div>
                <div className="row">
                  {assister.map((assist) => (
                    <div
                      key={assist.id}
                      className="card card-squad-item d-flex flex-row align-items-center p-2 position-relative mb-2"
                    >
                      {/* Player Image */}
                      <img
                        src={assist.pic || "default-pic.jpg"}
                        alt={assist.name || "Unknown Player"}
                        className="rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />

                      {/* Player Name & Position */}
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1">{assist.name || "Unknown"}</h6>
                        <small className="text-muted">
                          {assist.position || "Unknown"}
                        </small>
                      </div>

                      {/* Goal Count - Right End */}
                      <span className="player-number px-3 py-1">
                        👟{assist.assistCount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        {/* Tabs Content */}
        <div id="tab2" className="tab-pane fade">
          <div className="row">
            {/* Team A Section */}
            <div className="col-12 mt-3">
              <h4
                style={{
                  color: "#50C878",
                  fontWeight: "600",
                  marginBottom: "20px",
                }}
              >
                Line Up
              </h4>
            </div>

            <div className="col-12">
              <div className="card linup-card-main p-3">
                {/* Team A Header */}
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={matchDetails.teams.teamA.logo || "/placeholder.svg"}
                    alt={matchDetails.teams.teamA.name}
                    className="rounded-circle me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      border: "2px solid #50C878",
                    }}
                  />
                  <h5 className="mb-0 fw-semibold">
                    {matchDetails.teams.teamA.name}
                  </h5>
                </div>

                {/* Team A Players */}
                <div className="mt-3">
                  <h6 className="text-muted mb-3">
                    {matchDetails.status === "Upcoming"
                      ? `Possible ${matchDetails.teams.teamA.name} Playing 11`
                      : `${matchDetails.teams.teamA.name} Playing 11`}
                  </h6>
                  <div className="row">
                    {matchDetails.teams.teamA.players.map((player) => (
                      <div
                        key={player.id}
                        className="col-12 col-md-6 mb-3"
                        onClick={() => playerProfileClick(player.id)}
                      >
                        <div className="card card-squad-item p-2 d-flex flex-row align-items-center hover-effect">
                          {/* Player Image */}
                          <img
                            src={player.pic || "default-pic.jpg"}
                            alt={player.name}
                            className="rounded-circle me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />

                          {/* Player Details */}
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">{player.name}</h6>
                            <small className="text-muted">
                              {player.position}
                            </small>
                          </div>

                          {/* Player Number */}
                          <span className="player-number bg-light  px-3 py-1 rounded-circle">
                            {player.jeresyNo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team B Section */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card linup-card-main p-3">
                {/* Team B Header */}
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={matchDetails.teams.teamB.logo || "/placeholder.svg"}
                    alt={matchDetails.teams.teamB.name}
                    className="rounded-circle me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      border: "2px solid #50C878",
                    }}
                  />
                  <h5 className="mb-0 fw-semibold">
                    {matchDetails.teams.teamB.name}
                  </h5>
                </div>

                {/* Team B Players */}
                <div className="mt-3">
                  <h6 className="text-muted mb-3">
                    {matchDetails.status === "Upcoming"
                      ? `Possible ${matchDetails.teams.teamB.name} Playing 11`
                      : `${matchDetails.teams.teamB.name} Playing 11`}
                  </h6>
                  <div className="row">
                    {matchDetails.teams.teamB.players.map((player) => (
                      <div
                        key={player.id}
                        className="col-12 col-md-6 mb-3"
                        onClick={() => playerProfileClick(player.id)}
                      >
                        <div className="card card-squad-item p-2 d-flex flex-row align-items-center hover-effect">
                          {/* Player Image */}
                          <img
                            src={player.pic || "default-pic.jpg"}
                            alt={player.name}
                            className="rounded-circle me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />

                          {/* Player Details */}
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">{player.name}</h6>
                          </div>

                          {/* Player Number */}
                          <span className="player-number bg-light px-3 py-1 rounded-circle">
                            {player.jeresyNo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
