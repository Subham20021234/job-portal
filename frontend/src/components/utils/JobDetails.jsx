import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Typography, Button, Container } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WorkIcon from "@mui/icons-material/Work";
import { predefinedJobs } from "../../data/predefinedJobs";


export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const token = localStorage.getItem("token");

useEffect(() => {
  const fetchJob = async () => {
    if (id.startsWith("static")) {
      const staticJob = predefinedJobs.find((j) => j._id === id);
      if (staticJob) {
        setJob(staticJob);
        return;
      }
    }
 
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(res.data.job);
    } catch (error) {
      console.error("FETCH JOB ERROR:", error.response?.data || error.message);
    }
  };

  fetchJob();
}, [id]);


  const applyJob = async () => {
    if (!token) {
      alert("Please login to apply!");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/jobs/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Applied Successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  if (!job) return <Typography textAlign="center" mt={10}>Loading job details...</Typography>;

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", pt: 10, pb: 6 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {job.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {job.company}
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <PlaceIcon color="primary" />
            <Typography>{job.location}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <MonetizationOnIcon sx={{ color: "green" }} />
            <Typography>{job.salary || "Not specified"}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <WorkIcon sx={{ color: "orange" }} />
            <Typography>{job.jobType || "Full-time"}</Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {job.description}
          </Typography>

          {job.postedBy && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              <strong>Recruiter:</strong> {job.postedBy.fullName} ({job.postedBy.email})
            </Typography>
          )}

         <Button
  variant="contained"
  size="large"
  sx={{
    background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
    borderRadius: "30px",
  }}
  onClick={() => {
    if (job._id.startsWith("static")) {
      alert("This is a demo job – cannot apply!");
      return;
    }
    applyJob();
  }}
  fullWidth
>
  {job._id.startsWith("static") ? "Demo Job" : "Apply Now"}
</Button>

        </Paper>
      </Container>
    </Box>
  );
}
