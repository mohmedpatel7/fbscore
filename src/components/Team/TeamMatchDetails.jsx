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
      <div className="card shadow-lg p-3 match-card text-center">
        {/* Match Status */}
        <span
          className={`badge ${
            matchDetails.status === "Full Time"
              ? "bg-success"
              : matchDetails.status === "Live"
              ? "bg-danger"
              : "bg-warning"
          } match-status`}
        >
          {matchDetails.status}
        </span>

        {/* Match Details */}
        <div className="d-flex justify-content-between align-items-center my-3">
          <img
            src={matchDetails.teams.teamA.logo}
            alt="Team A"
            className="team-logo"
          />
          <strong>{matchDetails.teams.teamA.name}</strong>
          <h4 className="score">
            {matchDetails.status === "Full Time" || "Live" || "Half Time"
              ? `${matchDetails.score.teamA} - ${matchDetails.score.teamB}`
              : "-"}
          </h4>
          <strong>{matchDetails.teams.teamB.name}</strong>
          <img
            src={matchDetails.teams.teamB.logo}
            alt="Team B"
            className="team-logo"
          />
        </div>

        {/* Match Date & Time */}
        <small className="text-muted match-date">
          {matchDetails.matchDate} | {matchDetails.matchTime}
        </small>
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
            Player Performance
          </a>
        </li>
      </ul>

      {/* Tabs Content */}
      <div className="tab-content mt-3">
        <div id="tab1" className="tab-pane fade show active">
          <p>Match statistics go here...</p>
        </div>
        <div id="tab2" className="tab-pane fade">
          <p>Player performance details go here...</p>
        </div>
      </div>
    </div>
  );
}
