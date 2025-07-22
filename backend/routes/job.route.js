import express from "express";
import {
  createJob,
  getAllJobs,
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateJob,
  deleteJob,
  getJobById
} from "../controller/job.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { recruiterOnly, seekerOnly } from "../middleware/roleMiddleware.js";
import { searchPublicJobs } from "../controller/job.controller.js";

const router = express.Router();



router.get("/public/search", searchPublicJobs);

router.get("/", getAllJobs);

router.post("/", authMiddleware, recruiterOnly, createJob);

router.post("/:jobId/apply", authMiddleware, seekerOnly, applyJob);

router.get("/applied/me", authMiddleware, seekerOnly, getAppliedJobs);

router.get("/:jobId/applicants", authMiddleware, recruiterOnly, getApplicants);

router.get("/:jobId", getJobById);

router.put("/:jobId", authMiddleware, recruiterOnly, updateJob);

router.delete("/:jobId", authMiddleware, recruiterOnly, deleteJob);

export default router;
