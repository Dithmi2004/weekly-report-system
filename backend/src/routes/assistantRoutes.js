const express = require("express");

const { chat } = require("../controllers/assistantController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/chat", authenticateUser, chat);

module.exports = router;
