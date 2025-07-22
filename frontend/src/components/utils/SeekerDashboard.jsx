import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Slider from "react-slick";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser as setReduxUser } from "../../redux/features/authSlice";
import EditIcon from '@mui/icons-material/Edit';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ListAltIcon from '@mui/icons-material/ListAlt';

export default function SeekerDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // File Upload States
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);

  // Inline edit states
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || "");
  const [editPhone, setEditPhone] = useState(user?.phoneNumber || "");

  // Snackbar States
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const token = localStorage.getItem("token");

   
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(res.data.applications || []);
      } catch (err) {
        showSnackbar("Failed to load applications", "error");
        console.error("APPLICATION FETCH ERROR:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

   
  const showSnackbar = (msg, severity = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  //Upload File with refresh
  const uploadFile = async (type, file) => {
    if (!file) return showSnackbar(`Please select a ${type} first!`, "warning");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `http://localhost:5000/api/user/upload?type=${type}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //Refresh user after upload
      const profileRes = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = profileRes.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));  
      dispatch(setReduxUser(updatedUser));  

      showSnackbar(
        `${type === "photo" ? "Profile Photo" : "Resume"} uploaded successfully!`
      );
    } catch (err) {
      showSnackbar("Upload failed. Try again!", "error");
    }
  };

   
  const saveProfile = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/user/profile",
        { fullName: editName, phoneNumber: editPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

       
      const profileRes = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = profileRes.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch(setReduxUser(updatedUser));

      showSnackbar("Profile updated!");
      setEditMode(false);
    } catch (err) {
      showSnackbar("Failed to update profile", "error");
    }
  };

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", pt: 10, pb: 6 }}>
      <Container maxWidth="lg">
         
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={user?.profilePhoto || ""} sx={{ width: 70, height: 70 }}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight="bold">
                Welcome back, {user?.fullName || "User"}! 🎉
              </Typography>
              <Typography color="text.secondary">
                {user?.email || ""}
              </Typography>
              <Typography color="text.secondary">
                {user?.phoneNumber}
              </Typography>
            </Box>
          </Box>

         
          <Box display="flex" gap={3}>
            <Chip
              icon={<AssignmentTurnedInIcon />}
              label={`${applications.length} Applications`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<FavoriteBorderIcon />}
              label="0 Saved Jobs"
              variant="outlined"
            />
          </Box>
        </Paper>

         
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, width: "100%" }}>
          <Grid container spacing={4}>
             
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <EditIcon/> Edit Profile
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {editMode ? (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Editing Profile
                  </Typography>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                  />
                  <Button variant="contained" onClick={saveProfile} sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Typography><strong>Name:</strong> {user?.fullName}</Typography>
                  <Typography><strong>Role:</strong> {user?.role}</Typography>
                  <Typography><strong>Phone:</strong> {user?.phoneNumber}</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, background: "linear-gradient(90deg, #3B82F6, #4F46E5)" }}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </Grid>

             
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <CloudUploadIcon/> Upload Files
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Button
                variant="outlined"
                component="label"
                sx={{ mb: 2, width: "100%" }}
              >
                Choose Profile Photo
                <input
                  hidden
                  type="file"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                />
              </Button>
              <Button
                variant="contained"
                sx={{
                  mb: 3,
                  background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
                  width: "100%",
                }}
                onClick={() => uploadFile("photo", profilePhoto)}
              >
                Upload Profile Photo
              </Button>

              <Button
                variant="outlined"
                component="label"
                sx={{ mb: 2, width: "100%" }}
              >
                Choose Resume (PDF/DOC)
                <input
                  hidden
                  type="file"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
                  width: "100%",
                }}
                onClick={() => uploadFile("resume", resume)}
              >
                Upload Resume
              </Button>

              {user?.resume && (
                <Typography sx={{ mt: 1 }}>
                  <FileDownloadIcon/>{" "}
                  <a href={user.resume} target="_blank" rel="noreferrer">
                    View / Download Resume
                  </a>
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>

         
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          <ListAltIcon/> My Applications
        </Typography>
        {loading ? (
          <Typography>Loading applications...</Typography>
        ) : applications.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography>No applications yet.</Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
              }}
              href="/jobs"
            >
              Explore Jobs
            </Button>
          </Paper>
        ) : (
          <Slider {...sliderSettings}>
            {applications.map((app) => (
              <Card
                key={app._id}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  p: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {app.job?.title || "Unknown Job"}
                  </Typography>
                  <Typography color="text.secondary">
                    {app.job?.company || "Unknown Company"}
                  </Typography>
                   
                    
                  <Typography sx={{ mt: 1 }}>
                    Applied on:{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Slider>
        )}
      </Container>

       
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
