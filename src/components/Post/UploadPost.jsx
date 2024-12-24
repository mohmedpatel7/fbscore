import React, { useState, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useToast } from "../Genral/ToastContext";

export default function UploadPost() {
  const [validated, setValidated] = useState(false); // State to manage form validation status
  const [formData, setFormData] = useState({
    description: "",
    image: "",
  });
  const [fileError, setFileError] = useState(""); // State to track file upload errors.
  const [isPending, startTransition] = useTransition(); // Manage pending state for async transitions
  const [preview, setPreview] = useState(null); // State to manage image preview

  const isUser = localStorage.getItem("token");

  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile picture file selection with validation for file type.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (file && validTypes.includes(file.type)) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setFileError("");

      // Generate image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileError("Please upload a valid image file (jpeg, jpg, png).");
      setPreview(null); // Clear preview on invalid file
    }
  };

  //Handle submit form.
  const handleSubmit = async (event) => {
    event.preventDefault();

    startTransition(async () => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        // If form is invalid, stop further propagation
        event.stopPropagation();
      }
      setValidated(true);
    });
  };

  //Handle reset form..
  const handleReset = () => {
    setFormData({
      description: "",
      image: "",
    });
    setPreview(null); // Clear preview on reset
  };

  return (
    <>
      {isUser && (
        <div className="container mt-5 mb-4">
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <div className="card-lg mt-5 mb-4 p-4 shadow rounded-3">
                <h2 className="mb-3 text-center">Make Post</h2>
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
                      name="description"
                      className="form-control"
                      value={formData.description}
                      placeholder="Description"
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="floatingDescription">Description</label>
                    <div className="invalid-feedback">
                      Description is required for uploading post.
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="file"
                      name="image"
                      className={`form-control ${
                        fileError ? "is-invalid" : ""
                      }`}
                      placeholder="Choose Photo"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="floatingPostImg">Choose Photo</label>
                    {fileError && (
                      <div className="invalid-feedback">{fileError}</div>
                    )}
                  </div>

                  {/* Image Preview */}
                  {preview && (
                    <div className="mb-3">
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  )}

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
                    Submit
                  </button>
                </form>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      )}
    </>
  );
}
