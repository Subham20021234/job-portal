import express from "express";

import { 
  registerUser, 
  loginUser, 
  getDashboard, 
  getProfile, 
  getMyApplications  
} from "../controller/user.controller.js";

import { updateProfile, uploadFile } from "../controller/profile.controller.js";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);


router.post("/upload-test", upload.single("file"), (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or Cloudinary failed",
        debug: req.file
      });
    }
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully to Cloudinary!",
      cloudinaryUrl: req.file.path,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Cloudinary Upload Failed",
      error: error.message,
      stack: error.stack
    });
  }
});

//Protected User Routes
router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/dashboard", authMiddleware, getDashboard);

//Fetch applications for seeker
router.get("/applications", authMiddleware, getMyApplications);

export default router;
