import React, { useEffect, useState, useTransition } from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { fetchTeamReq, reqAction } from "../../Redux/fetures/authentication";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../Genral/ToastContext";
import { useNavigate } from "react-router-dom";

export default function RequestModel({ showModal, setShowModal }) {
  const [isPending, startTransition] = useTransition(); // Manage async transitions
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate(); // React Router navigation function

  const { teamReq } = useSelector((state) => state.authSlice);

  useEffect(() => {
    try {
      dispatch(fetchTeamReq());
    } catch (error) {
      showToast(
        error.message || "Error while fetching team requests!",
        "danger"
      );
    }
  }, [dispatch]);

  // Handle Accept/Reject actions
  const handleAction = async (reqId, action) => {
    startTransition(async () => {
      try {
        const result = await dispatch(reqAction({ action, reqId })); // Pass reqId inside the object

        if (reqAction.fulfilled.match(result)) {
          showToast(
            result.payload.message || `Request ${action}ed successfully.`,
            "success"
          );
          dispatch(fetchTeamReq()); // Refresh the list after action
          navigate("/");
        } else {
          showToast(
            result.payload.message || "Error while processing action!",
            "danger"
          );
        }
      } catch (error) {
        showToast(
          error.message || `Error while ${action}ing request!`,
          "danger"
        );
      }
    });
  };

  // Function to handle closing the modal
  const handleClose = () => setShowModal(false);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header className="custom-modal-header" closeButton>
        <h3 style={{ color: "#50C878" }}>Team Request</h3>
      </Modal.Header>
      <Modal.Body>
        {teamReq?.requests?.length > 0 ? (
          teamReq.requests.map((req, index) => (
            <div
              key={index}
              className="card card-squad-item d-flex flex-row align-items-center p-2 position-relative mb-2"
            >
              <img
                src={req.teamlogo || req.teamname}
                alt={req.teamname || "Unknown Player"}
                className="rounded-circle"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
              <div className="ms-3 flex-grow-1">
                <h6 className="mb-1">{req.teamname || "Unknown"}</h6>
                <small className="text-muted">
                  {req.JeresyNo || "Unknown"}
                </small>
              </div>

              {/* Accept & Reject Buttons */}
              <div className="d-flex gap-2 ms-auto">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleAction(req.reqId, "reject")}
                  disabled={isPending}
                >
                  Reject
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleAction(req.reqId, "accept")}
                  disabled={isPending}
                >
                  Accept
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center">No team requests found.</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
