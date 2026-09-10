const express = require("express");
const router = express.Router();
const { getGroupMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:groupId", protect, getGroupMessages);

module.exports = router;
