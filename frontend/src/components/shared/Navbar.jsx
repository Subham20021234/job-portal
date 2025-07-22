import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/features/authSlice";
import { motion } from "framer-motion"; 

export default function CustomNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(setUser(null));
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "#1E293B",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)", 
      }}
    >
      <Container>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              letterSpacing: 1,
              color: "#F8FAFC",
            }}
          >
            Job<span style={{ color: "#3B82F6" }}>Connect</span>
          </Typography>

          <div>
            <Button
              sx={{
                color: "#F8FAFC",
                "&:hover": { color: "#3B82F6" }, 
              }}
              component={Link}
              to="/"
            >
              Home
            </Button>
            <Button
              sx={{
                color: "#F8FAFC",
                "&:hover": { color: "#3B82F6" },
              }}
              component={Link}
              to="/jobs"
            >
              Jobs
            </Button>

            {user ? (
              <>
                <Button
                  sx={{
                    color: "#F8FAFC",
                    "&:hover": { color: "#3B82F6" },
                  }}
                  component={Link}
                  to="/dashboard"
                >
                  Dashboard
                </Button>
          
                <motion.div
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  style={{ display: 'inline-block', marginLeft: '16px' }} 
                >
                  <Button
                    sx={{
                      background: "#EF4444",
                      "&:hover": { background: "#DC2626" },
                      color: "#F8FAFC",
                    }}
                    variant="contained"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <Button
                  sx={{
                    background: "#3B82F6",
                    "&:hover": { background: "#2563EB" },
                    color: "#F8FAFC",
                  }}
                  variant="contained"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  sx={{
                    ml: 2,
                    background: "#2563EB",
                    "&:hover": { background: "#1D4ED8" },
                    color: "#F8FAFC",
                  }}
                  variant="contained"
                  component={Link}
                  to="/signup"
                >
                  Signup
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}