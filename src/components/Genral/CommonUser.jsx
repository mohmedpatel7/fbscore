import { useEffect, useTransition, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOtherUser } from "../../Redux/fetures/authentication";
import { SendPlayerReq } from "../../Redux/fetures/Teamslice";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";

export default function CommonUser() {
  const [isPending, startTransition] = useTransition();
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [playerNo, setPlayerNo] = useState("");

  const { userProfile } = useSelector((state) => state.authSlice);

  const isTeamOwner = localStorage.getItem("teamtoken");

  useEffect(() => {
    dispatch(fetchOtherUser(userId));
  }, [dispatch, userId]);

  // handle send player request.
  const handleSendPlayerReq = async (userId, playerNo, event) => {
    try {
      event.preventDefault(); // Prevent default form submission behavior

      startTransition(async () => {
        try {
          // Dispatch.
          const result = await dispatch(
            SendPlayerReq({ userId, playerNo })
          ).unwrap();
          // If we get here, it's a success
          showToast(
            result?.message || "Player request sent successfully.",
            "success"
          );
          setPlayerNo(""); // Clear the input field
        } catch (error) {
          showToast(error.message || "Error while sending request!", "danger");
        }
      });
    } catch (error) {
      showToast(error.message || " Please try again after few time.", "danger");
    }
  };

  // If userProfile is not loaded yet, show loading
  if (!userProfile) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading user profile...</p>
      </div>
    );
  }

  // Get user data from either player.user or directly from user
  const userData = userProfile.player
    ? userProfile.player.user
    : userProfile.user;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4 position-relative">
        <div className="row g-4 align-items-center">
          <div className="col-md-4 text-center border-end">
            <img
              src={userData?.pic}
              alt="Profile"
              className="rounded-circle border border-3"
              style={{ height: "150px", width: "150px", objectFit: "cover" }}
            />
            <h4 className="fw-bold mt-3">{userData?.name}</h4>
            {userProfile.player && <h4>{userProfile.player.playerNo}</h4>}
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
                  {userData?.email || "N/A"}
                </p>
                <p>
                  <strong className="text-muted">Country:</strong>{" "}
                  {userData?.country}
                </p>
              </div>
              <div className="col-md-6 border-start">
                <h5 className="fw-bold" style={{ color: "#45b469" }}>
                  Personal Details
                </h5>
                <hr />
                <p>
                  <strong className="text-muted">Age:</strong> {userData?.age}
                </p>
                <p>
                  <strong className="text-muted">Gender:</strong>{" "}
                  {userData?.gender}
                </p>
                <p>
                  <strong className="text-muted">Strong Foot:</strong>{" "}
                  {userData?.foot}
                </p>
                <p>
                  <strong className="text-muted">Playing Position:</strong>{" "}
                  {userData?.position}
                </p>
              </div>
            </div>

            {userProfile.player && (
              <div className="mt-4 pt-3 border-top">
                <h5
                  className="fw-bold text-center"
                  style={{ color: "#45b469" }}
                >
                  Player Stats
                </h5>
                <div className="row text-center">
                  <div className="col-6 border-end">
                    <h6 className="text-muted">Goals</h6>
                    <p className="fw-bold fs-4">
                      {userProfile.player.stats?.totalgoals || 0}
                    </p>
                  </div>
                  <div className="col-6">
                    <h6 className="text-muted">Assists</h6>
                    <p className="fw-bold fs-4">
                      {userProfile.player.stats?.totalassits || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {userProfile.player ? (
        userProfile.player.team ? (
          <>
            <div className="card p-3 d-flex flex-row align-items-center mt-3 mb-3 team-profile">
              <img
                src={userProfile.player.team.teamlogo}
                alt="Team Logo"
                className="rounded-circle me-3"
                style={{ height: "150px", width: "150px", objectFit: "cover" }}
              />
              <div>
                <h4>{userProfile.player.team.teamname}</h4>
                <p>
                  <strong>Owner:</strong> {userProfile.player.team.owner}
                </p>
                <p>
                  <strong>Email:</strong> {userProfile.player.team.teamemail}
                </p>
                <p>
                  <strong>Country:</strong> {userProfile.player.team.country}
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
                    {userProfile.player.stats?.totalmatches || 0}
                  </p>
                </div>
                <div className="col-4 border-end">
                  <h6 className="text-muted">Goals Scored</h6>
                  <p className="fw-bold fs-4">
                    {userProfile.player.stats?.currentgoals || 0}
                  </p>
                </div>
                <div className="col-4">
                  <h6 className="text-muted">Assists Made</h6>
                  <p className="fw-bold fs-4">
                    {userProfile.player.stats?.currentassists || 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card p-3 mt-3 mb-3">
            <h5 className="fw-bold" style={{ color: "#45b469" }}>
              Player is not part of any team.
            </h5>
            {isTeamOwner && (
              <form
                onSubmit={(e) => handleSendPlayerReq(userId, playerNo, e)}
                className="d-flex align-items-center mt-3"
              >
                <input
                  type="text"
                  value={playerNo}
                  onChange={(e) => setPlayerNo(e.target.value)}
                  placeholder="Enter Player Number"
                  className="form-control me-2"
                  required
                />
                <button type="submit" className="btn btn-success">
                  Send Player Request
                </button>
              </form>
            )}
          </div>
        )
      ) : (
        <div className="card p-3 mt-3 mb-3">
          <h5 className="fw-bold" style={{ color: "#45b469" }}>
            User is not a player.
          </h5>
          {isTeamOwner && (
            <form
              onSubmit={(e) => handleSendPlayerReq(userId, playerNo, e)}
              className="d-flex flex-column flex-sm-row align-items-center gap-2 mt-3"
            >
              <input
                type="text"
                value={playerNo}
                onChange={(e) => setPlayerNo(e.target.value)}
                placeholder="Enter Player Number"
                className="form-control w-100"
                style={{ minWidth: "200px", flex: "1" }}
                required
              />
              <button
                type="submit"
                className="btn btn-secondary w-100"
                style={{ minWidth: "120px", maxWidth: "200px" }}
              >
                Request
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
