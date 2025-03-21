import React, { useState, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS for styling
import "./style/style.css"; // Importing custom CSS
import { useToast } from "../Genral/ToastContext"; // Custom toast context for notifications
import { useNavigate } from "react-router-dom"; // For navigation between routes
import { useDispatch, useSelector } from "react-redux"; // Redux dispatch to send actions
import { Signin } from "../../Redux/fetures/AdminSlice"; // Redux action for sign-in
import { FaEye, FaEyeSlash } from "react-icons/fa"; // FontAwesome icons for password visibility

export default function AdminSignin() {
  const [validated, setValidated] = useState(false); // State to manage form validation status
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
  }); // State to hold form input data
  const [isPending, startTransition] = useTransition(); // Manage pending state for async transitions
  const [passwordVisable, setPasswordVisable] = useState(false); // State to toggle password visibility

  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate(); // React Router navigation function
  const { showToast } = useToast(); // Custom toast for notifications

  const isUser = !!localStorage.getItem("usertoken");
  const isTeamOwner = !!localStorage.getItem("teamtoken");
  const isMatchOfficial = !!localStorage.getItem("matchOfficialtoken");
  const isAdmin = !!localStorage.getItem("admintoken");

  const { isLoading } = useSelector((state) => state.teamSlice);

  // Handles form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    startTransition(async () => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        // If form is invalid, stop further propagation
        event.stopPropagation();
      } else {
        try {
          // Dispatch sign-in action and handle response
          const result = await dispatch(Signin(formData));
          if (Signin.fulfilled.match(result)) {
            // If sign-in is successful
            showToast(
              result.payload.message || "Sign in successfully.",
              "success"
            );
            setFormData({ adminId: "", password: "" }); // Reset form data
            navigate("/"); // Navigate to home page
          } else {
            // Handle unsuccessful sign-in
            showToast(
              result.payload.message || "Invalid adminId or password.",
              "danger"
            );
          }
        } catch (error) {
          // Handle errors during sign-in process
          showToast(
            error.message || "Sign in failed. Please try again after few time.",
            "danger"
          );
        }
      }
      setValidated(true); // Set form as validated
    });
  };

  // Handles input changes and updates formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Resets the form data and validation state
  const handleReset = () => {
    setFormData({ adminId: "", password: "" });
    setValidated(false);
  };

  // Toggles password visibility state
  const handlePasswordVisability = () => {
    setPasswordVisable((prev) => !prev);
  };

  return (
    <div className="container-fluid d-flex justify-content-center">
      {!isUser && !isMatchOfficial && !isTeamOwner && !isAdmin && (
        <div className="row justify-content-center w-100">
          {/* Sign-In Form Section */}
          <div className="col-lg-6 col-md-8">
            <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
              <h2 className="mb-3 text-center">
                Sign In With Admin Credentials
              </h2>
              <form
                className={`needs-validation ${
                  validated ? "was-validated" : ""
                }`}
                noValidate
                onSubmit={handleSubmit}
              >
                {/* adminId Input Field */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="adminId"
                    value={formData.adminId}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                  <label htmlFor="floatingadminId">Admin Id </label>
                  <div className="invalid-feedback">
                    Please provide a valid admin id .
                  </div>
                </div>

                {/* Password Input Field */}
                <div className="form-floating mb-3">
                  <input
                    type={passwordVisable ? "text" : "password"} // Toggle between text and password
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                  <div className="invalid-feedback">Password is required.</div>

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

                {/* Buttons for Form Actions */}
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
                  disabled={isPending} // Disable button when pending
                >
                  {isLoading ? "Submiting" : "Submit"}
                </button>
              </form>
              <hr />
              {/* Forgot Password Link */}
              {/*
              <button
                className="btn btn-signin mt-3 w-100"
                onClick={() => navigate("/TeamForgotPassword")}
              >
                Forgot Password
              </button>
              */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
