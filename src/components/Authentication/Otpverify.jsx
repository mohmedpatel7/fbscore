import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../Genral/ToastContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";

export default function Otpverify() {
  const [Otp, SetOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {};
  const { showToast } = useToast();

  const handleChange = (e) => {
    SetOtp(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!Otp) {
      showToast("Please enter the OTP sent to your email.", "danger");
      return;
    }

    // Assuming `getOtpFromEmail` retrieves the OTP from the backend
    const expectedOtpFromEmail = await getOtpFromEmail(email);

    console.log("Entered OTP:", Otp);
    console.log("Expected OTP from email:", expectedOtpFromEmail);

    if (Otp === expectedOtpFromEmail) {
      const payload = {
        ...formData,
        otp: Otp,
      };

      dispatch(SignUp(payload))
        .then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            showToast("Signup successful", "success");
            navigate("/");
          } else {
            showToast("Signup failed. Please try again.", "danger");
          }
        })
        .catch((err) => {
          console.error("Signup error:", err);
          showToast("Something went wrong. Please try again.", "danger");
        });
    } else {
      showToast("Invalid OTP. Please try again.", "danger");
    }
  };

  return (
    <div className="container ">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
            <h2 className="mb-3 text-center">Verify Otp</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="Otp"
                  placeholder="Name"
                  value={Otp}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingName">otp</label>
                <div className="invalid-feedback">otp is required.</div>
              </div>
              <button type="submit" className="btn btn-primary">
                Verify
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}
