import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../Genral/ToastContext";
import { SignUp } from "../../Redux/fetures/authentication";

export default function Signup() {
  const [validated, setValidated] = useState(false);
  const [Otp, SetOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {}; // geting data from signup component
  const dispatch = useDispatch();
  const { showToast } = useToast();

  //Handle change function..
  const handleChange = (e) => {
    SetOtp(e.target.value); // Update state with the value typed in the input
  };

  //Handle submit function..
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData) {
      showToast("Invalid request. Please signup again.", "error");
      navigate("/Signup");
      return;
    }
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      dispatch(SignUp({ email: formData.email, Otp }))
        .then(() => {
          dispatch(SignUp(formData))
            .then(() => {
              showToast("Signup succesful", "success");
              navigate("/");
            })
            .catch(() => {
              showToast("Invalid request. Please signup again.", "error");
            });
        })
        .catch(() => {
          showToast("Invalid OTP. Please try again.", "error");
        });
    }
    setValidated(true);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
              <h2 className="mb-3 text-center">Verify Otp</h2>
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
                    value={Otp}
                    placeholder="otp"
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="floatingOtp">
                    Enter otp for Verify Your Email(Cheak your email)
                  </label>
                  <div className="invalid-feedback">otp is required.</div>
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
