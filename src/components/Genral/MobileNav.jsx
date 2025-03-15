import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Container,
  Offcanvas,
  Nav,
  Button,
  Dropdown,
  Image,
} from "react-bootstrap";
import { BsPlus, BsSearch, BsX } from "react-icons/bs";
import Default_Pic from "./style/pic.jpg";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserDetails } from "../../Redux/fetures/authentication";
import { fetchTeamDetails } from "../../Redux/fetures/Teamslice";

const MobileNavbar = ({ setShowModal }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
   const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Authentication states
  const isUser = !!localStorage.getItem("usertoken");
  const isTeamOwner = !!localStorage.getItem("teamtoken");
  const isMatchOfficial = !!localStorage.getItem("matchOfficialtoken");
  const isAdmin = !!localStorage.getItem("admintoken");

  const { data } = useSelector((state) => state.authSlice);
  const { teamData } = useSelector((state) => state.teamSlice);

  const handleSignOut = () => {
    const ask = window.confirm("Are you sure?");
    if (ask) {
      localStorage.removeItem("usertoken");
      localStorage.removeItem("teamtoken");
      localStorage.removeItem("matchOfficialtoken");
      localStorage.removeItem("admintoken");

      navigate("/");
    }
  };

  useEffect(() => {
    if (isUser) {
      dispatch(fetchUserDetails()).catch((error) => {
        console.error("Error fetching user details:", error);
      });
    }

    if (isTeamOwner) {
      dispatch(fetchTeamDetails()).catch((error) => {
        console.error("Error fetching team details:", error);
      });
    }
  }, [dispatch, isUser, isTeamOwner]);

  // Custom styles
  const sidebarStyle = {
    backgroundColor: "#50C878",
    width: "80%",
    maxWidth: "300px",
  };

  const navLinkStyle = {
    color: "white",
    padding: "10px 0",
    display: "block",
  };

  const dividerStyle = {
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    margin: "20px 0",
  };

  return (
    <div className="d-lg-none">
      {/* Fixed Mobile Navbar */}
      <Navbar bg="light" fixed="top" className="shadow-sm">
        <Container fluid className="px-3">
          {/* Left: Menu Toggle */}
          <Button
            variant="light"
            onClick={handleShow}
            className="border-0 p-1"
            aria-label="Toggle menu"
          >
            <span className="navbar-toggler-icon"></span>
          </Button>

          {/* Center: Logo */}
          <Navbar.Brand as={Link} to="/" className="mx-auto">
            FbScore
          </Navbar.Brand>

          {/* Right: Search and Profile */}
          <div className="d-flex align-items-center">
            <Button
              variant="light"
              className="border-0 p-1 me-3"
              onClick={() => navigate("/SearchData")}
              aria-label="Search"
            >
              <BsSearch size={20} />
            </Button>

            {(isUser || isTeamOwner || isAdmin) && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" className="border-0 p-0">
                  <Image
                    src={
                      isUser
                        ? data?.pic
                        : teamData?.team?.teamlogo || Default_Pic
                    }
                    alt="Profile"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      navigate(isUser ? "/Playerprofile" : "/Teamprofile")
                    }
                  >
                    Profile
                  </Dropdown.Item>
                  {isUser && (
                    <Dropdown.Item onClick={() => setShowModal(true)}>
                      Requests
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={handleSignOut}>
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Container>
      </Navbar>

      {/* Sidebar Offcanvas */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        style={sidebarStyle}
      >
        <Offcanvas.Header className="border-bottom border-white-20">
          <Offcanvas.Title className="text-white">FbScore</Offcanvas.Title>
          <Button
            variant="link"
            className="text-white p-0"
            onClick={handleClose}
          >
            <BsX size={30} />
          </Button>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Nav className="flex-column p-3">
            {/* Common Links */}
            <Nav.Link
              as={Link}
              to="/"
              style={navLinkStyle}
              onClick={handleClose}
            >
              Post
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/Matches"
              style={navLinkStyle}
              onClick={handleClose}
            >
              Match
            </Nav.Link>

            {/* Team Owner Links */}
            {isTeamOwner && (
              <>
                <Nav.Link
                  as={Link}
                  to="/TeamDashboard"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Team
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/TeamPosts"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Your Posts
                </Nav.Link>
              </>
            )}

            {/* User Links */}
            {isUser && (
              <>
                <Nav.Link
                  as={Link}
                  to="/PlayerTeam"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Team
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/UserPosts"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Your Posts
                </Nav.Link>
              </>
            )}

            {/* Match Official Links */}
            {isMatchOfficial && (
              <>
                <Nav.Link
                  as={Link}
                  to="/MatchCreate"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Create Match
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/MatchList"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Matches
                </Nav.Link>
              </>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Nav.Link
                  as={Link}
                  to="/Graph"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Analytics
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/Reports"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  General Reports
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/Requests"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Registration Requests
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/PostMaintain"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Maintain Posts
                </Nav.Link>
              </>
            )}

            {/* Upload Button */}
            {(isUser || isTeamOwner) && (
              <Button
                variant="light"
                className="border-0 p-1 my-2 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#eee", borderRadius: "5px" }}
                onClick={() => navigate(isUser ? "/Upload" : "/UploadTeamPost")}
              >
                <BsPlus size={24} /> Upload
              </Button>
            )}

            <div style={dividerStyle}></div>

            {/* Sign In and Sign Up for Unauthenticated Users */}
            {!isUser && !isTeamOwner && !isMatchOfficial && !isAdmin && (
              <>
                <Nav.Link
                  as={Link}
                  to="/SigninLandPage"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Sign In
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/SignupLandPage"
                  style={navLinkStyle}
                  onClick={handleClose}
                >
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div style={{ height: "56px" }}></div>
    </div>
  );
};

export default MobileNavbar;
