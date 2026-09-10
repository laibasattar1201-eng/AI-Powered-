import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

st.set_page_config(
    page_title="StudyAI Dashboard",
    page_icon="📚",
    layout="wide"
)

st.title("📚 StudyAI Analytics Dashboard")
st.write("Student study progress and performance overview")

st.sidebar.title("StudyAI")
st.sidebar.write("Student Dashboard")

# =========================
# SAMPLE DATA
# =========================

study_data = {
    "Category": [
        "Notes",
        "Tasks",
        "Quiz",
        "Study Planner"
    ],
    "Completed": [
        12,
        8,
        6,
        10
    ]
}

df = pd.DataFrame(study_data)

# =========================
# STATISTICS
# =========================

col1, col2, col3, col4 = st.columns(4)

col1.metric("📚 Notes", "12")
col2.metric("✅ Tasks", "8")
col3.metric("📝 Quizzes", "6")
col4.metric("📅 Study Plans", "10")

st.divider()

# =========================
# PROGRESS CHART
# =========================

st.subheader("📊 Study Progress")

fig, ax = plt.subplots()

ax.bar(
    df["Category"],
    df["Completed"]
)

ax.set_xlabel("Study Category")
ax.set_ylabel("Completed")
ax.set_title("Student Study Progress")

st.pyplot(fig)

# =========================
# DATA TABLE
# =========================

st.subheader("📋 Study Activity")

st.dataframe(
    df,
    use_container_width=True
)

# =========================
# AI INSIGHT
# =========================

st.subheader("🤖 AI Study Insight")

st.info(
    "Your study activity shows regular progress. "
    "Continue completing tasks and quizzes to improve your performance."
)

st.success("Dashboard loaded successfully!")