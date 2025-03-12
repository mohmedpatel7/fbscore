import React, { useEffect, useState } from "react";
import {
  fetchAllMatches,
  fetchMatchDetails,
} from "../../Redux/fetures/postslice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TeamMatch from "./TeamMatch";
import PlayerMatch from "./PlayerMatch";
import MatchList from "../Match/MatchList";
import "./style/style.css";

export default function Matches() {
  const [activeTab, setActiveTab] = useState("All");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { matches } = useSelector((state) => state.postSlice);

  const isUser = localStorage.getItem("usertoken");
  const isTeamOwner = localStorage.getItem("teamtoken");
  const isMatchOfficial = localStorage.getItem("matchOfficialtoken");

  useEffect(() => {
    dispatch(fetchAllMatches());
  }, [dispatch]);

  const [visibleCompleted, setVisibleCompleted] = useState(7); // Show last match initially
  const [visibleOngoing, setVisibleOngoing] = useState(10); // Show next match initially

  if (!matches) {
    return <>Loading matches...</>;
  }

  const match = matches || [];

  const completedMatches = match.filter(
    (match) => match.status === "Full Time"
  );
  const ongoingOrUpcomingMatches = match.filter(
    (match) => match.status !== "Full Time"
  );

  const lastCompletedMatch =
    completedMatches.length > 0
      ? completedMatches[completedMatches.length - 1]
      : null;
  const nextMatch =
    ongoingOrUpcomingMatches.length > 0 ? ongoingOrUpcomingMatches[0] : null;

  const remainingCompletedMatches = completedMatches.slice(0, -1);
  const remainingOngoingMatches = ongoingOrUpcomingMatches.slice(1);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      // Scroll Down - Load More Ongoing Matches
      setVisibleOngoing((prev) =>
        Math.min(prev + 2, remainingOngoingMatches.length)
      );
    }

    if (scrollTop <= 20) {
      // Scroll Up - Load More Completed Matches
      setVisibleCompleted((prev) =>
        Math.min(prev + 2, remainingCompletedMatches.length)
      );
    }
  };

  // Handle fetching match details.
  const handleMatchDeatils = async (matchId) => {
    try {
      dispatch(fetchMatchDetails(matchId));
      navigate(`/CommonMatchDetails/${matchId}`);
    } catch (error) {
      showToast(error.message || "Error while fetching match details!");
    }
  };

  return (
    <div className="container mt-3">
      {/* Navbar */}
      <ul className="nav nav-tabs mt-3 d-flex flex-nowrap overflow-auto">
        {[
          "All",
          ...(isUser ? ["Your Match"] : []),
          ...(isTeamOwner ? ["Team Match"] : []),
          ...(isMatchOfficial ? ["Your Matches"] : []),
        ].map((tab) => (
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

      {/**tab1 */}
      {activeTab === "All" && (
        <div
          className="d-flex justify-content-center flex-wrap"
          onScroll={handleScroll}
        >
          {/* Last Completed Match */}
          {lastCompletedMatch && (
            <>
              <h4 className="text-center mt-3">Last Completed Fixture</h4>
              <hr className="w-50 mx-auto" />
              <div
                key={lastCompletedMatch.matchId}
                className="match-card-container"
                onClick={() => handleMatchDeatils(lastCompletedMatch.matchId)}
              >
                <div className="card p-4 shadow-lg mb-4 match-card">
                  <ul className="list-group">
                    <li className="list-group-item border-0 shadow-sm rounded">
                      <div className="row align-items-center text-center">
                        <div className="col-md-5 d-flex flex-column text-start">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              <img
                                src={lastCompletedMatch.teamA.logo}
                                alt="Team A Logo"
                                className="team-logo me-2"
                              />
                              <strong className="fs-6">
                                {lastCompletedMatch.teamA.name}
                              </strong>
                            </div>
                            <h5 className="fw-bold">
                              {lastCompletedMatch.score.teamA}
                            </h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <img
                                src={lastCompletedMatch.teamB.logo}
                                alt="Team B Logo"
                                className="team-logo me-2"
                              />
                              <strong className="fs-6">
                                {lastCompletedMatch.teamB.name}
                              </strong>
                            </div>
                            <h5 className="fw-bold">
                              {lastCompletedMatch.score.teamB}
                            </h5>
                          </div>
                        </div>
                        <div className="col-auto d-flex justify-content-center">
                          <div className="vr vr-match"></div>
                        </div>
                        <div className="col-md-4">
                          <span className="badge px-3 py-2 bg-success">
                            {lastCompletedMatch.status}
                          </span>
                        </div>
                        <div className="col-12 mt-2">
                          <small className="text-muted">
                            {lastCompletedMatch.matchDate} |{" "}
                            {lastCompletedMatch.matchTime}
                          </small>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Next Upcoming/Ongoing Match */}
          {nextMatch && (
            <>
              <h4 className="text-center mt-3">Next Fixture</h4>
              <hr className="w-50 mx-auto" />
              <div
                key={nextMatch.matchId}
                className="match-card-container"
                onClick={() => handleMatchDeatils(nextMatch.matchId)}
              >
                <div className="card p-4 shadow-lg mb-4 match-card">
                  <ul className="list-group">
                    <li className="list-group-item border-0 shadow-sm rounded">
                      <div className="row align-items-center text-center">
                        <div className="col-md-5 d-flex flex-column text-start">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              <img
                                src={nextMatch.teamA.logo}
                                alt="Team A Logo"
                                className="team-logo me-2"
                              />
                              <strong className="fs-6">
                                {nextMatch.teamA.name}
                              </strong>
                            </div>
                            <h5 className="fw-bold">-</h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <img
                                src={nextMatch.teamB.logo}
                                alt="Team B Logo"
                                className="team-logo me-2"
                              />
                              <strong className="fs-6">
                                {nextMatch.teamB.name}
                              </strong>
                            </div>
                            <h5 className="fw-bold">-</h5>
                          </div>
                        </div>
                        <div className="col-auto d-flex justify-content-center">
                          <div className="vr vr-match"></div>
                        </div>
                        <div className="col-md-4">
                          <span className="badge px-3 py-2 bg-warning">
                            {nextMatch.status}
                          </span>
                        </div>
                        <div className="col-12 mt-2">
                          <small className="text-muted">
                            {nextMatch.matchDate} | {nextMatch.matchTime}
                          </small>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
          {/* Remaining Completed Matches */}
          {remainingCompletedMatches.length > 0 && (
            <>
              <h4 className="text-center mt-3">Completed Fixtures</h4>
              <hr className="w-50 mx-auto" />
              {remainingCompletedMatches
                .slice(0, visibleCompleted)
                .map((match) => (
                  <div
                    key={match.matchId}
                    className="match-card-container"
                    onClick={() => handleMatchDeatils(match.matchId)}
                  >
                    <div className="card p-4 shadow-lg mb-4 match-card">
                      <ul className="list-group">
                        <li className="list-group-item border-0 shadow-sm rounded">
                          <div className="row align-items-center text-center">
                            <div className="col-md-5 d-flex flex-column text-start">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={match.teamA.logo}
                                    alt="Team A Logo"
                                    className="team-logo me-2"
                                  />
                                  <strong className="fs-6">
                                    {match.teamA.name}
                                  </strong>
                                </div>
                                <h5 className="fw-bold">{match.score.teamA}</h5>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={match.teamB.logo}
                                    alt="Team B Logo"
                                    className="team-logo me-2"
                                  />
                                  <strong className="fs-6">
                                    {match.teamB.name}
                                  </strong>
                                </div>
                                <h5 className="fw-bold">{match.score.teamB}</h5>
                              </div>
                            </div>
                            <div className="col-auto d-flex justify-content-center">
                              <div className="vr vr-match"></div>
                            </div>
                            <div className="col-md-4">
                              <span className="badge px-3 py-2 bg-success">
                                {match.status}
                              </span>
                            </div>
                            <div className="col-12 mt-2">
                              <small className="text-muted">
                                {match.matchDate} | {match.matchTime}
                              </small>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
            </>
          )}

          {/* Ongoing Matches */}
          {remainingOngoingMatches.length > 0 && (
            <>
              <h4 className="text-center mt-3">Upcoming Fixtures</h4>
              <hr className="w-50 mx-auto" />
              {remainingOngoingMatches.slice(0, visibleOngoing).map((match) => (
                <div
                  key={match.matchId}
                  className="match-card-container"
                  onClick={() => handleMatchDeatils(match.matchId)}
                >
                  <div className="card p-4 shadow-lg mb-4 match-card">
                    <ul className="list-group">
                      <li className="list-group-item border-0 shadow-sm rounded">
                        <div className="row align-items-center text-center">
                          <div className="col-md-5 d-flex flex-column text-start">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <img
                                  src={match.teamA.logo}
                                  alt="Team A Logo"
                                  className="team-logo me-2"
                                />
                                <strong className="fs-6">
                                  {match.teamA.name}
                                </strong>
                              </div>
                              <h5 className="fw-bold">-</h5>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <img
                                  src={match.teamB.logo}
                                  alt="Team B Logo"
                                  className="team-logo me-2"
                                />
                                <strong className="fs-6">
                                  {match.teamB.name}
                                </strong>
                              </div>
                              <h5 className="fw-bold">-</h5>
                            </div>
                          </div>
                          <div className="col-auto d-flex justify-content-center">
                            <div className="vr vr-match"></div>
                          </div>
                          <div className="col-md-4">
                            <small className="text-muted">
                              {match.matchDate} | {match.matchTime}
                            </small>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {/** Component for team matches */}
      {activeTab === "Team Match" && <TeamMatch />}
      {/** Component for player matches */}
      {activeTab === "Your Match" && <PlayerMatch />}

      {activeTab === "Your Matches" && <MatchList />}
    </div>
  );
}
