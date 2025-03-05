import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";
import {
  fetchUserDetails,
  fetchMatchDetails,
} from "../../Redux/fetures/authentication";
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

  // Matches logic.
  const [visibleCompleted, setVisibleCompleted] = useState(7); // Show last match initially
  const [visibleOngoing, setVisibleOngoing] = useState(10); // Show next match initially

  if (!data || !data.matches) {
    return <p>Loading matches...</p>;
  }

  const matches = data.matches || [];

  const completedMatches = matches.filter(
    (match) => match.status === "Full Time"
  );
  const ongoingOrUpcomingMatches = matches.filter(
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
      navigate(`/PlayerMatchDetails/${matchId}`);
    } catch (error) {
      showToast(
        error.message || "Error while fetching match details!",
        "danger"
      );
    }
  };

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

          {activeTab === "matches" && (
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
                    onClick={() =>
                      handleMatchDeatils(lastCompletedMatch.matchId)
                    }
                  >
                    <div className="card p-4 shadow-lg mb-4 match-card">
                      <ul className="list-group">
                        <li className="list-group-item border-0 shadow-sm rounded">
                          <div className="row align-items-center text-center">
                            <div className="col-md-5 d-flex flex-column text-start">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={lastCompletedMatch.teamA.teamlogo}
                                    alt="Team A Logo"
                                    className="team-logo me-2"
                                  />
                                  <strong className="fs-6">
                                    {lastCompletedMatch.teamA.teamname}
                                  </strong>
                                </div>
                                <h5 className="fw-bold">
                                  {lastCompletedMatch.score.teamA}
                                </h5>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={lastCompletedMatch.teamB.teamlogo}
                                    alt="Team B Logo"
                                    className="team-logo me-2"
                                  />
                                  <strong className="fs-6">
                                    {lastCompletedMatch.teamB.teamname}
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
                                {lastCompletedMatch.date} |{" "}
                                {lastCompletedMatch.time}
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
                                    src={nextMatch.teamA.teamlogo}
                                    alt="Team A Logo"
                                    className="team-logo me-2"
                                  />
                                  <strong className="fs-6">
                                    {nextMatch.teamA.teamname}
                                  </strong>
                                </div>
                                <h5 className="fw-bold">-</h5>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={nextMatch.teamB.teamlogo}
                                    alt="Team B Logo"
                                    className="team-logo me-2"
                                  />
                                  <strong className="fs-6">
                                    {nextMatch.teamB.teamname}
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
                                {nextMatch.date} | {nextMatch.time}
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
                                        src={match.teamA.teamlogo}
                                        alt="Team A Logo"
                                        className="team-logo me-2"
                                      />
                                      <strong className="fs-6">
                                        {match.teamA.teamname}
                                      </strong>
                                    </div>
                                    <h5 className="fw-bold">
                                      {match.score.teamA}
                                    </h5>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={match.teamB.teamlogo}
                                        alt="Team B Logo"
                                        className="team-logo me-2"
                                      />
                                      <strong className="fs-6">
                                        {match.teamB.teamname}
                                      </strong>
                                    </div>
                                    <h5 className="fw-bold">
                                      {match.score.teamB}
                                    </h5>
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
                                    {match.date} | {match.time}
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
                  {remainingOngoingMatches
                    .slice(0, visibleOngoing)
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
                                        src={match.teamA.teamlogo}
                                        alt="Team A Logo"
                                        className="team-logo me-2"
                                      />
                                      <strong className="fs-6">
                                        {match.teamA.teamname}
                                      </strong>
                                    </div>
                                    <h5 className="fw-bold">-</h5>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={match.teamB.teamlogo}
                                        alt="Team B Logo"
                                        className="team-logo me-2"
                                      />
                                      <strong className="fs-6">
                                        {match.teamB.teamname}
                                      </strong>
                                    </div>
                                    <h5 className="fw-bold">-</h5>
                                  </div>
                                </div>
                                <div className="col-auto d-flex justify-content-center">
                                  <div className="vr vr-match"></div>
                                </div>
                                <div className="col-md-4">
                                  <smal className="text-muted">
                                    {match.date} | {match.time}
                                  </smal>
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
        </div>
      )}
    </div>
  );
}
