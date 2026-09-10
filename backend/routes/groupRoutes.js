
const express = require("express");

const router = express.Router();

const {
  getGroups,
  createGroup,
  deleteGroup,
} = require("../controllers/groupController");

const { protect } = require("../middleware/authMiddleware");

// All group routes require login
router.use(protect);

// GET /api/groups
// POST /api/groups
router.route("/")
  .get(getGroups)
  .post(createGroup);

// DELETE /api/groups/:id
router.route("/:id")
  .delete(deleteGroup);

module.exports = router;

