import React, { useState, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../Genral/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { SignUp } from "../../Redux/fetures/Teamslice";

export default function Otpverify() {
  const [Otp, SetOtp] = useState(""); // State for OTP input
  const [isPending, startTransition] = useTransition(); // React Hook for managing transitions
  const [validated, setValidated] = useState(false); // State for form validation.

  const navigate = useNavigate(); // Navigation hook to redirect users

  const location = useLocation(); // Location hook to retrieve data passed via state
  const { formData } = location.state || {}; // Destructure form data from location's state object
  const dispatch = useDispatch(); // Redux dispatch hook for triggering actions

  const isUser = !!localStorage.getItem("usertoken");
  const isTeamOwner = !!localStorage.getItem("teamtoken");
  const isMatchOfficial = !!localStorage.getItem("matchOfficialtoken");

  const { showToast } = useToast(); // Custom toast hook for displaying messages

  const { isLoading } = useSelector((state) => state.teamSlice);

  // Handler for OTP input changes
  const handleChange = (e) => {
    SetOtp(e.target.value); // Update OTP state
  };

  // Form submission handler
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    // Check form validity
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation(); // Stop further propagation of the event
      setValidated(true); // Mark form as validated to display errors
      return;
    }

    // Mark form as validated
    setValidated(true);

    // Use React's startTransition for smooth state updates
    startTransition(async () => {
      if (!Otp) {
        // Show error if OTP is not entered
        showToast("Please enter the OTP sent to your email.", "danger");
        return;
      }

      // Create payload with form data and OTP
      const payload = {
        ...formData,
        otp: Otp,
      };

      try {
        // Dispatch SignUp action with payload
        const response = await dispatch(SignUp(payload));

        if (response.meta.requestStatus === "fulfilled") {
          // Show success toast and navigate to homepage on success
          showToast(
            "Team registration request sent to fbscore,You will get the mail from fbscore.",
            "success"
          );
          navigate("/");
        } else {
          // Show error toast if signup fails
          showToast(response.payload?.message, "danger");
        }
      } catch (err) {
        // Handle unexpected errors
        showToast("Something went wrong. Please try again.", "danger");
      }
    });
  };

  return (
    <div className="container">
      {!isUser && !isMatchOfficial && !isTeamOwner && (
        <div className="row">
          {/* Empty column for centering the form */}
          <div className="col-md-3"></div>

          {/* Form column */}
          <div className="col-md-6">
            <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
              <h2 className="mb-3 text-center">Verify OTP</h2>

              {/* OTP Verification Form */}
              <form
                className={`needs-validation ${
                  validated ? "was-validated" : ""
                }`}
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="form-floating mb-3">
                  {/* OTP Input Field */}
                  <input
                    type="text"
                    className="form-control"
                    id="floatingOtp"
                    name="Otp"
                    placeholder="Enter OTP"
                    value={Otp}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="floatingOtp">Enter OTP</label>
                  <div className="invalid-feedback">OTP is required.</div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isPending} // Disable button during pending state
                >
                  {isLoading ? "Verifying" : "Verify"}
                </button>
              </form>
            </div>
          </div>

          {/* Empty column for centering the form */}
          <div className="col-md-3"></div>
        </div>
      )}
    </div>
  );
}
