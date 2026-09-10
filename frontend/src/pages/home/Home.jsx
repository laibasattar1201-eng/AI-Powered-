import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <div className="text-2xl font-bold">
          Study<span className="text-indigo-400">AI</span>
        </div>

        <div className="hidden md:flex gap-8 text-slate-300">
          <a href="#" className="hover:text-white">Home</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how-it-works" className="hover:text-white">
            How It Works
          </a>
          <a href="#about" className="hover:text-white">About</a>
        </div>

        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 text-slate-300 hover:text-white">
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-indigo-500 px-5 py-2 font-semibold hover:bg-indigo-600"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-24 text-center">
        <div className="mx-auto max-w-4xl">

          <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            AI-Powered Learning Platform
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-6xl">
            Learn Smarter.
            <br />
            <span className="text-indigo-400">
              Collaborate Better.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            An AI-powered collaborative learning platform that helps
            students study, organize their work, create quizzes,
            manage tasks, and learn together.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-indigo-500 px-7 py-3 font-semibold hover:bg-indigo-600"
            >
              Get Started
            </Link>

            <a
              href="#features"
              className="rounded-lg border border-slate-700 px-7 py-3 font-semibold hover:bg-slate-900"
            >
              Explore Features
            </a>
          </div>

        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 bg-slate-900">
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Features
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Everything You Need to Study Better
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Powerful tools designed to make your learning experience
              smarter, easier, and more collaborative.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Feature 1 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl">🤖</div>
              <h3 className="mt-4 text-xl font-semibold">
                AI Study Assistant
              </h3>
              <p className="mt-3 text-slate-400">
                Ask questions and get AI-powered explanations
                whenever you need help.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl">📚</div>
              <h3 className="mt-4 text-xl font-semibold">
                Smart Notes
              </h3>
              <p className="mt-3 text-slate-400">
                Organize your study material and manage your notes
                in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl">📝</div>
              <h3 className="mt-4 text-xl font-semibold">
                AI Quiz Generator
              </h3>
              <p className="mt-3 text-slate-400">
                Generate quizzes and MCQs automatically to test
                your knowledge.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl">📅</div>
              <h3 className="mt-4 text-xl font-semibold">
                Study Planner
              </h3>
              <p className="mt-3 text-slate-400">
                Plan your study schedule and stay organized with
                your academic goals.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl">👥</div>
              <h3 className="mt-4 text-xl font-semibold">
                Collaborative Groups
              </h3>
              <p className="mt-3 text-slate-400">
                Create study groups and learn together with your
                classmates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl">💬</div>
              <h3 className="mt-4 text-xl font-semibold">
                Real-Time Chat
              </h3>
              <p className="mt-3 text-slate-400">
                Communicate with your study partners through
                real-time messaging.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-8 py-20">
        <div className="mx-auto max-w-5xl text-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            How It Works
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Start Learning in Three Steps
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold">
                1
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Create Your Account
              </h3>

              <p className="mt-3 text-slate-400">
                Sign up and create your personalized student profile.
              </p>
            </div>

            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold">
                2
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Study & Collaborate
              </h3>

              <p className="mt-3 text-slate-400">
                Create notes, tasks, groups, quizzes, and study plans.
              </p>
            </div>

            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold">
                3
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Learn with AI
              </h3>

              <p className="mt-3 text-slate-400">
                Use AI tools to improve your understanding and productivity.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="px-8 py-20 bg-indigo-600">
        <div className="mx-auto max-w-3xl text-center">

          <h2 className="text-4xl font-bold">
            Ready to Study Smarter?
          </h2>

          <p className="mt-5 text-lg text-indigo-100">
            Join an intelligent learning environment built for
            modern students.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-indigo-600 hover:bg-slate-100"
          >
            Get Started
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-8 py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 md:flex-row">

          <div>
            <div className="text-xl font-bold">
              Study<span className="text-indigo-400">AI</span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              AI-Powered Collaborative Learning Platform
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 StudyAI. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}

export default Home;