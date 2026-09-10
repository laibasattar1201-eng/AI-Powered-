const express = require("express");
const router = express.Router();
const {
  getStudyPlans,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
} = require("../controllers/studyPlanController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getStudyPlans).post(createStudyPlan);
router.route("/:id").put(updateStudyPlan).delete(deleteStudyPlan);

module.exports = router;
