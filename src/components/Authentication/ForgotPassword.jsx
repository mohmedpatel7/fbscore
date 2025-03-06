import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, forgotPassword } from "../../Redux/fetures/authentication";
import { useToast } from "../Genral/ToastContext";
import { useNavigate } from "react-router-dom";
import "./style/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // FontAwesome icons for password visibility

export default function ForgotPassword() {
  const [validated, setValidated] = useState(false);
  const [passwordVisable, setPasswordVisable] = useState(false); // State to toggle password visibility

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { isLoading } = useSelector((state) => state.authSlice);
  const navigate = useNavigate(); // Navigation hook to redirect users

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Password

  const isUser = !!localStorage.getItem("usertoken");
  const isTeamOwner = !!localStorage.getItem("teamtoken");
  const isMatchOfficial = !!localStorage.getItem("matchOfficialtoken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await dispatch(sendOtp({ email: formData.email })).unwrap();
      showToast("OTP sent successfully!", "success");
      setStep(2); // Move to OTP & Password step
    } catch (error) {
      showToast(error.message || "Failed to send OTP", "error");
    }
  };

  // Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await dispatch(forgotPassword(formData)).unwrap();
      showToast("Password updated successfully!", "success");
      setStep(1);
      setFormData({ email: "", otp: "", newPassword: "" });
      navigate("/Signin");
    } catch (error) {
      // Ensure we get an appropriate error message
      const errorMessage =
        error?.message ||
        error?.payload?.message ||
        "Invalid OTP. Please try again."; // Default fallback message

      showToast(errorMessage, "danger");
    }
  };

  // Toggles password visibility state
  const handlePasswordVisability = () => {
    setPasswordVisable((prev) => !prev);
  };

  return (
    <div className="container-fluid d-flex justify-content-center mt-3">
      {!isUser && !isMatchOfficial && !isTeamOwner && (
        <div className="row justify-content-center w-100">
          <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
            <h2 className="mb-3 text-center">Forgot Password</h2>
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
            >
              {/* Step 1: Email Input */}
              {step === 1 && (
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                  <label>Email address</label>
                  <div className="invalid-feedback">
                    Please provide a valid email address.
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-3"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              )}

              {/* Step 2: OTP & New Password Input */}
              {step === 2 && (
                <>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter OTP"
                      required
                    />
                    <label>Enter OTP</label>
                    <div className="invalid-feedback">
                      Please provide a valid OTP.
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type={passwordVisable ? "text" : "password"} // Toggle between text and password
                      className="form-control"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="New Password"
                      required
                    />
                    <label>New Password</label>
                    <div className="invalid-feedback">
                      Please provide a valid password.
                    </div>

                    {/* Eye Icon for Password Visibility */}
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

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Reset Password"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
