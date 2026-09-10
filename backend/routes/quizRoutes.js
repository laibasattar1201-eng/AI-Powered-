const express = require("express");

const router = express.Router();

const {
  getQuizzes,
  createQuiz,
  deleteQuiz,
  updateQuiz,
} = require("../controllers/quizController");

const { protect } = require("../middleware/authMiddleware");

// All quiz routes require login
router.use(protect);

// GET all quizzes
// POST create quiz
router.route("/").get(getQuizzes).post(createQuiz);

// UPDATE quiz
// DELETE quiz
router
  .route("/:id")
  .put(updateQuiz)
  .delete(deleteQuiz);

module.exports = router;