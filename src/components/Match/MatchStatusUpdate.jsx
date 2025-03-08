import React, {
  useEffect,
  useState,
  useTransition,
  useOptimistic,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchMatchDetails,
  updateMatchStatus,
} from "../../Redux/fetures/Matchofficial";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../Genral/ToastContext";

export default function MatchStatusUpdate() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { matchDetails } = useSelector((state) => state.matchOfficialSlice);

  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState("");

  // Using useOptimistic to update UI quickly
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    matchDetails?.status || ""
  );

  const isMatchOfficial = localStorage.getItem("matchOfficialtoken");

  useEffect(() => {
    if (isMatchOfficial && matchId) {
      dispatch(fetchMatchDetails(matchId));
    }
  }, [dispatch, matchId]);

  useEffect(() => {
    if (matchDetails?.status) {
      setSelectedStatus(matchDetails.status);
    }
  }, [matchDetails]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value.trim());
  };

  const handleUpdateStatus = () => {
    if (!selectedStatus) {
      showToast("Please select a status before updating!", "warning");
      return;
    }

    startTransition(() => {
      setOptimisticStatus(selectedStatus); // Optimistic UI update

      dispatch(updateMatchStatus({ matchId, status: selectedStatus }))
        .then(() => {
          showToast("Match status updated successfully!", "success");
          dispatch(fetchMatchDetails(matchId));
        })
        .catch((error) => {
          showToast(error.message || "Error updating match status!", "error");
        });
    });
  };

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
                src={matchDetails?.teams?.teamA?.logo || "/placeholder.svg"}
                alt={matchDetails?.teams?.teamA?.name}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <span className="ms-sm-2 mt-2 mt-sm-0 fw-semibold">
                {matchDetails?.teams?.teamA?.name}
              </span>
            </div>

            {/* Score */}
            <div className="text-center my-2" style={{ fontWeight: "bolder" }}>
              <span className="fs-4">
                {matchDetails?.score?.teamA} : {matchDetails?.score?.teamB}
              </span>
            </div>

            {/* Team B */}
            <div className="d-flex align-items-center flex-column flex-sm-row">
              <img
                src={matchDetails?.teams?.teamB?.logo || "/placeholder.svg"}
                alt={matchDetails?.teams?.teamB?.name}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <span className="ms-sm-2 mt-2 mt-sm-0 fw-semibold">
                {matchDetails?.teams?.teamB?.name}
              </span>
            </div>
          </div>

          {/* Horizontal Line */}
          <hr className="my-3" />

          {/* Match Status and Date */}
          <div className="d-flex justify-content-between flex-column flex-sm-row text-center">
            <span
              className={`badge ${
                optimisticStatus === "Full Time"
                  ? "bg-success"
                  : optimisticStatus === "Live"
                  ? "bg-danger"
                  : "bg-warning"
              } px-3 py-1`}
            >
              {optimisticStatus}
            </span>
            <span className="text-muted small mt-2 mt-sm-0">
              {matchDetails?.matchDate} | {matchDetails?.matchTime}
            </span>
          </div>

          {/* Status Dropdown */}
          <div className="mt-3">
            <label htmlFor="statusSelect" className="form-label fw-semibold">
              Update Match Status
            </label>
            <select
              id="statusSelect"
              className="form-select"
              value={selectedStatus}
              onChange={handleStatusChange}
              disabled={isPending}
            >
              <option value="">Select Status</option>
              {[
                "Upcoming",
                "Live",
                "Half Time",
                "Full Time",
                "Delayed",
                "Cancel",
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Update Button */}
          <button
            className="btn btn-primary mt-3 w-100"
            onClick={handleUpdateStatus}
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
