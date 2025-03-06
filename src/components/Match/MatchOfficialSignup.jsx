import React, { useState, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useNavigate } from "react-router-dom"; // Navigation hook for routing.
import { useToast } from "../Genral/ToastContext"; // Custom Toast Context for notifications.
import { useDispatch, useSelector } from "react-redux"; // Dispatch hook for Redux actions.
import { sendOtp } from "../../Redux/fetures/Matchofficial"; // Redux action for signup.
import { FaEye, FaEyeSlash } from "react-icons/fa"; // FontAwesome icons for password visibility

export default function MatchOfficialSignup() {
  const [validated, setValidated] = useState(false); // State to track form validation.
  const [isPending, startTransition] = useTransition(); // Hook for managing transitions
  const [formData, setFormData] = useState({
    // State for form data.
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password field.
  const [fileError, setFileError] = useState(""); // State to track file upload errors.
  const [passwordVisable, setPasswordVisable] = useState(false); // Toggle for password visibility.
  const [confirmPasswordVisable, setConfirmPasswordVisable] = useState(false); // Toggle for confirm password visibility.

  const { showToast } = useToast(); // Toast notifications for feedback.
  const dispatch = useDispatch(); // Redux dispatch for triggering actions.
  const navigate = useNavigate(); // Hook for navigation.

  const isUser = !!localStorage.getItem("usertoken");
  const isTeamOwner = !!localStorage.getItem("teamtoken");
  const isMatchOfficial = !!localStorage.getItem("matchOfficialtoken");

  const { isLoading } = useSelector((state) => state.matchOfficialSlice);

  // Handle input field changes for text inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
          navigate("/Matchofficialotpverify", { state: { formData } });
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
    });
    setPreview("");
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
    <div className="container-fluid d-flex justify-content-center">
      {!isUser && !isMatchOfficial && !isTeamOwner && (
        <div className="row justify-content-center w-100">
          <div className="col-lg-6 col-md-8">
            <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
              <h2 className="mb-4 text-center">Register as Match Official</h2>
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
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="floatingName">Match Official Name</label>
                  <div className="invalid-feedback">
                    Match Officia lName is required.
                  </div>
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
                  {isLoading ? "Submiting" : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
