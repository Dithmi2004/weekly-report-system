const assistantService = require("../services/assistantService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const chat = asyncHandler(async (req, res) => {
  const response = await assistantService.askAssistant(
    req.user,
    req.body.message,
  );

  return successResponse(res, "Assistant response generated", response);
});

module.exports = {
  chat,
};
