const Group = require("../models/Group");

// Get all groups of logged-in user
const getGroups = async (req, res) => {
  const groups = await Group.find({
    $or: [
      { user: req.user._id },
      { members: req.user._id },
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json(groups);
};

// Create a new group
const createGroup = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Group name is required",
    });
  }

  const group = await Group.create({
    user: req.user._id,
    name,
    description,
    members: [req.user._id],
  });

  res.status(201).json(group);
};

// Delete group
const deleteGroup = async (req, res) => {
  const group = await Group.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!group) {
    return res.status(404).json({
      message: "Group not found",
    });
  }

  await group.deleteOne();

  res.status(200).json({
    message: "Group deleted",
  });
};

module.exports = {
  getGroups,
  createGroup,
  deleteGroup,
};
