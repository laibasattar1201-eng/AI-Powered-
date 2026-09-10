import { useState, useRef, useEffect } from "react";

const quickQuestions = [
  "Explain React hooks",
  "What is Machine Learning?",
  "Explain MongoDB",
  "Create study tips",
];

function AI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Hello! 👋 I'm your AI study assistant. Ask me anything about your studies.",
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const ask = async (question) => {
    if (!question.trim() || thinking) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: question,
      },
    ]);

    setInput("");
    setThinking(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("AI service error");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "AI service se connection nahi ho raha. Please check karein ke Python AI server port 8000 par running hai.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">

      {/* Header */}
      <div className="text-center">
        <div className="text-5xl">🤖</div>

        <h2 className="mt-4 text-4xl font-bold text-white">
          AI Study Assistant
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Ask questions, understand difficult topics, and get personalized
          help from your AI study assistant.
        </p>
      </div>

      {/* AI Chat */}
      <div className="mt-10 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

        <div className="border-b border-slate-800 p-5">
          <h3 className="font-bold text-white">
            AI Assistant
          </h3>

          <p className="mt-1 text-sm text-green-400">
            {thinking ? "● Thinking..." : "● Ready to help"}
          </p>
        </div>

        {/* Messages */}
        <div className="min-h-80 space-y-5 p-6">

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.role === "user" ? "justify-end" : ""
              }`}
            >

              {m.role === "ai" && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
                  AI
                </div>
              )}

              <div
                className={`max-w-xl ${
                  m.role === "user" ? "text-right" : ""
                }`}
              >

                <p className="font-semibold text-white">
                  {m.role === "ai"
                    ? "StudyAI Assistant"
                    : "You"}
                </p>

                <div
                  className={`mt-2 rounded-lg px-4 py-3 ${
                    m.role === "ai"
                      ? "bg-slate-800 text-slate-300"
                      : "bg-indigo-500 text-white"
                  }`}
                >
                  {m.text}
                </div>

              </div>
            </div>
          ))}

          {thinking && (
            <div className="text-sm text-slate-400">
              AI is thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-800 p-5"
        >
          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Ask your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={thinking}
              className="rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {thinking ? "Thinking..." : "Ask AI"}
            </button>

          </div>
        </form>
      </div>

      {/* Quick Questions */}
      <div className="mt-8">

        <h3 className="text-xl font-bold text-white">
          Try asking
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">

          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              disabled={thinking}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-indigo-500 disabled:opacity-50"
            >
              {q}
            </button>
          ))}

        </div>
      </div>

    </div>
  );
}

export default AI;
