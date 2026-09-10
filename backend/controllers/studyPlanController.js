const StudyPlan = require("../models/StudyPlan");

// @desc Get all study plans
// @route GET /api/study-planner
const getStudyPlans = async (req, res) => {
  const plans = await StudyPlan.find({ user: req.user._id }).sort({ date: 1 });
  res.status(200).json(plans);
};

// @desc Create study plan entry
// @route POST /api/study-planner
const createStudyPlan = async (req, res) => {
  const { subject, topic, date, startTime, endTime } = req.body;

  if (!subject || !date) {
    return res.status(400).json({ message: "Subject and date are required" });
  }

  const plan = await StudyPlan.create({
    user: req.user._id,
    subject,
    topic,
    date,
    startTime,
    endTime,
  });

  res.status(201).json(plan);
};

// @desc Update study plan
// @route PUT /api/study-planner/:id
const updateStudyPlan = async (req, res) => {
  const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
  if (!plan) return res.status(404).json({ message: "Study plan not found" });

  Object.assign(plan, req.body);
  const updated = await plan.save();
  res.status(200).json(updated);
};

// @desc Delete study plan
// @route DELETE /api/study-planner/:id
const deleteStudyPlan = async (req, res) => {
  const plan = await StudyPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!plan) return res.status(404).json({ message: "Study plan not found" });
  res.status(200).json({ message: "Study plan deleted" });
};

module.exports = { getStudyPlans, createStudyPlan, updateStudyPlan, deleteStudyPlan };
