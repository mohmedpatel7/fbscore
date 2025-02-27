import { useEffect, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchPlayerProfile,
  releasePlayer,
} from "../../Redux/fetures/Teamslice";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";

export default function TeamPlayerProfile() {
  const [isPending, startTransition] = useTransition(); // Manage pending state for async transitions

  const { playerId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { playerProfile } = useSelector((state) => state.teamSlice);

  useEffect(() => {
    dispatch(fetchPlayerProfile(playerId));
  }, []);

  // Handle release player.
  const handleReleasePlayer = async (pid) => {
    startTransition(async () => {
      try {
        const result = await dispatch(releasePlayer(pid));
        showToast(result.message || "Player Release successfully.", "success");
        navigate("/TeamDashboard");
      } catch (error) {
        showToast(error.message || "Error while releasing player!", "danger");
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4 position-relative">
        {/* Three Dots Dropdown Menu */}
        <div className="position-absolute top-0 end-0 mt-2 me-2">
          <div className="dropdown">
            <button
              className="btn btn-light border-0"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
            >
              <li>
                <button
                  className="dropdown-item dt-release"
                  onClick={() => handleReleasePlayer(playerId)}
                  disabled={isPending}
                >
                  Release
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="row g-4 align-items-center">
          {/* Profile Image */}
          <div className="col-md-4 text-center border-end">
            <img
              src={playerProfile?.player?.user?.pic}
              alt="Profile"
              className="rounded-circle border border-3"
              style={{
                height: "150px",
                width: "150px",
                objectFit: "cover",
              }}
            />
            <h4 className="fw-bold mt-3">
              {playerProfile?.player?.user?.name}
            </h4>
            <br />
            <h4>{playerProfile?.player?.playerNo}</h4>
          </div>

          {/* User Info */}
          <div className="col-md-8">
            <div className="row">
              {/* Contact Details */}
              <div className="col-md-6">
                <h5 className="fw-bold" style={{ color: "#45b469" }}>
                  Contact Details
                </h5>
                <hr />
                <p className="text-muted mb-1">
                  <strong>Email:</strong>{" "}
                  {playerProfile?.player?.user?.email || "N/A"}
                </p>
                <p className="text-muted mb-1">
                  <strong>Country:</strong>{" "}
                  {playerProfile?.player?.user?.country}
                </p>
              </div>

              {/* Personal Details */}
              <div className="col-md-6 border-start">
                <h5 className="fw-bold" style={{ color: "#45b469" }}>
                  Personal Details
                </h5>
                <hr />
                <p className="text-muted mb-1">
                  <strong>Age:</strong> {playerProfile?.player?.user?.dob}
                </p>
                <p className="text-muted mb-1">
                  <strong>Gender:</strong> {playerProfile?.player?.user?.gender}
                </p>
                <p className="text-muted">
                  <strong>Strong Foot:</strong>{" "}
                  {playerProfile?.player?.user?.foot}
                </p>
              </div>
            </div>

            {/* Player Stats */}
            <div className="mt-4 pt-3 border-top">
              <h5 className="fw-bold text-center" style={{ color: "#45b469" }}>
                Player Stats
              </h5>
              <div className="row text-center">
                <div className="col-4 border-end">
                  <h6 className="text-muted">Matches</h6>
                  <p className="fw-bold fs-4">
                    {playerProfile?.player?.stats?.totalmatches}
                  </p>
                </div>
                <div className="col-4 border-end">
                  <h6 className="text-muted">Goals</h6>
                  <p className="fw-bold fs-4">
                    {playerProfile?.player?.stats?.totalgoals}
                  </p>
                </div>
                <div className="col-4">
                  <h6 className="text-muted">Assists</h6>
                  <p className="fw-bold fs-4">
                    {playerProfile?.player?.stats?.totalassits}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-3 d-flex flex-row align-items-center mt-3 mb-3 team-profile">
        <img
          src={playerProfile?.player?.team?.teamlogo}
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
          <h4>{playerProfile?.player?.team?.teamname}</h4>
          <p className="text-muted mb-1">
            <strong>Owner:</strong> {playerProfile?.player?.team?.owner}
          </p>
          <p className="text-muted mb-1">
            <strong>Email:</strong> {playerProfile?.player?.team?.teamemail}
          </p>
          <p className="text-muted">
            <strong>Country:</strong> {playerProfile?.player?.team?.country}
          </p>
        </div>
      </div>
    </div>
  );
}
