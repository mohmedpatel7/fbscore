import React, { useState, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../Genral/ToastContext";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { SignUp } from "../../Redux/fetures/authentication";

export default function Otpverify() {
  const [Otp, SetOtp] = useState("");
  const [isPending, startTransition] = useTransition();
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formData } = location.state || {};
  const { showToast } = useToast();

  const handleChange = (e) => {
    SetOtp(e.target.value);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    startTransition(async () => {
      if (!Otp) {
        showToast("Please enter the OTP sent to your email.", "danger");
        return;
      }

      const payload = {
        ...formData,
        otp: Otp,
      };

      try {
        const response = await dispatch(SignUp(payload));
        if (response.meta.requestStatus === "fulfilled") {
          showToast("Signup successful", "success");
          navigate("/");
        } else {
          showToast(
            response.payload?.message || "Signup failed. Please try again.",
            "danger"
          );
        }
      } catch (err) {
        console.error("Signup error:", err);
        showToast("Something went wrong. Please try again.", "danger");
      }
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
            <h2 className="mb-3 text-center">Verify OTP</h2>
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="form-floating mb-3">
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
              >
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
