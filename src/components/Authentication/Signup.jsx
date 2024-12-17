import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useNavigate } from "react-router-dom"; // Navigation hook for routing.
import { useToast } from "../Genral/ToastContext"; // Custom Toast Context for notifications.
import { useDispatch } from "react-redux"; // Dispatch hook for Redux actions.
import { SignUp } from "../../Redux/fetures/authentication"; // Redux action for signup.

export default function Signup() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    country: "",
    position: "",
    foot: "",
    pic: null,
  });
  const [fileError, setFileError] = useState("");
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (file && validTypes.includes(file.type)) {
      setFormData((prevData) => ({
        ...prevData,
        pic: file,
      }));
      setFileError("");
    } else {
      setFileError("Please upload a valid image file (jpeg, jpg, png).");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false || fileError) {
      event.stopPropagation();
    } else {
      try {
        const result = await dispatch(SignUp(formData)).unwrap();
        showToast(result.message || "Signup successful!", "success");
        navigate("/");
      } catch (error) {
        showToast(
          error.message || "Signup failed. Please try again.",
          "danger"
        );
      }
    }

    setValidated(true);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
            <h2 className="mb-3 text-center">Sign Up</h2>
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingName">Name</label>
                <div className="invalid-feedback">Name is required.</div>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="file"
                  className={`form-control ${fileError ? "is-invalid" : ""}`}
                  name="floatingProfile"
                  placeholder="Profile Picture"
                  onChange={handleFileChange}
                />
                <label htmlFor="floatingProfile">Select Profile Picture</label>
                {fileError && (
                  <div className="invalid-feedback">{fileError}</div>
                )}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="dob"
                  placeholder="Date of Birth"
                  value={formData.dob}
                  onChange={handleChange}
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
                  name="gender"
                  placeholder="Gender"
                  value={formData.gender}
                  onChange={handleChange}
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
                <select
                  className="form-control"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option>India</option>
                </select>
                <label htmlFor="floatingCountry">Country</label>
                <div className="invalid-feedback">Country is required.</div>
              </div>

              <div className="form-floating mb-3">
                <select
                  className="form-control"
                  name="position"
                  placeholder="Position"
                  value={formData.position}
                  onChange={handleChange}
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
                  name="foot"
                  placeholder="Strong Foot"
                  value={formData.foot}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option>Right</option>
                  <option>Left</option>
                </select>
                <label htmlFor="floatingFoot">Strong Foot</label>
                <div className="invalid-feedback">Strong foot is required.</div>
              </div>

              <div className="form-floating mb-3 mt-5">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
                <div className="invalid-feedback">Password is required.</div>
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
  );
}
