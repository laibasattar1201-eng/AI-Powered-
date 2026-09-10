const Quiz = require("../models/Quiz");

// =========================
// GET ALL QUIZZES
// =========================
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    console.log("USER ID:", req.user._id);
    console.log("QUIZZES FROM DATABASE:", quizzes);

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("GET QUIZZES ERROR:", error);

    res.status(500).json({
      message: "Failed to get quizzes",
      error: error.message,
    });
  }
};

// =========================
// CREATE QUIZ
// =========================
const createQuiz = async (req, res) => {
  try {
    const {
      title,
      subject,
      difficulty,
      questions,
      score,
      totalQuestions,
    } = req.body;

    console.log("CREATE QUIZ REQUEST:", req.body);

    if (!title || !subject) {
      return res.status(400).json({
        message: "Title and subject are required",
      });
    }

    const formattedQuestions = (questions || []).map((item) => ({
      question: item.question || item.q,
      options: item.options || [],
      answer: item.answer,
    }));

    const quiz = await Quiz.create({
      user: req.user._id,
      title,
      subject,
      difficulty: difficulty || "Easy",
      questions: formattedQuestions,
      score: score ?? 0,
      totalQuestions:
        totalQuestions ?? formattedQuestions.length,
    });

    console.log("QUIZ SAVED SUCCESSFULLY:", quiz);

    res.status(201).json(quiz);
  } catch (error) {
    console.error("CREATE QUIZ ERROR:", error);

    res.status(500).json({
      message: "Failed to create quiz",
      error: error.message,
    });
  }
};

// =========================
// DELETE QUIZ
// =========================
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    if (
      quiz.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await quiz.deleteOne();

    console.log("QUIZ DELETED:", req.params.id);

    res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("DELETE QUIZ ERROR:", error);

    res.status(500).json({
      message: "Failed to delete quiz",
      error: error.message,
    });
  }
};

// =========================
// UPDATE QUIZ
// =========================
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // Check quiz belongs to logged-in user
    if (
      quiz.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("QUIZ UPDATED:", updatedQuiz);

    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("UPDATE QUIZ ERROR:", error);

    res.status(500).json({
      message: "Failed to update quiz",
      error: error.message,
    });
  }
};

// =========================
// EXPORT
// =========================
module.exports = {
  getQuizzes,
  createQuiz,
  deleteQuiz,
  updateQuiz,
};