import React, { useState, useRef } from "react";
import { fetchSearchResults } from "../../Redux/fetures/postslice";
import { fetchCommonTeams } from "../../Redux/fetures/Teamslice";
import { fetchOtherUser } from "../../Redux/fetures/authentication";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SearchData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResult } = useSelector((state) => state.postSlice);
  const [query, setQuery] = useState("");
  const typingTimeoutRef = useRef(null);

  // Handle input changes (debounce API call)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to fetch results when user stops typing
    if (value.trim() !== "") {
      typingTimeoutRef.current = setTimeout(() => {
        dispatch(fetchSearchResults(value));
      }, 500);
    }
  };

  const handleOtherTeamProfile = async (teamid) => {
    try {
      dispatch(fetchCommonTeams(teamid));
      navigate(`/CommonTeamProfile/${teamid}`);
    } catch (error) {
      showToast(error.message || "Error while fetching player profile!");
    }
  };

  const handleOtherUserProfile = async (userid) => {
    try {
      dispatch(fetchOtherUser(userid));
      navigate(`/CommonUser/${userid}`);
    } catch (error) {
      showToast(error.message || "Error while fetching player profile!");
    }
  };

  return (
    <div
      style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
      className="mt-4"
    >
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search users or teams..."
        value={query}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Left Side - Users */}
        <div>
          <h3
            style={{ fontSize: "1.5rem", color: "#333", marginBottom: "15px" }}
          >
            Users
          </h3>
          {searchResult?.user_response?.users?.length > 0 ? (
            searchResult.user_response.users.map((user) => (
              <div
                key={user.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
                onClick={() => handleOtherUserProfile(user.userId)}
              >
                <img
                  src={user.pic}
                  alt={user.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #f0f0f0",
                  }}
                />
                <div style={{ marginLeft: "15px", flexGrow: 1 }}>
                  <h4 style={{ fontWeight: "bold", margin: "0" }}>
                    {user.name}
                  </h4>
                  <p style={{ color: "#6c757d", margin: "0" }}>
                    {user.country}
                  </p>
                  {user.playerData && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "5px",
                      }}
                    >
                      <img
                        src={user.playerData.teamlogo.teamlogo}
                        alt={user.playerData.teamname}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "3px",
                        }}
                      />
                      <p style={{ color: "#adb5bd", margin: "0" }}>
                        {user.playerData.teamname} -{user.position}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#6c757d" }}>No users found</p>
          )}
        </div>

        {/* Right Side - Teams */}
        <div>
          <h3
            style={{ fontSize: "1.5rem", color: "#333", marginBottom: "15px" }}
          >
            Teams
          </h3>
          {searchResult?.team_response?.teams?.length > 0 ? (
            searchResult.team_response.teams.map((team) => (
              <div
                key={team.teamId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
                onClick={() => handleOtherTeamProfile(team.teamId)}
              >
                <img
                  src={team.teamlogo}
                  alt={team.teamname}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #f0f0f0",
                  }}
                />
                <div style={{ marginLeft: "15px", flexGrow: 1 }}>
                  <h4 style={{ fontWeight: "bold", margin: "0" }}>
                    {team.teamname}
                  </h4>
                  <p style={{ color: "#6c757d", margin: "0" }}>
                    {team.country}
                  </p>
                  <p style={{ color: "#adb5bd", margin: "0" }}>
                    Owner: {team.owner}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#6c757d" }}>No teams found</p>
          )}
        </div>
      </div>
    </div>
  );
}
