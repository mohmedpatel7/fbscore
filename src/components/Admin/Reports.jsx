import React, { useEffect, useState } from "react";
import {
  fetchTeamTable,
  fetchAllUsers,
  fetchMatchOfficials,
} from "../../Redux/fetures/AdminSlice";
import { fetchCommonTeams } from "../../Redux/fetures/Teamslice";
import { fetchOtherUser } from "../../Redux/fetures/authentication";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("Teams");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { teamsTable, allUsers, matchOfficials } = useSelector(
    (state) => state.AdminSlice
  );

  const isAdmin = localStorage.getItem("admintoken");

  // State for pagination and filters
  const [visibleTeams, setVisibleTeams] = useState(10);
  const [visibleUsers, setVisibleUsers] = useState(10);
  const [visibleOfficials, setVisibleOfficials] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "newest",
    playerCount: "all",
    matchStatus: "all",
  });

  const [userFilters, setUserFilters] = useState({
    search: "",
    sortBy: "newest",
    type: "all", // all, players, non-players
  });

  // Add loading states
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingOfficials, setIsLoadingOfficials] = useState(false);

  // Add filter state for match officials
  const [officialFilters, setOfficialFilters] = useState({
    search: "",
    sortBy: "newest", // newest, oldest, mostMatches
    status: "all", // all, active, inactive
  });

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "Teams") {
        setIsLoadingTeams(true);
        dispatch(fetchTeamTable())
          .catch((error) => {
            showToast(error.message || "Error while fetching teams table!");
          })
          .finally(() => setIsLoadingTeams(false));
      } else if (activeTab === "Players") {
        setIsLoadingUsers(true);
        dispatch(fetchAllUsers())
          .catch((error) => {
            showToast(error.message || "Error while fetching users!");
          })
          .finally(() => setIsLoadingUsers(false));
      } else if (activeTab === "Match Official") {
        setIsLoadingOfficials(true);
        dispatch(fetchMatchOfficials())
          .catch((error) => {
            showToast(error.message || "Error while fetching match officials!");
          })
          .finally(() => setIsLoadingOfficials(false));
      }
    }
  }, [dispatch, activeTab]);

  // Filter and sort teams
  const filteredTeams = teamsTable?.teams
    ?.filter((team) => {
      const matchesSearch =
        team.teamname.toLowerCase().includes(filters.search.toLowerCase()) ||
        team.country.toLowerCase().includes(filters.search.toLowerCase()) ||
        team.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPlayerCount =
        filters.playerCount === "all"
          ? true
          : filters.playerCount === "more10"
          ? team.stats.totalPlayers >= 10
          : filters.playerCount === "less10"
          ? team.stats.totalPlayers < 10
          : true;

      const matchesStatus =
        filters.matchStatus === "all"
          ? true
          : filters.matchStatus === "active"
          ? team.stats.totalMatches > 0
          : filters.matchStatus === "inactive"
          ? team.stats.totalMatches === 0
          : true;

      return matchesSearch && matchesPlayerCount && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (filters.sortBy === "mostPlayers")
        return b.stats.totalPlayers - a.stats.totalPlayers;
      if (filters.sortBy === "mostMatches")
        return b.stats.totalMatches - a.stats.totalMatches;
      return 0;
    });

  // Filter and sort users
  const filteredUsers = allUsers?.users
    ?.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(userFilters.search.toLowerCase()) ||
        user.country.toLowerCase().includes(userFilters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(userFilters.search.toLowerCase());

      const matchesType =
        userFilters.type === "all"
          ? true
          : userFilters.type === "players"
          ? user.isPlayer
          : !user.isPlayer;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (userFilters.sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (userFilters.sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (userFilters.sortBy === "mostGoals")
        return (b.stats?.totalGoals || 0) - (a.stats?.totalGoals || 0);
      if (userFilters.sortBy === "mostAssists")
        return (b.stats?.totalAssists || 0) - (a.stats?.totalAssists || 0);
      return 0;
    });

  // Filter and sort match officials
  const filteredOfficials = matchOfficials?.matchofficial
    ?.filter((official) => {
      const matchesSearch =
        official.name
          .toLowerCase()
          .includes(officialFilters.search.toLowerCase()) ||
        official.email
          .toLowerCase()
          .includes(officialFilters.search.toLowerCase());

      const matchesStatus =
        officialFilters.status === "all"
          ? true
          : officialFilters.status === "active"
          ? official.stats.totalMatches > 0
          : official.stats.totalMatches === 0;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (officialFilters.sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (officialFilters.sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (officialFilters.sortBy === "mostMatches")
        return b.stats.totalMatches - a.stats.totalMatches;
      return 0;
    });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle delete team
  const handleDeleteTeam = (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
    }
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
    }
  };

  const handleOtherTeamProfile = async (teamid) => {
    try {
      dispatch(fetchCommonTeams(teamid));
      navigate(`/CommonTeamProfile/${teamid}`);
    } catch (error) {
      showToast(error.message || "Error while fetching player profile!");
    }
  };

  const handleOtherUserProfile = async (userid) => {
    try {
      dispatch(fetchOtherUser(userid));
      navigate(`/CommonUser/${userid}`);
    } catch (error) {
      showToast(error.message || "Error while fetching player profile!");
    }
  };

  return (
    <>
      {isAdmin && (
        <div className="container mt-3">
          {/* Navbar with improved styling */}
          <ul className="nav nav-tabs mt-3 d-flex flex-nowrap overflow-auto">
            {["Teams", "Players", "Match Official"].map((tab) => (
              <li key={tab} className="nav-item">
                <button
                  className={`nav-link  ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          {/* Content */}
          <div className="mt-4">
            {activeTab === "Teams" && (
              <>
                {/* Add records count */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">
                    Total Teams:{" "}
                    <span className="text-primary">
                      {filteredTeams?.length || 0}
                    </span>
                  </h5>
                </div>

                {/* Filter Section with improved styling */}
                <div className="card filter-card mb-4">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="search-wrapper">
                          <i className="fas fa-search search-icon"></i>
                          <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search teams..."
                            value={filters.search}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                search: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select custom-select"
                          value={filters.sortBy}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              sortBy: e.target.value,
                            }))
                          }
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="mostPlayers">Most Players</option>
                          <option value="mostMatches">Most Matches</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select custom-select"
                          value={filters.playerCount}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              playerCount: e.target.value,
                            }))
                          }
                        >
                          <option value="all">All Teams</option>
                          <option value="more10">10+ Players</option>
                          <option value="less10">&lt;10 Players</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select custom-select"
                          value={filters.matchStatus}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              matchStatus: e.target.value,
                            }))
                          }
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active Teams</option>
                          <option value="inactive">Inactive Teams</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teams Table with improved styling */}
                <div className="card table-card">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover table-borderless mb-0">
                        <thead>
                          <tr className="bg-light">
                            <th className="px-4 py-3 text-muted">#</th>
                            <th className="px-4 py-3 text-muted">Team Info</th>
                            <th className="px-4 py-3 text-center text-muted">
                              Matches
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Performance
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Squad Size
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Created On
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoadingTeams ? (
                            <tr>
                              <td colSpan="7" className="text-center py-5">
                                <div
                                  className="spinner-border text-primary"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ) : filteredTeams?.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center py-5">
                                <div className="no-data">
                                  <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                                  <p className="text-muted">
                                    No teams found matching your criteria
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredTeams
                              ?.slice(0, visibleTeams)
                              .map((team, index) => (
                                <tr
                                  key={team.teamId}
                                  className="border-bottom table-row-hover cursor-pointer"
                                  onClick={() =>
                                    handleOtherTeamProfile(team.teamId)
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="px-4 py-3">{index + 1}</td>
                                  <td className="px-4 py-3">
                                    <div className="d-flex align-items-center">
                                      <div className="team-logo me-3">
                                        <img
                                          src={team.teamlogo}
                                          alt={team.teamname}
                                          className="rounded-circle"
                                          style={{
                                            width: "45px",
                                            height: "45px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <h6 className="mb-0">
                                          {team.teamname}
                                        </h6>
                                        <small className="text-muted d-block">
                                          {team.country}
                                        </small>
                                        <small className="text-muted">
                                          {team.email}
                                        </small>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="d-block h5 mb-0">
                                      {team.stats.totalMatches}
                                    </span>
                                    <small className="text-muted">
                                      Total Games
                                    </small>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="d-flex justify-content-center gap-3">
                                      <div className="text-center">
                                        <span
                                          className="d-block fw-bold"
                                          style={{ color: "#28a745" }}
                                        >
                                          {team.stats.wins}
                                        </span>
                                        <small className="text-muted">
                                          Wins
                                        </small>
                                      </div>
                                      <div className="text-center">
                                        <span
                                          className="d-block fw-bold"
                                          style={{ color: "#dc3545" }}
                                        >
                                          {team.stats.losses}
                                        </span>
                                        <small className="text-muted">
                                          Losses
                                        </small>
                                      </div>
                                      <div className="text-center">
                                        <span
                                          className="d-block fw-bold"
                                          style={{ color: "#17a2b8" }}
                                        >
                                          {team.stats.draws}
                                        </span>
                                        <small className="text-muted">
                                          Draws
                                        </small>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="d-block h5 mb-0">
                                      {team.stats.totalPlayers}
                                    </span>
                                    <small className="text-muted">
                                      Players
                                    </small>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="d-block">
                                      {formatDate(team.createdAt)}
                                    </span>
                                  </td>
                                  <td
                                    className="px-4 py-3 text-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="dropdown">
                                      <button
                                        className="btn btn-link text-dark p-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="fas fa-ellipsis-v"></i>
                                      </button>
                                      <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                          <button
                                            className="dropdown-item text-danger"
                                            onClick={() =>
                                              handleDeleteTeam(team.teamId)
                                            }
                                          >
                                            <i className="fas fa-trash-alt me-2"></i>
                                            Delete
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Load More Button with improved styling */}
                    {filteredTeams?.length > visibleTeams && (
                      <div className="text-center p-4">
                        <button
                          className="btn btn-outline-primary load-more-btn"
                          onClick={() => setVisibleTeams((prev) => prev + 10)}
                        >
                          <i className="fas fa-chevron-down me-2"></i>
                          Load More Teams
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "Players" && (
              <>
                {/* Add records count */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">
                    Total Users:{" "}
                    <span className="text-primary">
                      {filteredUsers?.length || 0}
                    </span>
                    <span className="mx-2">•</span>
                    Players:{" "}
                    <span className="text-success">
                      {filteredUsers?.filter((user) => user.isPlayer).length ||
                        0}
                    </span>
                    <span className="mx-2">•</span>
                    Non-Players:{" "}
                    <span className="text-secondary">
                      {filteredUsers?.filter((user) => !user.isPlayer).length ||
                        0}
                    </span>
                  </h5>
                </div>

                {/* Filter Section */}
                <div className="card filter-card mb-4">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="search-wrapper">
                          <i className="fas fa-search search-icon"></i>
                          <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search users..."
                            value={userFilters.search}
                            onChange={(e) =>
                              setUserFilters((prev) => ({
                                ...prev,
                                search: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select custom-select"
                          value={userFilters.sortBy}
                          onChange={(e) =>
                            setUserFilters((prev) => ({
                              ...prev,
                              sortBy: e.target.value,
                            }))
                          }
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="mostGoals">Most Goals</option>
                          <option value="mostAssists">Most Assists</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select custom-select"
                          value={userFilters.type}
                          onChange={(e) =>
                            setUserFilters((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                        >
                          <option value="all">All Users</option>
                          <option value="players">Players Only</option>
                          <option value="non-players">Non-Players</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="card table-card">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover table-borderless mb-0">
                        <thead>
                          <tr className="bg-light">
                            <th className="px-4 py-3 text-muted">#</th>
                            <th className="px-4 py-3 text-muted">User Info</th>
                            <th className="px-4 py-3 text-center text-muted">
                              Status
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Team
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Stats
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Joined On
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoadingUsers ? (
                            <tr>
                              <td colSpan="7" className="text-center py-5">
                                <div
                                  className="spinner-border text-primary"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ) : filteredUsers?.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center py-5">
                                <div className="no-data">
                                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                                  <p className="text-muted">
                                    No users found matching your criteria
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredUsers
                              ?.slice(0, visibleUsers)
                              .map((user, index) => (
                                <tr
                                  key={user.userId}
                                  className="border-bottom table-row-hover cursor-pointer"
                                  onClick={() =>
                                    handleOtherUserProfile(user.userId)
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="px-4 py-3">{index + 1}</td>
                                  <td className="px-4 py-3">
                                    <div className="d-flex align-items-center">
                                      <div className="team-logo me-3">
                                        <img
                                          src={
                                            user.pic || "/default-avatar.png"
                                          }
                                          alt={user.name}
                                          className="rounded-circle"
                                          style={{
                                            width: "45px",
                                            height: "45px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <h6 className="mb-0">{user.name}</h6>
                                        <small className="text-muted d-block">
                                          {user.country}
                                        </small>
                                        <small className="text-muted">
                                          {user.email}
                                        </small>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span
                                      className={`badge ${
                                        user.isPlayer
                                          ? "bg-success"
                                          : "bg-secondary"
                                      }`}
                                    >
                                      {user.isPlayer ? "Player" : "Non-Player"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {user.isPlayer ? (
                                      <div className="d-flex align-items-center justify-content-center">
                                        <img
                                          src={
                                            user.player.team.teamlogo ||
                                            "/default-team.png"
                                          }
                                          alt={user.player.team.teamname}
                                          className="rounded-circle me-2"
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <span>{user.player.team.teamname}</span>
                                      </div>
                                    ) : (
                                      <span className="text-muted">-</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {user.isPlayer ? (
                                      <div className="d-flex justify-content-center gap-3">
                                        <div className="text-center">
                                          <span
                                            className="d-block fw-bold"
                                            style={{ color: "#28a745" }}
                                          >
                                            {user.stats.totalGoals}
                                          </span>
                                          <small className="text-muted">
                                            Goals
                                          </small>
                                        </div>
                                        <div className="text-center">
                                          <span
                                            className="d-block fw-bold"
                                            style={{ color: "#17a2b8" }}
                                          >
                                            {user.stats.totalAssists}
                                          </span>
                                          <small className="text-muted">
                                            Assists
                                          </small>
                                        </div>
                                        <div className="text-center">
                                          <span
                                            className="d-block fw-bold"
                                            style={{ color: "#6c757d" }}
                                          >
                                            {user.stats.totalMatches}
                                          </span>
                                          <small className="text-muted">
                                            Matches
                                          </small>
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-muted">-</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="d-block">
                                      {formatDate(user.createdAt)}
                                    </span>
                                  </td>
                                  <td
                                    className="px-4 py-3 text-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="dropdown">
                                      <button
                                        className="btn btn-link text-dark p-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="fas fa-ellipsis-v"></i>
                                      </button>
                                      <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                          <button
                                            className="dropdown-item text-danger"
                                            onClick={() =>
                                              handleDeleteUser(user.userId)
                                            }
                                          >
                                            <i className="fas fa-trash-alt me-2"></i>
                                            Delete
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Load More Button */}
                    {filteredUsers?.length > visibleUsers && (
                      <div className="text-center p-4">
                        <button
                          className="btn btn-outline-primary load-more-btn"
                          onClick={() => setVisibleUsers((prev) => prev + 10)}
                        >
                          <i className="fas fa-chevron-down me-2"></i>
                          Load More Users
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "Match Official" && (
              <>
                {/* Add records count */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">
                    Total Officials:{" "}
                    <span className="text-primary">
                      {filteredOfficials?.length || 0}
                    </span>
                    <span className="mx-2">•</span>
                    Total Matches:{" "}
                    <span className="text-success">
                      {matchOfficials?.totalMatches || 0}
                    </span>
                  </h5>
                </div>

                {/* Filter Section */}
                <div className="card filter-card mb-4">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="search-wrapper">
                          <i className="fas fa-search search-icon"></i>
                          <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search officials..."
                            value={officialFilters.search}
                            onChange={(e) =>
                              setOfficialFilters((prev) => ({
                                ...prev,
                                search: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select custom-select"
                          value={officialFilters.sortBy}
                          onChange={(e) =>
                            setOfficialFilters((prev) => ({
                              ...prev,
                              sortBy: e.target.value,
                            }))
                          }
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="mostMatches">Most Matches</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select custom-select"
                          value={officialFilters.status}
                          onChange={(e) =>
                            setOfficialFilters((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                        >
                          <option value="all">All Officials</option>
                          <option value="active">Active Officials</option>
                          <option value="inactive">Inactive Officials</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Officials Table */}
                <div className="card table-card">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover table-borderless mb-0">
                        <thead>
                          <tr className="bg-light">
                            <th className="px-4 py-3 text-muted">#</th>
                            <th className="px-4 py-3 text-muted">
                              Official Info
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Total Matches
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Recent Matches
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Joined On
                            </th>
                            <th className="px-4 py-3 text-center text-muted">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoadingOfficials ? (
                            <tr>
                              <td colSpan="6" className="text-center py-5">
                                <div
                                  className="spinner-border text-primary"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ) : !matchOfficials?.matchofficial?.length ? (
                            <tr>
                              <td colSpan="6" className="text-center py-5">
                                <div className="no-data">
                                  <i className="fas fa-user-tie fa-3x text-muted mb-3"></i>
                                  <p className="text-muted">
                                    No match officials found
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredOfficials
                              .slice(0, visibleOfficials)
                              .map((official, index) => (
                                <tr
                                  key={official.officialId}
                                  className="border-bottom table-row-hover"
                                >
                                  <td className="px-4 py-3">{index + 1}</td>
                                  <td className="px-4 py-3">
                                    <div className="d-flex align-items-center">
                                      <div className="official-icon me-3">
                                        <i className="fas fa-user-tie fa-2x text-primary"></i>
                                      </div>
                                      <div>
                                        <h6 className="mb-0">
                                          {official.name}
                                        </h6>
                                        <small className="text-muted">
                                          {official.email}
                                        </small>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="d-block h5 mb-0">
                                      {official.stats.totalMatches}
                                    </span>
                                    <small className="text-muted">
                                      Matches Created
                                    </small>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="recent-matches">
                                      {official.stats.recentMatches.length >
                                      0 ? (
                                        official.stats.recentMatches.map(
                                          (match, idx) => (
                                            <div
                                              key={match.matchId}
                                              className="match-item mb-2"
                                            >
                                              <small className="d-block">
                                                {match.teamA} vs {match.teamB}
                                              </small>
                                              <small className="text-muted">
                                                {formatDate(match.date)} -{" "}
                                                {match.status}
                                              </small>
                                            </div>
                                          )
                                        )
                                      ) : (
                                        <small className="text-muted">
                                          No recent matches
                                        </small>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="d-block">
                                      {formatDate(official.createdAt)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="dropdown">
                                      <button
                                        className="btn btn-link text-dark p-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="fas fa-ellipsis-v"></i>
                                      </button>
                                      <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                          <button
                                            className="dropdown-item text-danger"
                                            onClick={() =>
                                              handleDeleteOfficial(
                                                official.officialId
                                              )
                                            }
                                          >
                                            <i className="fas fa-trash-alt me-2"></i>
                                            Delete
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Load More Button */}
                    {matchOfficials?.matchofficial?.length >
                      visibleOfficials && (
                      <div className="text-center p-4">
                        <button
                          className="btn btn-outline-primary load-more-btn"
                          onClick={() =>
                            setVisibleOfficials((prev) => prev + 10)
                          }
                        >
                          <i className="fas fa-chevron-down me-2"></i>
                          Load More Officials
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
