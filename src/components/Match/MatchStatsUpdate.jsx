import React, {
  useEffect,
  useState,
  useTransition,
  useOptimistic,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMatchDetails,
  updateMatchStats,
} from "../../Redux/fetures/Matchofficial";
import { useToast } from "../Genral/ToastContext";

export default function MatchStatsUpdate() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { matchDetails } = useSelector((state) => state.matchOfficialSlice);

  const [step, setStep] = useState(1);
  const [selectedTeamKey, setSelectedTeamKey] = useState(null); // Use teamKey for rendering
  const [selectedTeamId, setSelectedTeamId] = useState(null); // Use teamId for backend
  const [selectedScorer, setSelectedScorer] = useState(null);
  const [selectedAssist, setSelectedAssist] = useState(null);
  const [isPending, startTransition] = useTransition();

  // Optimistic update for score
  const [optimisticMatchDetails, addOptimisticUpdate] = useOptimistic(
    matchDetails || {},
    (state, newGoal) => {
      // Create a copy of the current state
      const updatedState = { ...state };

      // Update the score for the team that scored
      if (!updatedState.score) {
        updatedState.score = { teamA: 0, teamB: 0 };
      }

      // Increment the score for the team that scored
      if (newGoal.teamKey === "teamA") {
        updatedState.score.teamA = (updatedState.score.teamA || 0) + 1;
      } else if (newGoal.teamKey === "teamB") {
        updatedState.score.teamB = (updatedState.score.teamB || 0) + 1;
      }

      return updatedState;
    }
  );

  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [dataFetched, setDataFetched] = useState(false); // Track if data was successfully fetched

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

  // Check if match is live
  const isMatchLive = matchDetails.status === "Live";

  // Function to handle goal submission with optimistic update
  const handleGoalSubmit = () => {
    // Don't allow updates if match is not live
    if (!isMatchLive) {
      showToast("Stats can only be updated for live matches!", "warning");
      return;
    }

    const payload = {
      teamId: selectedTeamId,
      scorerId: selectedScorer.id,
      assistId: selectedAssist?.id || null,
    };

    // Apply optimistic update immediately
    addOptimisticUpdate({ teamKey: selectedTeamKey });

    // Reset the form
    setStep(1);

    // Dispatch the actual update
    startTransition(() => {
      dispatch(updateMatchStats({ matchId, payload }))
        .then(() => {
          showToast("Match stats updated successfully!", "success");
          // Refresh match details to get the updated data from server
          dispatch(fetchMatchDetails(matchId));
        })
        .catch((error) => {
          showToast(error.message || "Failed to update match stats!", "danger");
          // You might want to refresh match details here too to reset the optimistic update
          dispatch(fetchMatchDetails(matchId));
        });
    });
  };

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
                {optimisticMatchDetails?.score?.teamA || 0} :{" "}
                {optimisticMatchDetails?.score?.teamB || 0}
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

      {!isMatchLive ? (
        <div className="alert alert-warning text-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Stats can only be updated for live matches. This match is currently{" "}
          {matchDetails.status}.
        </div>
      ) : (
        <>
          {step === 1 && (
            <div>
              <h5>Select the team that scored:</h5>
              <div className="row">
                {[
                  { key: "teamA", team: teamA },
                  { key: "teamB", team: teamB },
                ].map(
                  ({ key, team }) =>
                    team && ( // Ensure team is defined
                      <div key={key} className="col-md-6">
                        <div
                          className="card text-center p-3 cursor-pointer"
                          onClick={() => {
                            setSelectedTeamKey(key); // Set teamKey for UI
                            setSelectedTeamId(team.id); // Set teamId for backend
                            setStep(2);
                          }}
                        >
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="rounded-circle mx-auto"
                            style={{ width: "80px", height: "80px" }}
                          />
                          <h5 className="mt-2">{team.name}</h5>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {step === 2 && selectedTeamKey && (
            <div>
              <h5>Select the player who scored:</h5>
              <div className="row">
                {(matchDetails.teams[selectedTeamKey]?.players || []).map(
                  (player) => (
                    <div key={player.id} className="col-md-6">
                      <div
                        className="card d-flex flex-row align-items-center p-2 mb-2"
                        onClick={() => {
                          setSelectedScorer(player);
                          setStep(3);
                        }}
                      >
                        <img
                          src={player.pic || "default-pic.jpg"}
                          alt={player.name}
                          className="rounded-circle"
                          style={{ width: "50px", height: "50px" }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{player.name}</h6>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <button
                className="btn btn-secondary mt-3"
                onClick={() => setStep(1)}
              >
                Back
              </button>
            </div>
          )}

          {step === 3 && selectedScorer && (
            <div>
              <h5>Select the player who assisted (Optional):</h5>
              <div className="row">
                {(matchDetails.teams[selectedTeamKey]?.players || [])
                  .filter((player) => player.id !== selectedScorer.id)
                  .map((player) => (
                    <div key={player.id} className="col-md-6">
                      <div
                        className={`card d-flex flex-row align-items-center p-2 mb-2 ${
                          selectedAssist?.id === player.id
                            ? "border-primary"
                            : ""
                        }`}
                        onClick={() => {
                          // Toggle selection - if already selected, deselect it
                          if (selectedAssist?.id === player.id) {
                            setSelectedAssist(null);
                          } else {
                            setSelectedAssist(player);
                          }
                        }}
                      >
                        <img
                          src={player.pic || "default-pic.jpg"}
                          alt={player.name}
                          className="rounded-circle"
                          style={{ width: "50px", height: "50px" }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{player.name}</h6>
                        </div>
                        {selectedAssist?.id === player.id && (
                          <div className="ms-auto">
                            <span className="badge bg-primary">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-3 d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <button
                  className="btn btn-secondary w-100 w-sm-auto"
                  style={{ minWidth: "80px", height: "40px" }}
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button
                  className="btn btn-signup w-100 w-sm-auto"
                  style={{ minWidth: "80px", height: "40px" }}
                  onClick={() => setStep(4)}
                >
                  {selectedAssist ? "Continue with Assist" : "Skip Assist"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h5>Review and Submit Stats</h5>
              <div className="mt-3">
                <p>
                  <strong>Team:</strong>{" "}
                  {matchDetails.teams[selectedTeamKey]?.name}
                </p>
                <p>
                  <strong>Scorer:</strong> {selectedScorer?.name}
                </p>
                {selectedAssist && (
                  <p>
                    <strong>Assist:</strong> {selectedAssist?.name}
                  </p>
                )}
              </div>
              <button
                className="btn btn-signup mt-3"
                onClick={handleGoalSubmit}
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
