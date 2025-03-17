import React, { useState, useEffect, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useToast } from "../Genral/ToastContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchedTeamlist,
  createMatch,
} from "../../Redux/fetures/Matchofficial";

export default function MatchCreate() {
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const { isLoading, teamList } = useSelector(
    (state) => state.matchOfficialSlice
  );
  const isMatchOfficial = localStorage.getItem("matchOfficialtoken");

  const [formData, setFormData] = useState({
    teamA: "",
    teamB: "",
    match_date: "",
    match_time: "",
  });

  useEffect(() => {
    if (isMatchOfficial) {
      dispatch(fetchedTeamlist());
    }
  }, [dispatch, isMatchOfficial]);

  const handleChange = (e) => {
    startTransition(() => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.teamA === formData.teamB) {
      showToast("Team A and Team B cannot be the same!", "danger");
      setValidated(true);
      return;
    }

    setValidated(true);

    startTransition(() => {
      dispatch(createMatch(formData))
        .unwrap()
        .then(() => {
          showToast("Match Created Successfully!", "success");
          navigate("/MatchList");
        })
        .catch((error) => {
          showToast(error.message || "Failed to create match!", "danger");
        });
    });
  };

  return (
    <div className="container mt-4">
      {isMatchOfficial && (
        <form
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="card mx-auto p-4 shadow" style={{ maxWidth: "90%" }}>
            <h3 className="mb-4">Create Match</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <select
                    id="teamA"
                    className="form-control"
                    name="teamA"
                    value={formData.teamA}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Home Team</option>
                    {teamList?.data?.length > 0 ? (
                      teamList.data
                        .filter((team) => team.teamId !== formData.teamB) // Exclude selected teamB from teamA
                        .map((team) => (
                          <option key={team.teamId} value={team.teamId}>
                            {team.teamname}
                          </option>
                        ))
                    ) : (
                      <option disabled>Loading teams...</option>
                    )}
                  </select>
                  <label htmlFor="teamA">Select Home Team</label>
                  <div className="invalid-feedback">
                    Please select Home Team!.
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <select
                    id="teamB"
                    className="form-control"
                    name="teamB"
                    value={formData.teamB}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Away Team</option>
                    {teamList?.data?.length > 0 ? (
                      teamList.data
                        .filter((team) => team.teamId !== formData.teamA) // Exclude selected teamA from teamB
                        .map((team) => (
                          <option key={team.teamId} value={team.teamId}>
                            {team.teamname}
                          </option>
                        ))
                    ) : (
                      <option disabled>Loading teams...</option>
                    )}
                  </select>
                  <label htmlFor="teamB">Select Away Team</label>
                  <div className="invalid-feedback">
                    Please select Away Team!.
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    id="match_date"
                    type="date"
                    className="form-control"
                    name="match_date"
                    value={formData.match_date}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="match_date">Match Date</label>
                  <div className="invalid-feedback">
                    Match Date is Required!.
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    id="match_time"
                    type="time"
                    className="form-control"
                    name="match_time"
                    value={formData.match_time}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="match_time">Match Time</label>
                  <div className="invalid-feedback">
                    Match Time is Required!.
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading || isPending}
            >
              {isLoading || isPending ? "Creating..." : "Create Match"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
