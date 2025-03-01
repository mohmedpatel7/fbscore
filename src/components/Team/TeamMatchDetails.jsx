import { useEffect } from "react";
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

  //  Handle loading state to prevent crashes
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
            Match Stats
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#tab2">
            Line Up
          </a>
        </li>
      </ul>

      {/* Tabs Content */}
      <div className="tab-content mt-3">
        <div id="tab1" className="tab-pane fade show active">
          <p>Match statistics go here...</p>
        </div>

        <div id="tab2" className="tab-pane fade">
          <div className="row">
            <div className="col-12">
              <h4 style={{ color: "#50C878" }}>Line Up</h4>
            </div>
            <div className="card col-12 linup-card-main">
              <div className="card mt-2 mb-1 linup-card">
                <div className="d-flex align-items-center flex-column flex-sm-row mt-1 mb-2">
                  <img
                    src={matchDetails.teams.teamA.logo || "/placeholder.svg"}
                    alt={matchDetails.teams.teamA.name}
                    className="rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="ms-sm-2 mt-2 mt-sm-0 fw-semibold">
                    {matchDetails.teams.teamA.name}
                  </span>
                </div>
              </div>
              <div className="col-12 mt-2">
                {matchDetails.status === "Upcoming" ? (
                  <>
                    <h5 className="text-muted">
                      Possible {matchDetails.teams.teamA.name} Playing 11
                    </h5>
                    <br />
                    {matchDetails.teams.teamA.players.map((player) => (
                      <div
                        key={player.id}
                        className="card card-squad-item d-flex flex-row align-items-center p-2 position-relative mb-2"
                      >
                        {/* Player Image */}
                        <img
                          src={player.pic || "default-pic.jpg"}
                          alt={player.name}
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />

                        {/* Player Name & Position */}
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{player.name}</h6>
                        </div>

                        {/* Player Number */}
                        <span className="player-number px-3 py-1">
                          {player.jeresyNo} 
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <h5 className="text-muted">
                      {matchDetails.teams.teamA.name} Playing 11
                    </h5>
                    <br />
                    {matchDetails.teams.teamA.players.map((player) => (
                      <div
                        key={player.id}
                        className="card card-squad-item d-flex flex-row align-items-center p-2 position-relative mb-2"
                        onClick={() => playerProfileClick(player.id)}
                      >
                        {/* Player Image */}
                        <img
                          src={player.pic || "default-pic.jpg"}
                          alt={player.name}
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />

                        {/* Player Name & Position */}
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{player.name}</h6>

                          <small className="text-muted">
                            {player.position}
                          </small>
                        </div>

                        {/* Player Number */}
                        <span className="player-number px-3 py-1">
                          {player.jeresyNo}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="row mt-4 mb-4">
            <div className="col-12"></div>
            <div className="card col-12 linup-card-main">
              <div className="card mt-2 mb-1 linup-card">
                <div className="d-flex align-items-center flex-column flex-sm-row mt-1 mb-2">
                  <img
                    src={matchDetails.teams.teamB.logo || "/placeholder.svg"}
                    alt={matchDetails.teams.teamB.name}
                    className="rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="ms-sm-2 mt-2 mt-sm-0 fw-semibold">
                    {matchDetails.teams.teamB.name}
                  </span>
                </div>
              </div>
              <div className="col-12 mt-2">
                {matchDetails.status === "Upcoming" ? (
                  <>
                    <h5 className="text-muted">
                      Possible {matchDetails.teams.teamB.name} Playing 11
                    </h5>
                    <br />
                    {matchDetails.teams.teamB.players.map((player) => (
                      <div
                        key={player.id}
                        className="card card-squad-item d-flex flex-row align-items-center p-2 position-relative mb-2"
                      >
                        {/* Player Image */}
                        <img
                          src={player.pic || "default-pic.jpg"}
                          alt={player.name}
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />

                        {/* Player Name & Position */}
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{player.name}</h6>
                        </div>

                        {/* Player Number */}
                        <span className="player-number px-3 py-1">
                          {player.jeresyNo}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <h5 className="text-muted">
                      {matchDetails.teams.teamB.name} Playing 11
                    </h5>
                    <br />
                    {matchDetails.teams.teamB.players.map((player) => (
                      <div
                        key={player.id}
                        className="card card-squad-item d-flex flex-row align-items-center p-2 position-relative mb-2"
                        onClick={() => playerProfileClick(player.id)}
                      >
                        {/* Player Image */}
                        <img
                          src={player.pic || "default-pic.jpg"}
                          alt={player.name}
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />

                        {/* Player Name & Position */}
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{player.name}</h6>

                          <small className="text-muted">
                            {player.position}
                          </small>
                        </div>

                        {/* Player Number */}
                        <span className="player-number px-3 py-1">
                          {player.jeresyNo}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
