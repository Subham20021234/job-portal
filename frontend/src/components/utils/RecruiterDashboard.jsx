import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardHeader, // Keep CardHeader as it's part of the original structure
  Typography,
  Button,
  TextField,
  Avatar,
  Snackbar,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/authSlice";
import PhoneIcon from '@mui/icons-material/Phone';  
import ListAltIcon from '@mui/icons-material/ListAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
 
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editJob, setEditJob] = useState(null);

  const [profile, setProfile] = useState(null);
  const [profileEdit, setProfileEdit] = useState({ fullName: "", phoneNumber: "" });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const token = localStorage.getItem("token");
  const recruiterId = JSON.parse(localStorage.getItem("user"))._id;
  const dispatch = useDispatch();

  
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      setProfileEdit({
        fullName: res.data.user.fullName,
        phoneNumber: res.data.user.phoneNumber || "",
      });
      dispatch(setUser(res.data.user));
    } catch (error) {
      console.error("PROFILE FETCH ERROR:", error.response?.data || error.message);
    }
  };

   
  const handleProfileUpdate = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/user/profile",
        { fullName: profileEdit.fullName, phoneNumber: profileEdit.phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: "✅ Profile updated!", severity: "success" });
      fetchProfile();
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to update profile", severity: "error" });
    }
  };

   
  const handlePhotoUpload = async () => {
    if (!profilePhotoFile) {
      setSnackbar({ open: true, message: "Please select a photo first!", severity: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("file", profilePhotoFile);

    try {
      await axios.post("http://localhost:5000/api/user/upload?type=photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data.user;
      setProfile(updatedUser);
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfilePhotoFile(null);
      setSnackbar({ open: true, message: "✅ Photo updated!", severity: "success" });
    } catch (error) {
      console.error("PHOTO UPLOAD ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to upload photo", severity: "error" });
    }
  };

   
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const myJobs = res.data.jobs.filter((job) => job.postedBy._id === recruiterId);
      setJobs(myJobs);
    } catch (error) {
      console.error("FETCH JOBS ERROR:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchProfile();
  }, []);

   
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.description) {
      setSnackbar({ open: true, message: "Please fill all required fields!", severity: "warning" });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/jobs", newJob, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: "Job Posted Successfully!", severity: "success" });
      setNewJob({ title: "", company: "", location: "", salary: "", description: "" });
      fetchJobs();
    } catch (error) {
      console.error("POST JOB ERROR:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to post job",
        severity: "error",
      });
    }
  };

   
  const viewApplicants = async (job) => {
    try {
      setSelectedJob(job);
      const res = await axios.get(`http://localhost:5000/api/jobs/${job._id}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data.applicants);
    } catch (error) {
      console.error("FETCH APPLICANTS ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to fetch applicants", severity: "error" });
    }
  };

  
  const deleteJob = async (jobId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: "Job deleted successfully!", severity: "success" });
      fetchJobs();
    } catch (error) {
      console.error("DELETE JOB ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to delete job", severity: "error" });
    }
  };

   
  const openEditMode = (job) => {
    setEditJob(job);
    setEditMode(true);
  };

   
  const handleUpdateJob = async (e) => {
    e.preventDefault();

    if (!editJob.title || !editJob.company || !editJob.location || !editJob.description) {
      setSnackbar({ open: true, message: "Please fill all required fields!", severity: "warning" });
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${editJob._id}`,
        {
          title: editJob.title,
          company: editJob.company,
          location: editJob.location,
          salary: editJob.salary,
          description: editJob.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({ open: true, message: "✅ Job updated successfully!", severity: "success" });
      setEditMode(false);
      setEditJob(null);
      fetchJobs();
    } catch (error) {
      console.error("UPDATE JOB ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to update job", severity: "error" });
    }
  };

  return (
    <Box sx={{
  mt: 8,
  px: { xs: 2, md: 5 },
  py: 3,
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: '#F1F5F9'
}}>
   
  {profile && (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        sx={{
          mb: 3,
          p: { xs: 2, md: 4 },  
          borderRadius: "20px",  
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",  
          background: "white",
           
          maxWidth: '600px',  
          mx: 'auto',  
        }}
      >
        <CardHeader
          title="Recruiter Profile"
          titleTypographyProps={{
            variant: 'h5',
            fontWeight: 'bold',
            color: "#1E293B",
            textAlign: 'center',
            mb: { xs: 2, md: 3 }
          }}
          sx={{ p: 0 }}
        />
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 2, sm: 4 },
              mb: { xs: 3, md: 4 },
              justifyContent: 'center',
            }}
          >
            <Avatar
              src={profile.profilePhoto || ""}
              alt={profile.fullName}
              sx={{
                width: 100,
                height: 100,
                border: '3px solid #3B82F6',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
            <Stack spacing={0.5} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h6" fontWeight="bold" color="#1E293B">
                {profile.fullName}
              </Typography>
              <Typography variant="body2" color="#475569">
                {profile.email}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 0.5, color: "#475569" }}>
                <PhoneIcon fontSize="small" sx={{ color: "#64748B" }} />
                <Typography variant="body2">{profile.phoneNumber || "Not set"}</Typography>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ mb: { xs: 4, md: 5 }, mx: 'auto', width: '80%' }} />

           
          <Box sx={{ maxWidth: '400px', mx: 'auto' }}>  
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                value={profileEdit.fullName}
                onChange={(e) => setProfileEdit({ ...profileEdit, fullName: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#3B82F6' },
                    '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: '2px' },
                  },
                  input: { color: "#1E293B" },
                  label: { color: "#64748B" },
                }}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                value={profileEdit.phoneNumber}
                onChange={(e) => setProfileEdit({ ...profileEdit, phoneNumber: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#3B82F6' },
                    '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: '2px' },
                  },
                  input: { color: "#1E293B" },
                  label: { color: "#64748B" },
                }}
              />
            </Stack>
          </Box>

           
          <Stack direction="row" spacing={2} sx={{ mt: { xs: 4, md: 5 }, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleProfileUpdate}
              sx={{
                borderRadius: "30px",
                background: "#3B82F6",
                "&:hover": { background: "#2563EB", boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' },
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.2 },
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Save Profile
            </Button>
            <Button
              variant="outlined"
              component="label"
              sx={{
                borderRadius: "30px",
                color: "#3B82F6",
                borderColor: "#3B82F6",
                "&:hover": { background: "rgba(59, 130, 246, 0.08)", borderColor: "#2563EB" },
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.2 },
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Upload Photo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhotoFile(e.target.files[0])}
              />
            </Button>
            {profilePhotoFile && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePhotoUpload}
                sx={{
                    borderRadius: "30px",
                    px: { xs: 3, md: 4 },
                    py: { xs: 1, md: 1.2 },
                    textTransform: 'none',
                    fontSize: '1rem',
                    mt: { xs: 2, sm: 0 }
                }}
              >
                Confirm Upload
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  )}

       
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Post a New Job" />
          <CardContent>
            <Stack spacing={2}>
              
              <TextField
                label="Job Title"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                fullWidth
              />

               
              <TextField
                label="Company"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                fullWidth
              />

               
              <TextField
                label="Location"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                fullWidth
              />

              
              <TextField
                label="Salary (optional)"
                value={newJob.salary}
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                fullWidth
              />

               
              <TextField
                select
                label="Job Type"
                value={newJob.jobType || ""}
                onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                fullWidth
                SelectProps={{ native: true }}
                InputLabelProps={{shrink: true}}
              >
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
                <option value="Remote">Remote</option>
              </TextField>

              
              <TextField
                select
                label="Category / Industry"
                value={newJob.category || ""}
                onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                fullWidth
                SelectProps={{ native: true }}
                InputLabelProps={{shrink: true}}
              >
                <option value="">select category</option>
                <option value="IT">IT / Software</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </TextField>

              
              <TextField
                label="Job Description"
                multiline
                rows={3}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                fullWidth
              />

               
              <Button
                variant="contained"
                onClick={handlePostJob}
                sx={{
                  background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  py: 1.2,
                }}
              >
                 Post Job
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>


       
      <Typography variant="h5" sx={{ mt: 2 }}>
       <ListAltIcon/> My Posted Jobs
      </Typography>
      {jobs.length === 0 ? (
        <Typography>No jobs posted yet</Typography>
      ) : (
        jobs.map((job) => (
          <motion.div key={job._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card sx={{ my: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {job.title} @ {job.company}
                </Typography>
                <Typography color="text.secondary">
                  {job.location} - {job.salary || "Not specified"}
                </Typography>
                <Typography>👥 {job.applicants?.length || 0} Applicants</Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="outlined" onClick={() => viewApplicants(job)}>
                    View Applicants
                  </Button>
                  <Button variant="contained" color="warning" onClick={() => openEditMode(job)}>
                   <EditIcon/> Edit
                  </Button>
                  <Button variant="contained" color="error" onClick={() => deleteJob(job._id)}>
                     <DeleteIcon/>Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}

       
      {editMode && editJob && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            p: 3,
            border: "2px solid #ddd",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <Typography variant="h6">Edit Job</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Job Title"
              value={editJob.title}
              onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
            />
            <TextField
              label="Company"
              value={editJob.company}
              onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
            />
            <TextField
              label="Location"
              value={editJob.location}
              onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
            />
            <TextField
              label="Salary"
              value={editJob.salary || ""}
              onChange={(e) => setEditJob({ ...editJob, salary: e.target.value })}
            />
            <TextField
              label="Job Description"
              multiline
              rows={3}
              value={editJob.description}
              onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
            />

            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleUpdateJob}>
                <SaveIcon/> Save Changes
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditMode(false);
                  setEditJob(null);
                }}
              >
                <CancelIcon/>Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {selectedJob && (
        <Card sx={{ mt: 3 }}>
          <CardHeader
            title={`Applicants for: ${selectedJob.title}`}
            action={
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setSelectedJob(null);
                  setApplicants([]);
                }}
              >
                Close
              </Button>
            }
          />
          <CardContent>
            {applicants.length === 0 ? (
              <Typography>No one has applied yet.</Typography>
            ) : (
              applicants.map((user, index) => {
                if (!user) {
                  return (
                    <Box
                      key={`missing-${index}`}
                      sx={{ p: 2, borderBottom: "1px solid #ccc", mb: 1 }}
                    >
                      <Typography color="error">Applicant data missing</Typography>
                    </Box>
                  );
                }

                return (
                  <Box
                    key={user._id || index}
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #ccc",
                      mb: 1,
                    }}
                  >
                    <Typography>
                      <strong>{user.fullName || "Unnamed User"}</strong>{" "}
                      ({user.email || "No Email"})
                    </Typography>
                    {user.phoneNumber && <Typography><PhoneIcon/>{user.phoneNumber}</Typography>}

                    {user.resume ? (
                      <Box sx={{ mt: 1 }}>
                        <a
                          href={user.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "blue", marginRight: "15px", fontWeight: "bold" }}
                        >
                          View Resume
                        </a>
                        <a
                          href={user.resume.replace(
                            "/upload/",
                            `/upload/fl_attachment:${encodeURIComponent(
                              (user.fullName || "Applicant") + "_Resume"
                            )}/`
                          )}
                          style={{ color: "green", fontWeight: "bold" }}
                        >
                          <FileDownloadIcon/>Download Resume
                        </a>
                      </Box>
                    ) : (
                      <Typography color="error">No Resume Uploaded</Typography>
                    )}

                    <Typography variant="caption">
                      🕒 Applied On:{" "}
                      {new Date(user.createdAt || Date.now()).toLocaleString()}
                    </Typography>
                  </Box>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

       
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}