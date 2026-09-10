import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const questionBank = [
  {
    q: "What does AI stand for?",
    options: [
      "Artificial Intelligence",
      "Automated Input",
      "Applied Interface",
      "Advanced Integration",
    ],
    answer: 0,
  },
  {
    q: "Which of these is a JavaScript library for UI?",
    options: ["Django", "React", "Laravel", "MongoDB"],
    answer: 1,
  },
  {
    q: "MongoDB is a type of ___ database.",
    options: ["SQL", "Graph", "NoSQL", "Relational"],
    answer: 2,
  },
  {
    q: "Which hook manages state in React?",
    options: ["useEffect", "useRef", "useState", "useMemo"],
    answer: 2,
  },
  {
    q: "What does ML stand for?",
    options: [
      "Machine Learning",
      "Meta Language",
      "Multi Logic",
      "Managed Load",
    ],
    answer: 0,
  },
];

function Quiz() {
  const { user } = useAuth();
  const token = user?.token;

  const [stage, setStage] = useState("setup");

  const [subject, setSubject] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("Easy");

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const [recent, setRecent] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  // EDIT STATES
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // =====================================================
  // GET SAVED QUIZZES
  // =====================================================

  const loadQuizzes = async () => {
    if (!token) {
      console.log("No token found");
      return;
    }

    setLoadingRecent(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/quizzes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("GET QUIZZES RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load quizzes"
        );
      }

      setRecent(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load quizzes:", error);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadQuizzes();
    }
  }, [token]);

  // =====================================================
  // SAVE QUIZ
  // =====================================================

  const saveQuiz = async (finalScore) => {
    if (!token) {
      console.error("User is not logged in");
      return null;
    }

    try {
      const quizData = {
        title: subject || "Custom Quiz",
        subject: subject || "General",
        difficulty,
        questions,
        score: finalScore,
        totalQuestions: questions.length,
      };

      const response = await fetch(
        "http://localhost:5000/api/quizzes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(quizData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save quiz"
        );
      }

      setRecent((prev) => [data, ...prev]);

      console.log("Quiz successfully saved:", data);

      return data;
    } catch (error) {
      console.error("Quiz save error:", error);
      return null;
    }
  };

  // =====================================================
  // DELETE QUIZ
  // =====================================================

  const deleteQuiz = async (quizId) => {
    if (!token) {
      console.error("User is not logged in");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/quizzes/${quizId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete quiz"
        );
      }

      setRecent((prev) =>
        prev.filter((quiz) => quiz._id !== quizId)
      );

      console.log("Quiz deleted successfully");
    } catch (error) {
      console.error("Delete quiz error:", error);
    }
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const startEdit = (quiz) => {
    setEditingQuiz(quiz);
    setEditTitle(quiz.title || "");
  };

  // =====================================================
  // UPDATE QUIZ
  // =====================================================

  const updateQuiz = async () => {
    if (!token || !editingQuiz) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/quizzes/${editingQuiz._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
          }),
        }
      );

      const data = await response.json();

      console.log("UPDATE QUIZ RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update quiz"
        );
      }

      // Update quiz on screen
      setRecent((prev) =>
        prev.map((quiz) =>
          quiz._id === editingQuiz._id
            ? data
            : quiz
        )
      );

      // Close edit box
      setEditingQuiz(null);
      setEditTitle("");

      console.log("Quiz updated successfully");
    } catch (error) {
      console.error("Update quiz error:", error);
    }
  };

  // =====================================================
  // GENERATE NEW QUIZ
  // =====================================================

  const handleGenerate = async (e) => {
  e.preventDefault();

  if (!subject.trim()) {
    alert("Please enter a subject");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/generate-quiz",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject,
          difficulty: difficulty,
          num_questions: Number(numQuestions),
        }),
      }
    );

    const data = await response.json();

    console.log("AI QUIZ RESPONSE:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to generate quiz"
      );
    }

    setQuestions(data.questions);
    setCurrent(0);
    setScore(0);
    setSelected(null);

    setStage("taking");
  } catch (error) {
    console.error("AI QUIZ ERROR:", error);
    alert("AI Quiz generate nahi ho saka.");
  }
};

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const handleAnswer = (index) => {
    if (selected !== null) {
      return;
    }

    setSelected(index);
  };

  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const handleNext = async () => {
    if (selected === null) {
      return;
    }

    const currentQuestion = questions[current];

    const isCorrect =
      selected === currentQuestion.answer;

    const newScore = isCorrect
      ? score + 1
      : score;

    if (current + 1 < questions.length) {
      setScore(newScore);
      setCurrent((previous) => previous + 1);
      setSelected(null);
      return;
    }

    const percent = Math.round(
      (newScore / questions.length) * 100
    );

    setScore(newScore);

    await saveQuiz(percent);

    setStage("result");
  };

  // =====================================================
  // OPEN SAVED QUIZ
  // =====================================================

  const openQuiz = (quiz) => {
    if (
      !quiz.questions ||
      quiz.questions.length === 0
    ) {
      alert(
        "Is saved quiz ke questions available nahi hain."
      );
      return;
    }

    const savedQuestions = quiz.questions.map(
      (q) => ({
        q: q.question || q.q,
        options: q.options,
        answer: q.answer,
      })
    );

    setQuestions(savedQuestions);

    setSubject(
      quiz.subject ||
        quiz.title ||
        "Saved Quiz"
    );

    setDifficulty(
      quiz.difficulty || "Easy"
    );

    setCurrent(0);
    setSelected(null);
    setScore(0);

    setStage("taking");
  };

  // =====================================================
  // RESULT SCREEN
  // =====================================================

  if (stage === "result") {
    const percent =
      questions.length > 0
        ? Math.round(
            (score / questions.length) * 100
          )
        : 0;

    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center md:px-8">

        <div className="text-5xl">
          🎉
        </div>

        <h2 className="mt-4 text-3xl font-bold text-white">
          Quiz Complete!
        </h2>

        <p className="mt-3 text-slate-400">
          Aap ne {score} / {questions.length} sawalat
          sahi kiye.
        </p>

        <p className="mt-2 text-4xl font-bold text-indigo-400">
          {percent}%
        </p>

        <button
          onClick={() => {
            setSubject("");
            setQuestions([]);
            setCurrent(0);
            setSelected(null);
            setScore(0);
            setStage("setup");
            loadQuizzes();
          }}
          className="mt-8 rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600"
        >
          Create Another Quiz
        </button>

      </div>
    );
  }

  // =====================================================
  // QUIZ QUESTIONS SCREEN
  // =====================================================

  if (stage === 'taking') {
    const q = questions[current];

    if (!q) {
      return (
        <div className="p-10 text-center text-white">
          Quiz questions not found.
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">

        <p className="text-sm text-slate-400">
          Question {current + 1} of{" "}
          {questions.length}
        </p>

        <div className="mt-4 h-2 rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-indigo-500 transition-all"
            style={{
              width: `${
                ((current + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />
        </div>

        <h2 className="mt-8 text-2xl font-bold text-white">
          {q.q}
        </h2>

        <div className="mt-6 space-y-3">

          {q.options.map((opt, i) => {

            let style =
              "border-slate-700 hover:border-indigo-500";

            if (selected !== null) {

              if (i === q.answer) {
                style =
                  "border-green-500 bg-green-500/10";
              }

              else if (i === selected) {
                style =
                  "border-red-500 bg-red-500/10";
              }

              else {
                style =
                  "border-slate-800 opacity-60";
              }
            }

            return (
              <button
                key={i}
                onClick={() =>
                  handleAnswer(i)
                }
                className={`w-full rounded-lg border px-4 py-3 text-left text-white ${style}`}
              >
                {opt}
              </button>
            );
          })}

        </div>

        <button
          onClick={handleNext}
          disabled={selected === null}
          className="mt-8 rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600 disabled:opacity-40"
        >
          {current + 1 === questions.length
            ? "Finish Quiz"
            : "Next Question"}
        </button>

      </div>
    );
  }

  // =====================================================
  // SETUP SCREEN
  // =====================================================

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">

      <div className="text-center">

        <div className="text-5xl">
          📝
        </div>

        <h2 className="mt-4 text-4xl font-bold text-white">
          AI Quiz Generator
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Generate quizzes with AI and test your knowledge.
        </p>

      </div>

      {/* CREATE QUIZ */}

      <form
        onSubmit={handleGenerate}
        className="mx-auto mt-10 max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-8"
      >

        <h3 className="text-2xl font-bold text-white">
          Create a Quiz
        </h3>

        <div className="mt-6 space-y-5">

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Subject
            </label>

            <input
              type="text"
              placeholder="e.g. Artificial Intelligence"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Number of Questions
            </label>

            <select
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            >

              <option value={3}>
                3 Questions
              </option>

              <option value={5}>
                5 Questions
              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            >

              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>

            </select>

          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-500 py-3 font-semibold text-white hover:bg-indigo-600"
          >
            Generate Quiz with AI
          </button>

        </div>

      </form>

      {/* RECENT QUIZZES */}

      <section className="mt-12">

        <div className="flex items-center justify-between">

          <h3 className="text-2xl font-bold text-white">
            Recent Quizzes
          </h3>

          <button
            onClick={loadQuizzes}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Refresh
          </button>

        </div>

        {loadingRecent && (
          <p className="mt-5 text-slate-400">
            Loading quizzes...
          </p>
        )}

        {!loadingRecent &&
          recent.length === 0 && (
            <p className="mt-5 text-slate-400">
              No quizzes saved yet.
            </p>
          )}

        {!loadingRecent &&
          recent.length > 0 && (

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              {recent.map((quiz) => (

                <div
                  key={quiz._id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                >

                  <h4 className="text-xl font-semibold text-white">
                    {quiz.title}
                  </h4>

                  <p className="mt-2 text-slate-400">
                    Subject: {quiz.subject}
                  </p>

                  <p className="mt-2 text-slate-400">
                    {quiz.totalQuestions} Questions
                    {" • "}
                    {quiz.difficulty}
                  </p>

                  <p className="mt-4 text-lg font-semibold text-green-400">
                    Score: {quiz.score}%
                  </p>

                  {/* OPEN */}

                  <button
                    onClick={() =>
                      openQuiz(quiz)
                    }
                    className="mt-5 rounded-lg bg-indigo-500 px-5 py-2 font-semibold text-white hover:bg-indigo-600"
                  >
                    Open Quiz →
                  </button>

                  {/* EDIT */}

                  <button
                    onClick={() =>
                      startEdit(quiz)
                    }
                    className="ml-3 mt-5 rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() => {

                      const confirmDelete =
                        window.confirm(
                          "Are you sure you want to delete this quiz?"
                        );

                      if (confirmDelete) {
                        deleteQuiz(quiz._id);
                      }

                    }}
                    className="ml-3 mt-5 rounded-lg bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          )}

      </section>

      {/* =====================================================
          EDIT QUIZ BOX
      ===================================================== */}

      {editingQuiz && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">

          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">

            <h3 className="text-2xl font-bold text-white">
              Edit Quiz
            </h3>

            <label className="mt-5 block text-sm text-slate-300">
              Quiz Title
            </label>

            <input
              type="text"
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            <div className="mt-5 flex gap-3">

              <button
                onClick={updateQuiz}
                className="rounded-lg bg-indigo-500 px-5 py-2 font-semibold text-white hover:bg-indigo-600"
              >
                Save Changes
              </button>

              <button
                onClick={() => {
                  setEditingQuiz(null);
                  setEditTitle("");
                }}
                className="rounded-lg bg-slate-700 px-5 py-2 font-semibold text-white hover:bg-slate-600"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Quiz;
