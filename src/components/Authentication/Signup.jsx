import React, { useState, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useNavigate } from "react-router-dom"; // Navigation hook for routing.
import { useToast } from "../Genral/ToastContext"; // Custom Toast Context for notifications.
import { useDispatch } from "react-redux"; // Dispatch hook for Redux actions.
import { sendOtp } from "../../Redux/fetures/authentication"; // Redux action for signup.
import { FaEye, FaEyeSlash } from "react-icons/fa"; // FontAwesome icons for password visibility

export default function Signup() {
  const [validated, setValidated] = useState(false); // State to track form validation.
  const [isPending, startTransition] = useTransition(); // Hook for managing transitions
  const [formData, setFormData] = useState({
    // State for form data.
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
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password field.
  const [fileError, setFileError] = useState(""); // State to track file upload errors.
  const [passwordVisable, setPasswordVisable] = useState(false); // Toggle for password visibility.
  const [confirmPasswordVisable, setConfirmPasswordVisable] = useState(false); // Toggle for confirm password visibility.
  const [preview, setPreview] = useState(null);

  const { showToast } = useToast(); // Toast notifications for feedback.
  const dispatch = useDispatch(); // Redux dispatch for triggering actions.
  const navigate = useNavigate(); // Hook for navigation.

  // Handle input field changes for text inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile picture file selection with validation for file type.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (file && validTypes.includes(file.type)) {
      setFormData((prevData) => ({
        ...prevData,
        pic: file,
      }));
      setFileError("");

      // Generate image preview
      const render = new FileReader();
      render.onloadend = () => {
        setPreview(render.result);
      };
      render.readAsDataURL(file);
    } else {
      setFileError("Please upload a valid image file (jpeg, jpg, png).");
    }
  };

  // Update confirm password state.
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Handle form submission logic, including validation and API call.
  const handleSubmit = async (event) => {
    event.preventDefault();

    startTransition(async () => {
      const form = event.currentTarget;

      // Validate form fields and ensure passwords match.
      if (form.checkValidity() === false || fileError) {
        event.stopPropagation();
      } else if (formData.password !== confirmPassword) {
        showToast("Passwords do not match", "danger");
        return;
      } else {
        try {
          // Dispatch Redux action to send OTP with formData.
          const result = await dispatch(sendOtp(formData)).unwrap();
          showToast(result.message || "OTP sent successfully!", "success");

          // Navigate to OTP verification page with form data.
          navigate("/OtpVerify", { state: { formData } });
        } catch (error) {
          showToast(
            error.message || "Failed to send OTP. Please try again.",
            "danger"
          );
        }
      }
      setValidated(true);
    });
  };

  // Clear all form inputs and reset state.
  const handleClear = () => {
    // Reset form data to initial state
    setFormData({
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
    setConfirmPassword("");
    setFileError("");
    setValidated(false); // Reset validation state if needed
  };

  // Toggle visibility of the password field.
  const handlePasswordVisability = () => {
    setPasswordVisable((prev) => !prev);
  };

  // Toggle visibility of the confirm password field.
  const handleConfirmPasswordVisability = () => {
    setConfirmPasswordVisable((prev) => !prev);
  };

  return (
    <div className="container">
      <div className="row">
        {/* Information Section */}
        <div className="col-md-6 col-sm-12 mt-5 mb-4 info-section">
          <h4>Welcome to Our FbScore Community!</h4>
          <p>
            Join the platform to manage your player profile, track match
            statistics, and be a part of exciting leagues and tournaments.
          </p>
          <ul>
            <li>Create and customize your player profile.</li>
            <li>Participate in matches and record your stats.</li>
            <li>Stay connected with your team and league.</li>
            <li>Showcase your skills and achievements.</li>
          </ul>
          <p>
            Sign up now to unlock a world of football opportunities and take
            your game to the next level!
          </p>
          <p>
            Already have an account?{" "}
            <button
              className="btn btn-link"
              onClick={() => navigate("/Signin")}
            >
              Sign In
            </button>
          </p>
        </div>

        <div className="col-md-6 col-sm-12">
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

              <div className="form-floating mb-3 d-flex align-items-center">
                {/* File Input */}
                <div style={{ flex: "1" }}>
                  <input
                    type="file"
                    className={`form-control ${fileError ? "is-invalid" : ""}`}
                    name="floatingProfile"
                    placeholder="Profile Picture"
                    onChange={handleFileChange}
                    style={{ width: "60%" }} // Reduce the input width
                  />
                  <label htmlFor="floatingProfile">
                    Select Profile Picture
                  </label>
                  {fileError && (
                    <div className="invalid-feedback">{fileError}</div>
                  )}
                </div>

                {/* Preview Image */}
                {preview && (
                  <div className="text-center ms-3">
                    <img
                      src={preview}
                      className="rounded-circle shadow"
                      alt="Profile Preview"
                      style={{
                        height: "100px",
                        width: "100px",
                        border: "2px solid #50C878",
                        padding: "5px",
                      }}
                    />
                  </div>
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
                  type={passwordVisable ? "text" : "password"}
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
                <div className="invalid-feedback">Password is required.</div>

                <span
                  onClick={handlePasswordVisability}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                >
                  {passwordVisable ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className="form-floating mb-3 mt-3">
                <input
                  type={confirmPasswordVisable ? "text" : "password"}
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPassword}
                  required
                />
                <label htmlFor="floatingConfirmPassword">
                  Confirm Password
                </label>
                <div className="invalid-feedback">
                  Please confirm your password.
                </div>

                <span
                  onClick={handleConfirmPasswordVisability}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                >
                  {confirmPasswordVisable ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <button
                type="reset"
                className="btn btn-primary"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="submit"
                className="btn btn-primary ms-2"
                disabled={isPending}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
