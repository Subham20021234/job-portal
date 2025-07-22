import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { predefinedJobs } from "../../data/predefinedJobs";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  MenuItem,  
} from "@mui/material";
import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Work";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);


  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState(""); 
  const [categoryFilter, setCategoryFilter] = useState(""); 

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const token = localStorage.getItem("token");

// fetch jobs
  const fetchJobs = async () => {
  try {
    let url = token
      ? "http://localhost:5000/api/jobs"
      : "http://localhost:5000/api/jobs/public/search";

    if (!token) {
      const queryParams = new URLSearchParams({
        keyword: searchTerm || "",
        location: locationFilter || "",
        jobType: jobTypeFilter || "",
        category: categoryFilter || "",
      }).toString();

      url = `http://localhost:5000/api/jobs/public/search?${queryParams}`;
    }

    const res = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const fetchedJobs = res.data.jobs || [];
    
    const combinedJobs = [...predefinedJobs, ...fetchedJobs];

    setJobs(combinedJobs);
    setFilteredJobs(combinedJobs);
  } catch (error) {
    console.error("FETCH JOBS ERROR:", error.response?.data || error.message);
    setJobs(predefinedJobs);
    setFilteredJobs(predefinedJobs);
  }
};

  useEffect(() => {
    fetchJobs();
  }, []);

  
  useEffect(() => {
    if (!token) {
      const delayDebounce = setTimeout(() => {
        fetchJobs();
      }, 400); 

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, locationFilter, jobTypeFilter, categoryFilter]);

  
useEffect(() => {
  let result = [...jobs];

   
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (job) =>
        job.title?.toLowerCase().includes(term) ||
        job.company?.toLowerCase().includes(term)
    );
  }

   
  if (locationFilter) {
    const loc = locationFilter.toLowerCase();
    result = result.filter((job) =>
      job.location?.toLowerCase().includes(loc)
    );
  }

   
  if (jobTypeFilter) {
    result = result.filter((job) => job.jobType === jobTypeFilter);
  }

   
  if (categoryFilter) {
    result = result.filter((job) => job.category === categoryFilter);
  }

  setFilteredJobs(result);
}, [searchTerm, locationFilter, jobTypeFilter, categoryFilter, jobs]);


   
  const applyJob = async (jobId) => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login to apply!",
        severity: "warning",
      });
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Applied Successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to apply",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", pt: 10, pb: 6 }}>
      <Container>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          💼 Available Jobs
        </Typography>

         
        <Grid container spacing={2} mb={4}>
           
          <Grid item xs={12} md={4}>
            <TextField
              label="Search jobs or companies"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>

          
          <Grid item xs={12} md={4}>
            <TextField
              label="Filter by Location"
              variant="outlined"
              fullWidth
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </Grid>

          
          <Grid item xs={6} md={2}>
            <TextField
              select
              label="Job Type"
              variant="outlined"
              fullWidth
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              sx={{minWidth:160}}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Full-Time">Full-Time</MenuItem>
              <MenuItem value="Part-Time">Part-Time</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Freelance">Freelance</MenuItem>
            </TextField>
          </Grid>

           
          <Grid item xs={6} md={2}>
            <TextField
              select
              label="Category"
              variant="outlined"
              fullWidth
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{minWidth:160}}
 
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Networking">Networking</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
        </Grid>

         
        <Grid container spacing={3}>
          {filteredJobs.length === 0 ? (
            <Typography textAlign="center" sx={{ width: "100%", mt: 4 }}>
              No matching jobs found.
            </Typography>
          ) : (
            filteredJobs.map((job) => (
              <Grid item xs={12} md={6} lg={4} key={job._id}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      background: "white",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        <WorkIcon sx={{ mr: 1, color: "grey" }} />
                        <Link
                          to={`/jobs/${job._id}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          {job.title}
                        </Link>
                      </Typography>
                      <Typography color="text.secondary">
                        {job.company} • {job.location}
                      </Typography>
                      <Typography sx={{ mt: 1, mb: 1 }}>
                        Rs.{job.salary || "Not specified"}
                      </Typography>

                       
                      <Typography variant="body2" color="text.secondary">
                        {job.jobType} | {job.category}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant={token ? "contained" : "outlined"}
                          onClick={() =>
                            token
                              ? applyJob(job._id)
                              : setSnackbar({
                                  open: true,
                                  message: "Please login to apply!",
                                  severity: "warning",
                                })
                          }
                          sx={
                            token
                              ? {
                                  background:
                                    "linear-gradient(90deg, #3B82F6, #4F46E5)",
                                  borderRadius: "30px",
                                }
                              : {}
                          }
                          fullWidth
                        >
                          {token ? "Apply" : "Apply"}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
