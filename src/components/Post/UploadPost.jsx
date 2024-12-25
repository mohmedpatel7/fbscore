import React, { useState, useTransition } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import { useToast } from "../Genral/ToastContext";
import { useDispatch } from "react-redux";
import { uploadPost } from "../../Redux/fetures/postslice";

export default function UploadPost() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    image: null,
  });
  const [fileError, setFileError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState(null);

  const isUser = localStorage.getItem("token");
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (file && validTypes.includes(file.type)) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setFileError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileError("Please upload a valid image file (jpeg, jpg, png).");
      setPreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    startTransition(async () => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      } else {
        try {
          const submissionData = new FormData();
          submissionData.append("description", formData.description);
          if (formData.image) {
            submissionData.append("image", formData.image);
          }

          const result = await dispatch(uploadPost(submissionData)).unwrap();

          if (result.success) {
            showToast("Posted successfully.", "success");
            setFormData({ description: "", image: null });
            setPreview(null);
          } else {
            showToast("Error while posting", "danger");
          }
        } catch (error) {
          showToast(error.message || "Internal server error!", "danger");
        }
      }
      setValidated(true);
    });
  };

  const handleReset = () => {
    setFormData({ description: "", image: null });
    setPreview(null);
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
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      )}
    </>
  );
}
