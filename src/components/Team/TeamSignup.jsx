import React, { useState, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useNavigate } from "react-router-dom"; // Navigation hook for routing.
import { useToast } from "../Genral/ToastContext"; // Custom Toast Context for notifications.
import { useDispatch, useSelector } from "react-redux"; // Dispatch hook for Redux actions.
import { sendOtp } from "../../Redux/fetures/Teamslice"; // Redux action for signup.
import { FaEye, FaEyeSlash } from "react-icons/fa"; // FontAwesome icons for password visibility

export default function TeamSignup() {
  const [validated, setValidated] = useState(false); // State to track form validation.
  const [isPending, startTransition] = useTransition(); // Hook for managing transitions
  const [formData, setFormData] = useState({
    // State for form data.
    teamname: "",
    email: "",
    password: "",
    createdBy: "",
    country: "",
    teamlogo: null,
  });
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password field.
  const [fileError, setFileError] = useState(""); // State to track file upload errors.
  const [passwordVisable, setPasswordVisable] = useState(false); // Toggle for password visibility.
  const [confirmPasswordVisable, setConfirmPasswordVisable] = useState(false); // Toggle for confirm password visibility.
  const [preview, setPreview] = useState(null);

  const { showToast } = useToast(); // Toast notifications for feedback.
  const dispatch = useDispatch(); // Redux dispatch for triggering actions.
  const navigate = useNavigate(); // Hook for navigation.

  const isUser = !!localStorage.getItem("usertoken");
  const isTeamOwner = !!localStorage.getItem("teamtoken");
  const isMatchOfficial = !!localStorage.getItem("matchOfficialtoken");

  const { isLoading } = useSelector((state) => state.teamSlice);

  // Handle input field changes for text inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile Teamlogo file selection with validation for file type.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (file && validTypes.includes(file.type)) {
      setFormData((prevData) => ({
        ...prevData,
        teamlogo: file,
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
          navigate("/Teamotpverify", { state: { formData } });
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
      teamname: "",
      email: "",
      password: "",
      createdBy: "",
      country: "",
      teamlogo: null,
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
              <h2 className="mb-3 text-center">Register Your Team</h2>
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
                    name="teamname"
                    placeholder="Name"
                    value={formData.teamname}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="floatingName">Teamname</label>
                  <div className="invalid-feedback">Teamname is required.</div>
                </div>

                <div className="form-floating mb-3 d-flex align-items-center">
                  {/* File Input */}
                  <div style={{ flex: "1" }}>
                    <input
                      type="file"
                      className={`form-control ${
                        fileError ? "is-invalid" : ""
                      }`}
                      name="floatingProfile"
                      placeholder="Profile Teamlogo"
                      onChange={handleFileChange}
                      style={{ width: "60%" }} // Reduce the input width
                      required
                    />
                    <label htmlFor="floatingProfile">Select Teamlogo</label>
                    <div className="invalid-feedback">
                      Teamlogo is required.
                    </div>
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
                    type="text"
                    className="form-control"
                    name="createdBy"
                    placeholder="Date of Birth"
                    value={formData.createdBy}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="floatingcreatedBy">Owner Name</label>
                  <div className="invalid-feedback">
                    Owner Name is required.
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
