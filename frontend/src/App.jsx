import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import JobList from "./components/utils/JobList";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import CustomNavbar from "./components/shared/navbar";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Dashboard from "./components/dashboard";
import Home from "./components/utils/Home";
import { setUser } from "./redux/features/authSlice";
import JobDetails from "./components/utils/JobDetails";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const safeParseJSON = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.warn("Invalid JSON in localStorage, clearing...");
    localStorage.removeItem("user");
    return null;
  }
};

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = safeParseJSON(localStorage.getItem("user"));
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/dashboard"element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}
