import React, { useState, useEffect, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  fetchTeamDetails,
  fetchAvailableUsers,
  SendPlayerReq,
  fetchPlayerProfile,
  fetchMatches,
  fetchMatchDetails,
} from "../../Redux/fetures/Teamslice";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";
import { useNavigate } from "react-router-dom";

const TeamDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPending, startTransition] = useTransition(); // Manage pending state for async transitions
  const [formData, setFormData] = useState({
    playerno: "",
  });
  const [displayedPlayers, setDisplayedPlayers] = useState(10);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isTeamOwner = localStorage.getItem("teamtoken");

  const { teamData, availableUsers, matchesList } = useSelector(
    (state) => state.teamSlice
  );

  useEffect(() => {
    if (isTeamOwner) {
      dispatch(fetchTeamDetails()).catch(() =>
        showToast("Error while fetching team details!", "danger")
      );
      dispatch(fetchAvailableUsers()).catch(() =>
        showToast("Error while fetching available users!", "danger")
      );
      dispatch(fetchMatches()).catch(() =>
        showToast("Error while fetching match list!", "danger")
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

  // Function for squad player profile.
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

  const [visibleCompleted, setVisibleCompleted] = useState(7); // Show last match initially
  const [visibleOngoing, setVisibleOngoing] = useState(10); // Show next match initially

  if (!matchesList || !matchesList.matches) {
    return <p>Loading matches...</p>;
  }

  const matches = matchesList.matches || [];

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
      navigate(`/TeamMatchDetails/${matchId}`);
    } catch (error) {
      showToast(error.message || "Error while fetching match details!");
    }
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
            {["overview", "squad", "matches", "recruitment"].map((tab) => (
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
            {activeTab === "overview" && (
              <>
                {/* Last Completed Fixture */}
                {lastCompletedMatch && (
                  <>
                    <h4 className="text-center mt-3">Last Completed Fixture</h4>
                    <hr className="w-50 mx-auto" />
                    <div
                      key={lastCompletedMatch.matchId}
                      className="match-card-container"
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

                {/* Next Upcoming/Ongoing Fixture */}
                {nextMatch && (
                  <>
                    <h4 className="text-center mt-3">Next Fixture</h4>
                    <hr className="w-50 mx-auto" />
                    <div
                      key={nextMatch.matchId}
                      className="match-card-container"
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
              </>
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

            {activeTab === "recruitment" && (
              <div className="card p-3">
                <h5 className="mb-3">Add New Player</h5>

                <div className="accordion" id="recruitmentAccordion">
                  {Array.isArray(availableUsers.users) &&
                    availableUsers.users
                      .slice(0, displayedPlayers)
                      .map((user, index) => (
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
                              }}
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

                {/* Load More Button */}
                {displayedPlayers < availableUsers.users.length && (
                  <button
                    className="btn  w-100 mt-3 "
                    onClick={() => setDisplayedPlayers(displayedPlayers + 5)}
                    style={{
                      color: "#45b469",
                      border: "none",
                      fontWeight: "bolder",
                    }}
                  >
                    More
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;
