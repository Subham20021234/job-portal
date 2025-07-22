import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "../../redux/features/authSlice";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const res = await axios.post("http://localhost:5000/api/user/login", input);

      if (res.data.success) {
        const token = res.data.token;
        const userData = res.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        dispatch(setUser(userData));
        setSnackbar({ open: true, message: "Login successful!", severity: "success" });

        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setSnackbar({ open: true, message: res.data.message || "Login failed", severity: "error" });
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Something went wrong!",
        severity: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "whitesmoke",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 420,
          width: "100%",
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: "#1E293B" }}>
          Welcome Back 👋
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#6B7280" }}>
          Login to continue your job search
        </Typography>

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            onChange={handleChange}
          />

          <TextField
            select
            label="Role"
            name="role"
            value={input.role}
            onChange={handleChange}
            required
            fullWidth
          >
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="seeker">Job Seeker</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              borderRadius: "10px",
              background: "linear-gradient(to right, #3B82F6, #4F46E5)", 
              "&:hover": { background: "linear-gradient(to right, #2563EB, #4338CA)" },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography variant="body2" sx={{ mt: 2, color: "#6B7280" }}>
            Don’t have an account?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/signup")}
              sx={{ color: "#3B82F6", fontWeight: "bold" }}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
