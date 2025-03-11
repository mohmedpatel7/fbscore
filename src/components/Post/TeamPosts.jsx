import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import CommentsModel from "./CommentsModel";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamPosts } from "../../Redux/fetures/postslice";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Posts() {
  const dispatch = useDispatch();
  const { teamPost } = useSelector((state) => state.postSlice);

  // State for pagination
  const [visiblePosts, setVisiblePosts] = useState(5);

  // Fetch initial posts
  useEffect(() => {
    dispatch(fetchTeamPosts());
  }, [dispatch]);

  // Load more posts when scrolling
  const fetchMoreData = () => {
    setTimeout(() => {
      setVisiblePosts((prev) => Math.min(prev + 5, posts.length));
    }, 500);
  };

  // State for comment modal
  const [showModel, setShowModel] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);

  // Open comments modal
  const openComments = (comments) => {
    setCurrentComments(comments);
    setShowModel(true);
  };

  // Close comments modal
  const closeComments = () => setShowModel(false);

  return (
    <div className="container mt-5">
      {teamPost && teamPost.length > 0 ? (
        <div className="row justify-content-center">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <InfiniteScroll
              dataLength={visiblePosts}
              next={fetchMoreData}
              hasMore={visiblePosts < teamPost.length}
              loader={<h4 className="text-center">Loading more posts...</h4>}
              endMessage={
                <p className="text-center">
                  <b>No more posts available</b>
                </p>
              }
            >
              {teamPost.slice(0, visiblePosts).map((post) => (
                <div className="mb-4" key={post.id}>
                  <div className="card shadow-sm">
                    <div className="card-head d-flex align-items-center p-3 justify-content-between">
                      <div className="d-flex align-items-center">
                        <img
                          src={post.uploadedBy_pic}
                          className="rounded-circle me-3 post-user-pic"
                          width="50"
                          height="50"
                          alt="Uploader"
                        />
                        <h5 className="card-title m-0 post-user-name">
                          {post.uploadedBy_name}
                        </h5>
                      </div>
                      <div className="dropdown">
                        <button
                          className="btn btn-link text-dark p-0"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <i className="fas fa-trash-alt me-2"></i>
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="post-description-container mb-3">
                        <p className="post-description d-inline">
                          {post.description.length > 100
                            ? post.description.substring(0, 100) + "..."
                            : post.description}
                        </p>
                      </div>
                      <img
                        src={post.image}
                        className="img-fluid post-img rounded"
                        alt="Post"
                      />
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                      {/*   <div className="d-flex">
                        <i
                          className="fa-regular fa-heart post-like-btn"
                          title="Like"
                        ></i>
                        <span className="ms-1">{post.likes}</span>

                        <i
                          className="fa-regular fa-comment post-like-btn ms-3"
                          title="Comment"
                          onClick={() => openComments(post.comment)}
                          style={{ border: "none", background: "none" }}
                        ></i>

                        <span className="ms-1">{post.comment.length}</span>
                      </div> */}
                      <div className="text-end">
                        <small className="text-muted">{post.date}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
          <div className="col-md-3"></div>
        </div>
      ) : (
        <h1 className="text-center">No posts available!</h1>
      )}

      <CommentsModel
        comments={currentComments}
        showModel={showModel}
        closeModel={closeComments}
      />
    </div>
  );
}
