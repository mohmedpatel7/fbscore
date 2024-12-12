import React, { useState, useEffect } from "react";
import Pic from "./pic.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import CommentsModel from "./CommentsModel";

export default function Posts() {
  // Initial list of posts
  const [post, setPost] = useState([
    {
      id: 1,
      description:
        "This is description for post 1... This description is long enough to show the see more functionality in action. This is just to test the description length functionality for the 'See More' button.",
      pic: Pic,
      uploadedBy: "Mohmed",
      uploadedByPic: Pic,
      date: "2024-12-25",
      likes: 5,
      comments: [
        {
          id: 1,
          username: "Jack",
          userpic: Pic,
          text: "Great post!",
          date: "2024-12-15",
        },
        {
          id: 2,
          username: "alen",
          userpic: Pic,
          text: "Interesting thoughts!",
          date: "2024-12-15",
        },
      ],
    },
    {
      id: 2,
      description: "This is description for post 2...",
      pic: Pic,
      uploadedBy: "Zaid",
      uploadedByPic: Pic,
      date: "2024-12-27",
      likes: 4,
      comments: [],
    },
    {
      id: 3,
      description: "This is description for post 3...",
      pic: Pic,
      uploadedBy: "jack",
      uploadedByPic: Pic,
      date: "2024-12-26",
      likes: 5,
      comments: [],
    },
    {
      id: 4,
      description: "This is description for post 4...",
      pic: Pic,
      uploadedBy: "John",
      uploadedByPic: Pic,
      date: "2024-12-28",
      likes: 6,
      comments: [],
    },
    {
      id: 5,
      description: "This is description for post 5...",
      pic: Pic,
      uploadedBy: "Jane",
      uploadedByPic: Pic,
      date: "2024-12-29",
      likes: 7,
      comments: [],
    },
    {
      id: 6,
      description: "This is description for post 6...",
      pic: Pic,
      uploadedBy: "Emily",
      uploadedByPic: Pic,
      date: "2024-12-30",
      likes: 8,
      comments: [],
    },
  ]);

  // State to track how many posts are visible initially (5 posts)
  const [visiblePosts, setVisiblePosts] = useState(5);

  // Function to toggle between showing full and truncated descriptions
  const toggleDescription = (id) => {
    setPost((prevPosts) =>
      prevPosts.map((p) =>
        // Toggle the "showFullDescription" state for the selected post
        p.id === id ? { ...p, showFullDescription: !p.showFullDescription } : p
      )
    );
  };

  // Function to handle scroll and load more posts
  const handleScroll = () => {
    // Check if the user has scrolled to the bottom of the page
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      // Show 5 more posts, or the total number of posts if fewer remain
      setVisiblePosts((prev) => Math.min(prev + 5, post.length));
    }
  };

  // Add a scroll event listener when the component mounts and clean it up when it unmounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //State for comment model..
  const [showModel, setShowModel] = useState(false);
  const [currentComments, setCurrentCommetns] = useState([]);

  //Function to open comments..
  const openCommetns = (comments) => {
    setCurrentCommetns(comments); //Setting comments values in state..
    setShowModel(true);
  };

  //Function to close comment model..
  const closeCommetns = () => setShowModel(false);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Empty columns for centering content */}
        <div className="col-md-3"></div>
        <div className="col-md-6">
          {/* Render visible posts */}
          {post.slice(0, visiblePosts).map((posts) => (
            <div className="mb-4" key={posts.id}>
              <div className="card shadow-sm">
                {/* Card header with user details */}
                <div className="card-head d-flex align-items-center p-3">
                  <img
                    src={posts.uploadedByPic}
                    className="rounded-circle me-3 post-user-pic"
                    width="50"
                    height="50"
                    alt="Uploader"
                  />
                  <h5 className="card-title m-0 post-user-name">
                    {posts.uploadedBy}
                  </h5>
                </div>
                {/* Card body with post description and image */}
                <div className="card-body">
                  {/* Post description */}
                  <div className="post-description-container mb-3">
                    <p className="post-description d-inline">
                      {posts.description.length > 100 &&
                      !posts.showFullDescription
                        ? posts.description.substring(0, 100)
                        : posts.description}
                    </p>
                    {/* "See More" button displayed only for long descriptions */}
                    {posts.description.length > 100 && (
                      <button
                        className="btn-seemore"
                        onClick={() => toggleDescription(posts.id)}
                      >
                        {posts.showFullDescription ? "See Less" : "See More"}
                      </button>
                    )}
                  </div>
                  {/* Post image */}
                  <img
                    src={posts.pic}
                    className="img-fluid post-img rounded"
                    alt="Post"
                  />
                </div>

                {/* Card footer with likes, comments, and date */}
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    {/* Like and comment icons */}
                    <i
                      className="fa-regular fa-heart post-like-btn"
                      title="Like"
                    ></i>
                    <span className="ms-1">{posts.likes}</span>

                    <i
                      className="fa-regular fa-comment post-like-btn ms-3"
                      title="Comment"
                      onClick={() => openCommetns(posts.comments)}
                      style={{ border: "none", background: "none" }}
                    ></i>

                    <span className="ms-1">{posts.comments.length}</span>
                  </div>
                  {/* Display the post upload date */}
                  <div className="text-end">
                    <small className="text-muted">{posts.date}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-3"></div>
      </div>

      <CommentsModel
        comments={currentComments}
        showModel={showModel}
        closeModel={closeCommetns}
      />
    </div>
  );
}
