import React, { useEffect } from "react";
import { fetchTotals } from "../../Redux/fetures/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../Genral/ToastContext";
import {
  FaUsers,
  FaUserShield,
  FaFutbol,
  FaFlag,
  FaUserTie,
} from "react-icons/fa";
import {
  BarChart,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  PieChart,
  Pie,
  Label,
} from "recharts";
import { Card } from "react-bootstrap";

export default function Graph() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { totalUsers } = useSelector((state) => state.AdminSlice);
  const isAdmin = localStorage.getItem("admintoken");

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchTotals());
    }
  }, [dispatch, isAdmin]);

  if (!isAdmin) return null;

  // Chart Data
  const chartData = [
    { category: "Admins", total: totalUsers?.totalAdmins ?? 0 },
    { category: "Teams", total: totalUsers?.totalTeams ?? 0 },
    { category: "Users", total: totalUsers?.totalUsers ?? 0 },
    { category: "Players", total: totalUsers?.totalPlayers ?? 0 },
    { category: "Officials", total: totalUsers?.totalMatchOfficials ?? 0 },
  ];

  const pieData = [
    { name: "Players", value: totalUsers?.totalPlayers ?? 0, fill: "#28a745" },
    { name: "Users", value: totalUsers?.totalUsers ?? 0, fill: "#007bff" },
  ];

  return (
    <div className="container mt-4">
      {/* Stats Cards Row */}
      <div className="row justify-content-center">
        {[
          {
            label: "Total Admins",
            value: totalUsers?.totalAdmins ?? 0,
            icon: <FaUserShield size={40} />,
            bg: "#dc3545",
          },
          {
            label: "Total Teams",
            value: totalUsers?.totalTeams ?? 0,
            icon: <FaFlag size={40} />,
            bg: "#ffc107",
          },
          {
            label: "Total Users",
            value: totalUsers?.totalUsers ?? 0,
            icon: <FaUsers size={40} />,
            bg: "#007bff",
          },
          {
            label: "Total Players",
            value: totalUsers?.totalPlayers ?? 0,
            icon: <FaFutbol size={40} />,
            bg: "#28a745",
          },
          {
            label: "Total Officials",
            value: totalUsers?.totalMatchOfficials ?? 0,
            icon: <FaUserTie size={40} />,
            bg: "#6f42c1",
          },
        ].map((item, index) => (
          <div key={index} className="col-lg-2 col-md-4 col-sm-6 mb-3">
            <div
              className="card text-white"
              style={{
                backgroundColor: item.bg,
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "15px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {item.icon}
              <div className="ml-3 text-center">
                <h6>{item.label}</h6>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graph Section with Left & Right Layout */}
      <div className="row mt-2 mb-2">
        {/* Left Side: Bar Chart */}
        <div className="col-lg-6 col-md-8 col-12">
          <Card className="p-3">
            <h5>System Overview</h5>
            <p>Statistics Overview</p>
            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Side: Pie Chart for Players vs Users */}
        <div className="col-lg-6 col-md-4 col-12">
          <Card className="p-3">
            <h5>Players vs Users</h5>
            <div
              style={{
                width: "100%",
                height: "300px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={3}
                    label
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-2xl font-bold"
                              >
                                {totalUsers?.totalPlayers +
                                  totalUsers?.totalUsers}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground"
                              >
                                Total
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
