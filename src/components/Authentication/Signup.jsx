import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useNavigate } from "react-router-dom"; // Navigation hook for routing.
import { useToast } from "../Genral/ToastContext"; // Custom Toast Context for notifications.
import { useDispatch } from "react-redux"; // Dispatch hook for Redux actions.
import { sendOtp } from "../../Redux/fetures/authentication"; // Redux action for sending OTP.

export default function Signup() {
  // State for form validation.
  const [validated, setValidated] = useState(false);

  // States for password and password confirmation, along with error handling.
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // State to store user inputs.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    country: "",
    position: "",
    strongFoot: "",
    pic: null,
  });

  // File input error state.
  const [fileError, setFileError] = useState("");

  const { showToast } = useToast(); // To display toast notifications.
  const dispatch = useDispatch(); // For dispatching Redux actions.
  const navigate = useNavigate(); // For programmatic navigation.

  // **Handle input change:** Updates the corresponding field in the `formData` state.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // **Handle file input change:** Validates the file type and stores the selected file in `formData`.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (file && validTypes.includes(file.type)) {
      setFormData((prevData) => ({
        ...prevData,
        pic: file,
      }));
      setFileError(""); // Clear any previous file error.
    } else {
      setFileError("Please upload a valid image file (jpeg, jpg, png).");
    }
  };

  // **Handle form submission:**
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior.

    const form = event.currentTarget;

    // **Password Validation:**
    if (password !== confirmPassword) {
      setPasswordError(true); // Set error if passwords do not match.
    } else {
      setPasswordError(false);
    }

    // **Form Validation:**
    if (
      form.checkValidity() === false ||
      password !== confirmPassword ||
      fileError
    ) {
      event.stopPropagation(); // Stops further event propagation if validation fails.
    } else {
      // Dispatching Redux action to send OTP to the provided email.
      dispatch(sendOtp({ email: formData.email }))
        .then(() => {
          showToast("Verify your email", "success"); // Show success toast.
          navigate("/Otppage"); // Redirect to OTP verification page.
        })
        .catch(() => {
          showToast("Error sending OTP", "error"); // Show error toast.
        });
    }

    setValidated(true); // Sets form validation state to true.
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
            <h2 className="mb-3 text-center">Sign Up</h2>

            {/* Form */}
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              {/* Name Input */}
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

              {/* Profile Picture Input */}
              <div className="form-floating mb-3">
                <input
                  type="file"
                  className={`form-control ${fileError ? "is-invalid" : ""}`}
                  name="floatingProfile"
                  placeholder="Profile Picture"
                  onChange={handleFileChange}
                />
                <label htmlFor="floatingProfile">Select Profile Picture</label>
              </div>

              {/* Email Input */}
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

              {/* Date of Birth Input */}
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

              {/* Gender Input */}
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

              {/* Country Input */}
              <div className="form-floating mb-3">
                <select
                  className="form-control"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option>Select</option>
                  <option>India</option>
                </select>
                <label htmlFor="floatingCountry">Country</label>
                <div className="invalid-feedback">Country is required.</div>
              </div>

              {/* Password Input */}
              <div className="form-floating mb-3 mt-5">
                <input
                  type="password"
                  className="form-control"
                  name="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
                <div className="invalid-feedback">Password is required.</div>
              </div>

              {/* Confirm Password Input */}
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className={`form-control ${
                    passwordError ? "is-invalid" : ""
                  }`}
                  name="floatingConfirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingConfirmPassword">
                  Confirm Password
                </label>
                <div className="invalid-feedback">
                  {passwordError
                    ? "Passwords do not match."
                    : "Confirming your password is required."}
                </div>
              </div>

              {/* Buttons */}
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
  );
}
