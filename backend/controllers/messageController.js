const Message = require("../models/Message");
const Group = require("../models/Group");

// Get chat history for a group
const getGroupMessages = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    const messages = await Message.find({
      group: req.params.groupId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load messages",
    });
  }
};

module.exports = { getGroupMessages };