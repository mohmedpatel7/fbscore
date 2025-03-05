import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../Redux/fetures/authentication";
import { useToast } from "../Genral/ToastContext";
import "./style/style.css";

export default function PlayerProfile() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { data } = useSelector((state) => state.authSlice);

  useEffect(() => {
    try {
      dispatch(fetchUserDetails());
    } catch (error) {
      showToast(error.message || "Error while feching profile!", "danger");
    }
  }, [dispatch]);

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
                <button className="dropdown-item ">Edit</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="row g-4 align-items-center">
          {/* Profile Image */}
          <div className="col-md-4 text-center border-end">
            <img
              src={data?.pic}
              alt="Profile"
              className="rounded-circle border border-3"
              style={{
                height: "150px",
                width: "150px",
                objectFit: "cover",
              }}
            />
            <h4 className="fw-bold mt-3">{data?.name}</h4>
            <br />
            <h4>{data?.playerDetails?.jeresyNo || null}</h4>
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
                  <strong>Email:</strong> {data?.email || "N/A"}
                </p>
                <p className="text-muted mb-1">
                  <strong>Country:</strong> {data?.country || "N/A"}
                </p>
              </div>

              {/* Personal Details */}
              <div className="col-md-6 border-start">
                <h5 className="fw-bold" style={{ color: "#45b469" }}>
                  Personal Details
                </h5>
                <hr />
                <p className="text-muted mb-1">
                  <strong>Age:</strong> {data?.age || "N/A"}
                </p>
                <p className="text-muted mb-1">
                  <strong>Gender:</strong> {data?.gender || "N/A"}
                </p>
                <p className="text-muted">
                  <strong>Strong Foot:</strong> {data?.foot || "N/A"}
                </p>
                <p className="text-muted">
                  <strong>Playing Position:</strong> {data?.position || "N/A"}
                </p>
              </div>
            </div>

            {/* Player Stats */}
            <div className="mt-4 pt-3 border-top">
              <h5 className="fw-bold text-center" style={{ color: "#45b469" }}>
                Player Stats
              </h5>
              <div className="row text-center">
                {/*  <div className="col-4 border-end">
                  <h6 className="text-muted">Matches</h6>
                  <p className="fw-bold fs-4">
                    {playerProfile?.player?.stats?.totalmatches}
                  </p>
                </div> */}
                <div className="col-6 border-end">
                  <h6 className="text-muted">Goals</h6>
                  <p className="fw-bold fs-4">{data?.stats?.totalgoals}</p>
                </div>
                <div className="col-6">
                  <h6 className="text-muted">Assists</h6>
                  <p className="fw-bold fs-4">{data?.stats?.totalassists}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*team part*/}
      {data?.playerDetails?.teamname ? (
        <>
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

          {/**stats for current team */}
          <div className="card p-3 mt-3 mb-3 team-profile">
            <h5 className="fw-bold mb-1" style={{ color: "#45b469" }}>
              Current Team Stats
            </h5>
            <hr /> {/* Added horizontal line */}
            <div className="row text-center">
              <div className="col-4 border-end">
                <h6 className="text-muted">Matches Played</h6>
                <p className="fw-bold fs-4">{data?.stats?.totalmatches || 0}</p>
              </div>
              <div className="col-4 border-end">
                <h6 className="text-muted">Goals Scored</h6>
                <p className="fw-bold fs-4">{data?.stats?.currentgoals || 0}</p>
              </div>
              <div className="col-4">
                <h6 className="text-muted">Assists Made</h6>
                <p className="fw-bold fs-4">
                  {data?.stats?.currentassists || 0}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-muted mt-3">
          User is not part of the team!
        </p>
      )}
    </div>
  );
}
