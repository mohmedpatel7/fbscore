import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
//import CommentsModel from "./CommentsModel";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../Redux/fetures/postslice";
import { fetchTeamReq } from "../../Redux/fetures/authentication";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Posts({ setShowModal }) {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.postSlice);
  const { teamReq } = useSelector((state) => state.authSlice);
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [showAlert, setShowAlert] = useState(true); // State to control alert visibility

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTeamReq());
  }, [dispatch]);

  const fetchMoreData = () => {
    setTimeout(() => {
      setVisiblePosts((prev) => Math.min(prev + 5, posts.length));
    }, 500);
  };

  {
    /*  const [showModel, setShowModel] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);

  const openComments = (comments) => {
    setCurrentComments(comments);
    setShowModel(true);
  };

  const closeComments = () => setShowModel(false); */
  }

  const isUser = localStorage.getItem("usertoken");

  return (
    <div className="container mt-5">
      {/* Bootstrap Alert with Close Button */}
      {isUser && teamReq?.totalRequests > 0 && showAlert && (
        <div
          className="alert alert-warning alert-dismissible fade show text-center"
          role="alert"
          onClick={() => setShowModal(true)}
        >
          <strong>
            You have {teamReq.totalRequests} pending team requests!
          </strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAlert(false)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {posts && posts.length > 0 ? (
        <div className="row justify-content-center">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <InfiniteScroll
              dataLength={visiblePosts}
              next={fetchMoreData}
              hasMore={visiblePosts < posts.length}
              loader={<h4 className="text-center">Loading more posts...</h4>}
              endMessage={
                <p className="text-center">
                  <b>No more posts available</b>
                </p>
              }
            >
              {posts.slice(0, visiblePosts).map((post) => (
                <div className="mb-4" key={post.id}>
                  <div className="card shadow-sm">
                    <div className="card-head d-flex align-items-center p-3">
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

      {/* <CommentsModel
        comments={currentComments}
        showModel={showModel}
        closeModel={closeComments}
      />*/}
    </div>
  );
}
