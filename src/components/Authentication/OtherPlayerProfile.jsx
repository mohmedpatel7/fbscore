import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPlayerProfile } from "../../Redux/fetures/authentication";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";

export default function OtherPlayerProfile() {
  const { playerId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { playerProfile } = useSelector((state) => state.authSlice);

  useEffect(() => {
    dispatch(fetchPlayerProfile(playerId));
  }, [dispatch, playerId]);

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4 position-relative">
        <div className="row g-4 align-items-center">
          <div className="col-md-4 text-center border-end">
            <img
              src={playerProfile?.player?.user?.pic}
              alt="Profile"
              className="rounded-circle border border-3"
              style={{ height: "150px", width: "150px", objectFit: "cover" }}
            />
            <h4 className="fw-bold mt-3">
              {playerProfile?.player?.user?.name}
            </h4>
            <h4>{playerProfile?.player?.playerNo}</h4>
          </div>

          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6">
                <h5 className="fw-bold" style={{ color: "#45b469" }}>
                  Contact Details
                </h5>
                <hr />
                <p>
                  <strong className="text-muted">Email:</strong>{" "}
                  {playerProfile?.player?.user?.email || "N/A"}
                </p>
                <p>
                  <strong className="text-muted">Country:</strong>{" "}
                  {playerProfile?.player?.user?.country}
                </p>
              </div>
              <div className="col-md-6 border-start">
                <h5 className="fw-bold" style={{ color: "#45b469" }}>
                  Personal Details
                </h5>
                <hr />
                <p>
                  <strong className="text-muted">Age:</strong>{" "}
                  {playerProfile?.player?.user?.age}
                </p>
                <p>
                  <strong className="text-muted">Gender:</strong>{" "}
                  {playerProfile?.player?.user?.gender}
                </p>
                <p>
                  <strong className="text-muted">Strong Foot:</strong>{" "}
                  {playerProfile?.player?.user?.foot}
                </p>
                <p>
                  <strong className="text-muted">Playing Position:</strong>{" "}
                  {playerProfile?.player?.user?.position}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top">
              <h5 className="fw-bold text-center" style={{ color: "#45b469" }}>
                Player Stats
              </h5>
              <div className="row text-center">
                <div className="col-6 border-end">
                  <h6 className="text-muted">Goals</h6>
                  <p className="fw-bold fs-4">
                    {playerProfile?.player?.stats?.totalgoals}
                  </p>
                </div>
                <div className="col-6">
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
          style={{ height: "150px", width: "150px", objectFit: "cover" }}
        />
        <div>
          <h4>{playerProfile?.player?.team?.teamname}</h4>
          <p>
            <strong>Owner:</strong> {playerProfile?.player?.team?.owner}
          </p>
          <p>
            <strong>Email:</strong> {playerProfile?.player?.team?.teamemail}
          </p>
          <p>
            <strong>Country:</strong> {playerProfile?.player?.team?.country}
          </p>
        </div>
      </div>

      <div className="card p-3 mt-3 mb-3 team-profile">
        <h5 className="fw-bold" style={{ color: "#45b469" }}>
          Current Team Stats
        </h5>
        <div className="row text-center">
          <div className="col-4 border-end">
            <h6 className="text-muted">Matches Played</h6>
            <p className="fw-bold fs-4">
              {playerProfile?.player?.stats?.totalmatches || 0}
            </p>
          </div>
          <div className="col-4 border-end">
            <h6 className="text-muted">Goals Scored</h6>
            <p className="fw-bold fs-4">
              {playerProfile?.player?.stats?.currentgoals || 0}
            </p>
          </div>
          <div className="col-4">
            <h6 className="text-muted">Assists Made</h6>
            <p className="fw-bold fs-4">
              {playerProfile?.player?.stats?.currentassists || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
