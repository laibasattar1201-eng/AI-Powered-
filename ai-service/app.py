from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# GEMINI
# =========================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY is missing in .env")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(
    "gemini-3.6-flash"
)


# =========================
# REQUEST MODELS
# =========================

class AskRequest(BaseModel):
    question: str


class QuizRequest(BaseModel):
    subject: str
    num_questions: int
    difficulty: str


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "AI Service is running"
    }


# =========================
# ASK AI
# =========================

@app.post("/ask")
def ask_ai(data: AskRequest):

    try:
        prompt = f"""
You are an AI study assistant.

Answer the student's question clearly and simply.

Student question:
{data.question}

Give a helpful educational answer.
"""

        response = model.generate_content(prompt)

        return {
            "answer": response.text
        }

    except Exception as error:

        print("AI ERROR:", error)

        return {
            "message": "Failed to generate AI response",
            "error": str(error)
        }


# =========================
# GENERATE QUIZ
# =========================

@app.post("/generate-quiz")
def generate_quiz(data: QuizRequest):

    prompt = f"""
Create a multiple-choice quiz.

Subject: {data.subject}
Number of Questions: {data.num_questions}
Difficulty: {data.difficulty}

Return ONLY valid JSON.

Use this exact format:

{{
  "questions": [
    {{
      "q": "Question text",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "answer": 0
    }}
  ]
}}

The answer must be the index of the correct option:
0, 1, 2, or 3.

Do not include markdown.
Do not include explanations.
"""

    try:

        response = model.generate_content(prompt)

        text = response.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        quiz = json.loads(text)

        return quiz

    except Exception as error:

        print("AI QUIZ ERROR:", error)

        return {
            "message": "Failed to generate quiz",
            "error": str(error)
        }
    