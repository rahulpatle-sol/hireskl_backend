const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../../middleware/auth.middleware");
const {
  createManager,
  listManagers,
  getManager,
  updateManager,
  deleteManager,
  getMyCandidates,
  createAssignment,
  scoreAssignment,
  getMyAssignments,
  getMyProfile,
} = require("../../controllers/manager/manager.controller");

// ── Admin-only routes (chain of command: ONLY admin manages managers;
// master manages admins, never managers directly) ──
router.post("/create", protect, authorizeRoles("admin"), createManager);
router.get("/", protect, authorizeRoles("admin"), listManagers);
router.put("/:id", protect, authorizeRoles("admin"), updateManager);
router.delete("/:id", protect, authorizeRoles("admin"), deleteManager);

// ── Manager self-service routes ───────────────────
router.get("/me", protect, authorizeRoles("manager"), getMyProfile);
router.get("/my/candidates", protect, authorizeRoles("manager"), getMyCandidates);
router.get("/my/assignments", protect, authorizeRoles("manager"), getMyAssignments);
router.post("/assignment", protect, authorizeRoles("manager"), createAssignment);
router.put("/assignment/:id/score", protect, authorizeRoles("manager"), scoreAssignment);

// This must come AFTER /me and /my/* to avoid conflict
router.get("/:id", protect, authorizeRoles("admin"), getManager);

module.exports = router;

