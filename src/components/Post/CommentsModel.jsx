import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";

export default function CommentsModel({ comments, showModel, closeModel }) {
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div
      className={`modal fade ${showModel ? "show" : ""}`}
      id="commentsModal"
      tabIndex="-1"
      aria-labelledby="commentsModalLabel"
      aria-hidden={!showModel}
      style={{ display: showModel ? "block" : "none" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header text-dark">
            <h5 className="modal-title" id="commentsModalLabel">
              Comments
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModel}
              aria-label="Close"
              style={{ border: "none" }}
            ></button>
          </div>
          <div className="modal-body">
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mb-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={comment.userpic}
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                      alt={comment.username}
                    />
                    <strong>{comment.username}</strong>
                  </div>
                  <p className="mt-2">{comment.text}</p>
                  <p className="text-muted small">{comment.date}</p>
                </div>
              ))
            ) : (
              <p className="text-center">No comments yet.</p>
            )}

            <form onSubmit={handleCommentSubmit}>
              <div className="mt-3 d-flex align-items-center">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={handleCommentChange}
                />
                <button type="submit" className="btn btn-addcomment ms-2">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
