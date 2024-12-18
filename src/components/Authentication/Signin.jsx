import React, { useState, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useToast } from "../Genral/ToastContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Signin } from "../../Redux/fetures/authentication";

export default function SignIn() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPending, startTransition] = useTransition();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    startTransition(async () => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      } else {
        try {
          const result = await dispatch(Signin(formData));
          if (Signin.fulfilled.match(result)) {
            showToast(
              result.payload.message || "Sign in successfully.",
              "success"
            );
            setFormData({ email: "", password: "" }); // Reset form data
            navigate("/");
          } else {
            // Handle rejected action
            showToast(
              result.payload.message || "Invalid email or password.",
              "danger"
            );
          }
        } catch (error) {
          showToast(
            error.message || "Sign in failed. Please try again after few time.",
            "danger"
          );
        }
      }
      setValidated(true);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({ email: "", password: "" });
    setValidated(false);
  };

  return (
    <div className="container">
      <div className="row">
        {/* Information Section */}
        <div className="col-md-6 mt-5 mb-4 info-section">
          <h4>Welcome Back!</h4>
          <p>
            Log in to your account to continue accessing all the amazing
            features of our football community:
          </p>
          <ul>
            <li>Track your player stats and progress over time.</li>
            <li>Stay connected with your team and participate in leagues.</li>
            <li>Access exclusive resources and match highlights.</li>
            <li>Seamlessly manage your profile and preferences.</li>
          </ul>
          <p>
            Don’t have an account?{" "}
            <button
              className="btn btn-link"
              onClick={() => navigate("/Signup")}
            >
              Sign Up
            </button>
            to get started!
          </p>
        </div>
        <div className="col-md-6">
          <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
            <h2 className="mb-3 text-center">Sign In</h2>
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
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
                <label htmlFor="floatingEmail">Email address</label>
                <div className="invalid-feedback">
                  Please provide a valid email address.
                </div>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
                <div className="invalid-feedback">Password is required.</div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleReset}
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

            <button className="btn btn-link mt-3">Forgot Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}
