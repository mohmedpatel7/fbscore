import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Genral/ToastContext";

export default function Signup() {
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    // Validate the form
    if (form.checkValidity() === false || password !== confirmPassword) {
      event.stopPropagation();
    } else {
      showToast("Verify your email", "success");
      navigate("/Otppage");
    }

    setValidated(true);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
              <h2 className="mb-3 text-center">Sign Up</h2>
              <form
                className={`needs-validation ${
                  validated ? "was-validated" : ""
                }`}
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="Name"
                    required
                  />
                  <label htmlFor="floatingName">Name</label>
                  <div className="invalid-feedback">Name is required.</div>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="file"
                    className="form-control"
                    id="floatingProfile"
                    placeholder="Profile Picture"
                  />
                  <label htmlFor="floatingProfile">
                    Select Profile Picture
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="name@example.com"
                    required
                  />
                  <label htmlFor="floatingEmail">Email address</label>
                  <div className="invalid-feedback">
                    Please provide a valid email address.
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    className="form-control"
                    id="floatingDob"
                    placeholder="Date of Birth"
                    required
                  />
                  <label htmlFor="floatingDob">Date of Birth</label>
                  <div className="invalid-feedback">
                    Date of Birth is required.
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="floatingGender"
                    placeholder="Gender"
                    required
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  <label htmlFor="floatingGender">Gender</label>
                  <div className="invalid-feedback">
                    Please select your gender.
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingCountry"
                    placeholder="Country"
                    required
                  />
                  <label htmlFor="floatingCountry">Country</label>
                  <div className="invalid-feedback">Country is required.</div>
                </div>
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="floatingPosition"
                    placeholder="Position"
                    required
                  >
                    <option value="">Select</option>
                    <optgroup label="Attack">
                      <option>ST</option>
                      <option>CF</option>
                      <option>RW</option>
                      <option>LW</option>
                    </optgroup>
                    <optgroup label="Midfield">
                      <option>CAM</option>
                      <option>CM</option>
                      <option>RM</option>
                      <option>LM</option>
                    </optgroup>
                    <optgroup label="Defense">
                      <option>RB</option>
                      <option>LB</option>
                      <option>CB</option>
                    </optgroup>
                    <optgroup label="Goalkeeper">
                      <option>GK</option>
                    </optgroup>
                  </select>
                  <label htmlFor="floatingPosition">
                    Favorite Playing Position
                  </label>
                  <div className="invalid-feedback">
                    Please select your favorite playing position.
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="floatingFoot"
                    placeholder="Strong Foot"
                    required
                  >
                    <option value="">Select</option>
                    <option>Right</option>
                    <option>Left</option>
                  </select>
                  <label htmlFor="floatingFoot">Strong Foot</label>
                  <div className="invalid-feedback">
                    Please select your strong foot.
                  </div>
                </div>
                <div className="form-floating mb-3 mt-5">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                  <div className="invalid-feedback">Password is required.</div>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={`form-control ${
                      passwordError ? "is-invalid" : ""
                    }`}
                    id="floatingConfirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingConfirmPassword">
                    Confirm Password
                  </label>
                  <div className="invalid-feedback">
                    {passwordError
                      ? "Passwords do not match."
                      : "Confirming your password is required."}
                  </div>
                </div>

                <button type="reset" className="btn btn-primary">
                  Clear
                </button>
                <button type="submit" className="btn btn-primary ms-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    </>
  );
}
