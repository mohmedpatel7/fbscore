import React, { useEffect, useState } from "react";
import {
  fetchTeamRequests,
  adminAcTeamReq,
  fetchMatchOfficialReq,
  adminAcMatchOfficialReq,
} from "../../Redux/fetures/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";

export default function Requests() {
  const [activeTab, setActiveTab] = useState("Team Request");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { teamReq, matchOfficialReq, isLoading, error } = useSelector(
    (state) => state.AdminSlice
  );

  const isAdmin = localStorage.getItem("admintoken");

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "Team Request") {
        dispatch(fetchTeamRequests());
      } else if (activeTab === "Match Official Request") {
        dispatch(fetchMatchOfficialReq());
      }
    }
  }, [dispatch, isAdmin, activeTab]);

  const handleTeamAction = async (reqId, action) => {
    try {
      await dispatch(adminAcTeamReq({ reqId, action })).unwrap();
      showToast(
        `Request ${action === "accept" ? "accepted" : "rejected"} successfully`,
        "success"
      );
      dispatch(fetchTeamRequests());
    } catch (error) {
      showToast(error.message || "Failed to process request", "danger");
    }
  };

  const handleOfficialAction = async (reqId, action) => {
    try {
      await dispatch(adminAcMatchOfficialReq({ reqId, action })).unwrap();
      showToast(
        `Request ${action === "accept" ? "accepted" : "rejected"} successfully`,
        "success"
      );
      dispatch(fetchMatchOfficialReq());
    } catch (error) {
      showToast(error.message || "Failed to process request", "danger");
    }
  };

  // Filter and sort requests
  const filteredTeamRequests = teamReq?.requests
    ?.filter(
      (request) =>
        request.teamname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  const filteredOfficialRequests = matchOfficialReq?.requist
    ?.filter(
      (request) =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  if (!isAdmin) {
    navigate("/AdminSignin");
    return null;
  }

  return (
    <div className="container px-4 py-3">
      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-4">
        {["Team Request", "Match Official Request"].map((tab) => (
          <li key={tab} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title">{activeTab}</h2>
          <div className="d-flex gap-3">
            <div className="search-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="form-control search-input"
                placeholder={`Search ${
                  activeTab === "Team Request" ? "teams" : "officials"
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select custom-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="card table-card">
          <div className="card-body">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            ) : activeTab === "Team Request" ? (
              // Team Requests Table
              filteredTeamRequests?.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5>No team requests found</h5>
                  <p className="text-muted">
                    There are no pending team requests at the moment.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Team</th>
                        <th>Country</th>
                        <th>Email</th>
                        <th>Requested On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeamRequests?.map((request) => (
                        <tr key={request.requestId} className="table-row-hover">
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={request.teamlogo}
                                alt={request.teamname}
                                className="rounded-circle me-2"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                }}
                              />
                              <span>{request.teamname}</span>
                            </div>
                          </td>
                          <td>{request.country}</td>
                          <td>{request.email}</td>
                          <td>
                            {new Date(request.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleTeamAction(request.requestId, "reject")
                                }
                              >
                                <i className="fas fa-times me-1"></i>
                                Reject
                              </button>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleTeamAction(request.requestId, "accept")
                                }
                              >
                                <i className="fas fa-check me-1"></i>
                                Accept
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : // Match Official Requests Table
            filteredOfficialRequests?.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5>No match official requests found</h5>
                <p className="text-muted">
                  There are no pending match official requests at the moment.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Official</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOfficialRequests?.map((request) => (
                      <tr key={request.reqId} className="table-row-hover">
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="official-icon me-2">
                              <i className="fas fa-user-tie"></i>
                            </div>
                            <span>{request.name}</span>
                          </div>
                        </td>
                        <td>{request.email}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleOfficialAction(request.reqId, "reject")
                              }
                            >
                              <i className="fas fa-times me-1"></i>
                              Reject
                            </button>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                handleOfficialAction(request.reqId, "accept")
                              }
                            >
                              <i className="fas fa-check me-1"></i>
                              Accept
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
