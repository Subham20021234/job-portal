import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  Fade,
  Tooltip,
} from "@mui/material";
import { motion, transform } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

function RotatingQuote() {
  const quotes = [
    "Bridging Talent & Opportunity with AI-powered job matching",
    "Connecting you to top companies worldwide",
    "Your dream job is just a click away",
    "Smart matching for smarter careers",
  ];

  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false); 
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setShow(true); 
      }, 300); 
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Fade in={show} timeout={500}>
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          color: "#475569",
          fontStyle: "italic",
          transition: "opacity 0.5s ease",
        }}
      >
        {quotes[index]}
      </Typography>
    </Fade>
  );
}

export default function Home() {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >

        <Container
          maxWidth="md"
          sx={{ textAlign: "center", zIndex: 2, position: "relative" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h2" fontWeight="bold" color="#1E293B">
              Find Your <span style={{ color: "#3B82F6" }}>Dream Job</span>{" "}
              Today
            </Typography>

            <RotatingQuote />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{ marginTop: "40px" }}
          >
            <Box
              sx={{
                display: "flex",
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "50px",
                padding: "10px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
              }}
            >
              <TextField
                placeholder="Search jobs, titles, companies..."
                variant="outlined"
                fullWidth
                sx={{
                  "& fieldset": { border: "none" },
                  input: { color: "#1E293B" },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  borderRadius: "50px",
                  ml: 2,
                  background: "#3B82F6",
                  "&:hover": { background: "#2563EB" },
                }}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ width: "100%", background: "white" }}>
        <Container sx={{ py: 8 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 4, color: "#1E293B" }}
          >
            Explore Job Categories
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {[
              { title: "Tech & IT", icon: <CodeIcon fontSize="large" /> },
              { title: "Business", icon: <BusinessIcon fontSize="large" /> },
              { title: "Design", icon: <DesignServicesIcon fontSize="large" /> },
              { title: "General", icon: <WorkIcon fontSize="large" /> },
            ].map((cat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: "16px",
                      background: "#F8FAFC",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    {cat.icon}
                    <Typography variant="h6" sx={{ mt: 1, color: "#334155" }}>
                      {cat.title}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
 
      <Box sx={{ width: "100%", background: "#F1F5F9" }}>
        <Container sx={{ py: 8 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 4, color: "#1E293B" }}
          >
            Featured Jobs
          </Typography>
 
          <Carousel
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
              tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
              mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
            }}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            keyBoardControl
          >
            {[
              {
                title: "Associate Trainee",
                company: "EngineersMind",
                location: "Bengaluru",
                salary: "₹4.5 LPA - ₹6 LPA",
              },
              {
                title: "Associate Data Engineer",
                company: "ByteIQ",
                location: "Bhubaneswar",
                salary: "₹3 LPA - ₹5 LPA",
              },
              {
                title: "Business Analyst",
                company: "Deloitte",
                location: "Hyderabad",
                salary: "₹8 LPA - ₹12 LPA",
              },
              {
                title: "Cloud Engineer",
                company: "PwC",
                location: "Pune",
                salary: "₹10 LPA - ₹14 LPA",
              },
              {
                title: "Cybersecurity Consultant",
                company: "KPMG",
                location: "Gurgaon",
                salary: "₹9 LPA - ₹13 LPA",
              },
            ].map((job, index) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={index}
                style={{ padding: "10px" }}
              >
                <Card
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    background: "white",
                  }}
                >
                  <Typography variant="h6" color="#1E293B">
                    {job.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    {job.company} - {job.location}
                  </Typography>
                  <Typography
                    sx={{ mt: 2, color: "#3B82F6", fontWeight: "bold" }}
                  >
                    {job.salary}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      borderRadius: "20px",
                      background: "#3B82F6",
                      "&:hover": { background: "#2563EB" },
                    }}
                  >
                    View Details
                  </Button>
                </Card>
              </motion.div>
            ))}
          </Carousel>
        </Container>
      </Box>

      <Box sx={{ width: "100%", background: "white" }}>
        <Container sx={{ py: 8 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 4, color: "#1E293B" }}
          >
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                title: "AI-Powered Matching",
                desc: "We connect you with the most relevant jobs instantly.",
              },
              {
                title: "Trusted Companies",
                desc: "We partner with top organizations worldwide.",
              },
              {
                title: "Seamless Experience",
                desc: "Easy-to-use portal with modern UI.",
              },
            ].map((feature, i) => (
              <Grid item xs={12} md={4} key={i}>
                {i === 0 ? (
                  <Tooltip
                    title="AI feature coming soon"
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: '#fff', 
                          color: '#1E293B',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                          fontSize: '0.85rem', 
                          padding: '8px 12px', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0', 
                        },
                      },
                      arrow: {
                        sx: {
                          color: '#fff', 
                          '&::before': {
                            border: '1px solid #e2e8f0',
                            boxSizing: 'border-box',
                          },
                        },
                      },
                    }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Card
                        sx={{
                          p: 3,
                          borderRadius: "16px",
                          background: "#F8FAFC",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Typography variant="h6" color="#1E293B">
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: "#475569" }}>
                          {feature.desc}
                        </Typography>
                      </Card>
                    </motion.div>
                  </Tooltip>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Card
                      sx={{
                        p: 3,
                        borderRadius: "16px",
                        background: "#F8FAFC",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      <Typography variant="h6" color="#1E293B">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: "#475569" }}>
                        {feature.desc}
                      </Typography>
                    </Card>
                  </motion.div>
                )}
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      
      <Box sx={{ width: "100%", background: "#F8FAFC" }}>
        <Container sx={{ py: 7 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 4, color: "#1E293B" }}
          >
            What People Say About Us
          </Typography>

          <Carousel
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
              tablet: { breakpoint: { max: 1024, min: 600 }, items: 1 },
              mobile: { breakpoint: { max: 600, min: 0 }, items: 1 },
            }}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            keyBoardControl
            showDots
            arrows={false}
            containerClass="testimonial-carousel"
          >
            {[
              {
                name: "Aarav Mehta",
                role: "Software Engineer at Google",
                text: "This portal made my job search effortless! The listings were genuine, and applying was super smooth. Highly recommended!",
              },
              {
                name: "Priya Sharma",
                role: "UX Designer at Deloitte",
                text: "I found my dream job within 2 weeks. The interface is clean, fast, and easy to use.",
              },
              {
                name: "Rohit Verma",
                role: "Data Analyst at PwC",
                text: "The best platform for professionals! Verified companies and great opportunities.",
              },
              {
                name: "Sneha Kapoor",
                role: "Marketing Manager at KPMG",
                text: "Super smooth experience! I got hired for my dream company through this platform.",
              },
            ].map((testimonial, index) => (
              <motion.div
                whileHover={{ scale: 1.03 }}
                key={index}
                style={{ padding: "0 8px", height: "100%" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    p: 5,
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    minHeight: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: "italic",
                      color: "#475569",
                      lineHeight: 1.6,
                      mb: 2,
                    }}
                  >
                    “{testimonial.text}”
                  </Typography>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: "#1E293B" }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#3B82F6", fontSize: "0.8rem" }}
                    >
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Carousel>
        </Container>
      </Box>
 
      <Box
        sx={{
          width: "100%",
          background: "linear-gradient(180deg, #0F172A, #1E293B)",
          color: "#F8FAFC",
          py: 2,
          px: 3,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
          }}
        >
           
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", letterSpacing: 0.8, fontSize: "1rem" }}
            >
              Job<span style={{ color: "#3B82F6" }}>Connect</span>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#94A3B8",
                fontSize: "0.8rem",
              }}
            >
              Bridging Talent & Opportunity
            </Typography>
          </Box>

           
          <Box sx={{ display: "flex", gap: 2 }}>
            <a
              href="https://github.com/Subham20021234"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#F8FAFC" }}
            >
              <GitHubIcon
                sx={{
                  fontSize: 24,
                  "&:hover": { color: "#3B82F6" },
                }}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/subham-sovendu-das-905275340"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#F8FAFC" }}
            >
              <LinkedInIcon
                sx={{
                  fontSize: 24,
                  "&:hover": { color: "#0A66C2" },
                   
                }}
              />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#F8FAFC" }}
            >
              <InstagramIcon
                sx={{
                  fontSize: 24,
                  "&:hover": { color: "#EC4899" },
                  
                }}
              />
            </a>
          </Box>

           
          <Typography
            variant="caption"
            sx={{
              color: "#94A3B8",
              textAlign: { xs: "center", sm: "right" },
              fontSize: "0.8rem",
            }}
          >
            © {new Date().getFullYear()} Built by{" "}
            <b>Subham Sovendu Das</b> · Engineers Minds, Bengaluru
          </Typography>
        </Container>
      </Box>
    </>
  );
}