import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSyncAlt, FaChartBar, FaAward, FaInfoCircle } from "react-icons/fa";
import { fetchMatchDetails } from "../../Redux/fetures/Matchofficial";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../Genral/ToastContext";

export default function MatchOperations() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const operations = [
    {
      title: "Update Status",
      description:
        "Change the match status (Live,Half Time,Full Time,Delayed and Cancel).",
      icon: <FaSyncAlt size={40} className="text-primary" />,
      onClick: () => {
        try {
          dispatch(fetchMatchDetails(matchId));
          navigate(`/MatchStatusUpdate/${matchId}`);
        } catch (error) {
          showToast(error.message || "Error while fetching match details!");
        }
      },
    },
    {
      title: "Update Stats",
      description: "Update scores, goals, and other match statistics.",
      icon: <FaChartBar size={40} className="text-success" />,
      path: "/match/update-stats",
    },
    {
      title: "Assign MVP",
      description: "Select the Most Valuable Player of the match.",
      icon: <FaAward size={40} className="text-warning" />,
      path: "/match/assign-mvp",
    },
    {
      title: "Match Details",
      description: "View complete details of the match.",
      icon: <FaInfoCircle size={40} className="text-danger" />,
      onClick: () => {
        try {
          dispatch(fetchMatchDetails(matchId));
          navigate(`/MatchDetails/${matchId}`);
        } catch (error) {
          showToast(error.message || "Error while fetching match details!");
        }
      },
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Match Operations</h2>
      <div className="row">
        {operations.map((op, index) => (
          <div key={index} className="col-md-3">
            <div
              className="card text-center shadow operation-card"
              onClick={() => {
                if (op.onClick) {
                  op.onClick(); // Call the function if `onClick` exists
                } else {
                  navigate(op.path); // Otherwise, navigate using `path`
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <div className="mb-3">{op.icon}</div>
                <h5 className="card-title">{op.title}</h5>
                <p className="card-text">{op.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
