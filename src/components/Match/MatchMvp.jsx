import React, { useEffect, useState, useTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMatchDetails,
  updateMatchMvp,
} from "../../Redux/fetures/Matchofficial";
import { useToast } from "../Genral/ToastContext";

export default function MatchMvp() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { matchDetails } = useSelector((state) => state.matchOfficialSlice);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  // If we have data, mark as fetched
  useEffect(() => {
    if (matchDetails && matchDetails.matchId) {
      setDataFetched(true);
      setIsLoading(false);
    }
  }, [matchDetails]);

  // Fetch match details on mount
  useEffect(() => {
    if (matchId) {
      setIsLoading(true);
      setDataFetched(false);

      dispatch(fetchMatchDetails(matchId))
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          showToast(
            error.message || "Failed to fetch match details!",
            "danger"
          );
          setIsLoading(false);
        });
    }
  }, [dispatch, matchId, showToast]);

  // Render loading state
  if (isLoading) {
    return <></>;
  }

  // Extract teams for easier access
  const { teamA, teamB } = matchDetails.teams || {};

  // Check if match is finished
  const isMatchFinished = matchDetails.status === "Full Time";

  // Function to handle MVP selection
  const handleMvpSubmit = () => {
    // Don't allow updates if match is not finished
    if (!isMatchFinished) {
      showToast(
        "MVP can only be assigned after the match is finished!",
        "warning"
      );
      return;
    }

    if (!selectedPlayer) {
      showToast("Please select a player first!", "warning");
      return;
    }

    // Dispatch the update using the player's ID directly
    startTransition(() => {
      dispatch(updateMatchMvp({ matchId, playerId: selectedPlayer.id }))
        .then(() => {
          showToast("Match MVP updated successfully!", "success");
          // Refresh match details to get the updated data from server
          dispatch(fetchMatchDetails(matchId));
        })
        .catch((error) => {
          showToast(error.message || "Failed to update match MVP!", "danger");
        });
    });
  };

  // Render player card
  const renderPlayerCard = (player, teamName, teamLogo) => (
    <div key={player.id} className="col-md-6 mb-3">
      <div
        className={`card d-flex flex-row align-items-center p-3 ${
          selectedPlayer?.id === player.id ? "border-primary" : ""
        }`}
        onClick={() => setSelectedPlayer(player)}
        style={{
          cursor: "pointer",
          boxShadow:
            selectedPlayer?.id === player.id
              ? "0 4px 12px rgba(13, 110, 253, 0.25)"
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          borderRadius: "10px",
          transform:
            selectedPlayer?.id === player.id ? "translateY(-2px)" : "none",
        }}
        onMouseOver={(e) => {
          if (selectedPlayer?.id !== player.id) {
            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseOut={(e) => {
          if (selectedPlayer?.id !== player.id) {
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
            e.currentTarget.style.transform = "none";
          }
        }}
      >
        <div className="d-flex align-items-center">
          <img
            src={player.pic || "default-pic.jpg"}
            alt={player.name}
            className="rounded-circle"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              border: "2px solid #f0f0f0",
            }}
          />
          <div className="ms-3">
            <h6 className="mb-0 fw-bold">{player.name}</h6>
            <div className="d-flex align-items-center mt-1">
              <img
                src={teamLogo}
                alt={teamName}
                className="rounded-circle me-1"
                style={{ width: "16px", height: "16px" }}
              />
              <small className="text-muted">{teamName}</small>
            </div>
          </div>
        </div>
        {selectedPlayer?.id === player.id && (
          <div className="ms-auto">
            <span className="badge bg-primary px-3 py-2">Selected</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div
        className="card shadow-sm text-center mx-auto mb-3"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <div className="card-body p-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center flex-column">
              <img
                src={teamA?.logo}
                alt="Team A"
                className="rounded-circle"
                style={{ width: "50px", height: "50px" }}
              />
              <span className="fw-semibold">{teamA?.name}</span>
            </div>
            <div className="text-center my-2">
              <div className="fw-bold fs-4">
                {matchDetails?.score?.teamA || 0} :{" "}
                {matchDetails?.score?.teamB || 0}
              </div>
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
            </div>
            <div className="d-flex align-items-center flex-column">
              <img
                src={teamB?.logo || "/placeholder.svg"}
                alt="Team B"
                className="rounded-circle"
                style={{ width: "50px", height: "50px" }}
              />
              <span className="fw-semibold">{teamB?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {!isMatchFinished ? (
        <div className="alert alert-warning text-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          MVP can only be assigned after the match is finished. This match is
          currently {matchDetails.status}.
        </div>
      ) : (
        <>
          <h5 className="text-center mb-4">Select Match MVP</h5>

          {/* Display current MVP if exists */}
          {matchDetails.mvp && (
            <div className="alert alert-success text-center mb-4">
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={matchDetails.mvp.pic || "default-pic.jpg"}
                  alt={matchDetails.mvp.name}
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px" }}
                />
                <div>
                  <strong>Current MVP:</strong> {matchDetails.mvp.name} (
                  {matchDetails.mvp.teamName})
                </div>
              </div>
            </div>
          )}

          {/* Team A Players */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex align-items-center bg-light">
              <img
                src={teamA?.logo}
                alt={teamA?.name}
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
              <h5 className="mb-0">{teamA?.name} Players</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {teamA?.players?.map((player) =>
                  renderPlayerCard(player, teamA.name, teamA.logo)
                )}
              </div>
            </div>
          </div>

          {/* Team B Players */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex align-items-center bg-light">
              <img
                src={teamB?.logo}
                alt={teamB?.name}
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
              <h5 className="mb-0">{teamB?.name} Players</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {teamB?.players?.map((player) =>
                  renderPlayerCard(player, teamB.name, teamB.logo)
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-4 mb-5">
            <button
              className="btn btn-signup"
              onClick={handleMvpSubmit}
              disabled={isPending || !selectedPlayer}
              style={{
                width: "200px",
                height: "45px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                fontWeight: "bold",
              }}
            >
              {isPending ? "Updating..." : "Assign as MVP"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
