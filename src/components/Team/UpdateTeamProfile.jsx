import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeamDetails,
  updateUserDetails,
} from "../../Redux/fetures/Teamslice";
import { useToast } from "../Genral/ToastContext";

export default function UpdateUserProfile() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { teamData, isLoading } = useSelector((state) => state.teamSlice);

  const [formData, setFormData] = useState({
    teamlogo: "",
    country: "",
    createdBy: "",
  });

  useEffect(() => {
    dispatch(fetchTeamDetails());
  }, [dispatch]);

  useEffect(() => {
    if (teamData) {
      setFormData({
        teamlogo: teamData?.team?.teamlogo || "",
        country: teamData?.team?.country || "",
        createdBy: teamData?.team?.createdBy || "",
      });
    }
  }, [teamData]);

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
        <h2 className="text-center mb-4">Update Team Details</h2>

        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="mb-3 d-flex align-items-center">
            <input
              type="file"
              className="form-control me-3"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.teamlogo && (
              <img
                src={formData.teamlogo}
                alt="Profile"
                className="rounded-circle"
                width="100"
                height="100"
              />
            )}
          </div>

          {/* Country */}
          <div className="form-floating mb-3">
            <select
              className="form-select" // Fixed class
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="India">India</option>
              <option value="Spain">Spain</option> 
            </select>
            <label>Country</label>
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
