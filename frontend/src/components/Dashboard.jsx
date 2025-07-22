import { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";
import RecruiterDashboard from "./utils/RecruiterDashboard";
import SeekerDashboard from "./utils/SeekerDashboard";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser } from "../redux/features/authSlice"

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);

         
        dispatch(setReduxUser(res.data.user));
      } catch (error) {
        console.error("FETCH ERROR:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          alert("Session expired! Please login again.");
          localStorage.clear();
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, dispatch]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!user) return <h3 className="text-center mt-4">No user found</h3>;

  
  return user.role === "recruiter" ? (
    <RecruiterDashboard user={user} />
  ) : (
    <SeekerDashboard user={user} />
  );
}
