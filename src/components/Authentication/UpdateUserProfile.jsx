import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDetails,
  updateUserDetails,
} from "../../Redux/fetures/authentication";
import { useToast } from "../Genral/ToastContext";

export default function UpdateUserProfile() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { data, isLoading } = useSelector((state) => state.authSlice);

  const [formData, setFormData] = useState({
    name: "",
    pic: "",
    dob: "",
    gender: "",
    country: "",
    position: "",
    foot: "",
  });

  const [dobEditable, setDobEditable] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        pic: data.pic || "",
        dob: data.dob ? data.dob.split("T")[0] : "",
        gender: data.gender || "",
        country: data.country || "",
        position: data.position || "",
        foot: data.foot || "",
      });
    }
  }, [data]);

  const formatDate = (dob) => {
    if (!dob) return "Not provided";
    const date = new Date(dob);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({ ...prevData, pic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserDetails(formData))
      .then(() => showToast("Profile updated successfully!", "success"))
      .catch(() => showToast("Failed to update profile. Try again!", "error"));
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Update Profile</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
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
            <label>Name</label>
          </div>

          {/* Profile Picture */}
          <div className="mb-3 d-flex align-items-center">
            <input
              type="file"
              className="form-control me-3"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.pic && (
              <img
                src={formData.pic}
                alt="Profile"
                className="rounded-circle"
                width="100"
                height="100"
              />
            )}
          </div>

          {/* Date of Birth */}
          <div className="mb-3">
            {!dobEditable ? (
              <strong
                onClick={() => setDobEditable(true)}
                style={{ cursor: "pointer" }}
              >
                {formatDate(data?.dob)}
              </strong>
            ) : (
              <input
                type="date"
                className="form-control"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            )}
          </div>

          {/* Gender */}
          <div className="form-floating mb-3">
            <select
              className="form-control"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label>Gender</label>
          </div>

          {/* Country */}
          <div className="form-floating mb-3">
            <select
              className="form-control"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="India">India</option>
            </select>
            <label>Country</label>
          </div>

          {/* Position */}
          <div className="form-floating mb-3">
            <select
              className="form-control"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            >
              <option value="">Select Position</option>
              <optgroup label="Attack">
                <option>ST</option>
                <option>CF</option>
                <option>RW</option>
                <option>LW</option>
              </optgroup>
              <optgroup label="Midfield">
                <option>CAM</option>
                <option>CM</option>
                <option>RM</option>
                <option>LM</option>
              </optgroup>
              <optgroup label="Defense">
                <option>RB</option>
                <option>LB</option>
                <option>CB</option>
              </optgroup>
              <optgroup label="Goalkeeper">
                <option>GK</option>
              </optgroup>
            </select>
            <label>Favorite Playing Position</label>
          </div>

          {/* Preferred Foot */}
          <div className="form-floating mb-3">
            <select
              className="form-control"
              name="foot"
              value={formData.foot}
              onChange={handleChange}
              required
            >
              <option value="">Select Foot</option>
              <option value="Right">Right</option>
              <option value="Left">Left</option>
              <option value="Both">Both</option>
            </select>
            <label>Preferred Foot</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
