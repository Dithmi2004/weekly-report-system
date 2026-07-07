const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

const taskValidator = [
  body("projectId").notEmpty().withMessage("Project ID is required"),
  body("assignedTo").notEmpty().withMessage("Assigned user ID is required"),
  body("title").notEmpty().withMessage("Task title is required"),
  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH"),
  body("status")
    .optional()
    .isIn(["TODO", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Status must be TODO, IN_PROGRESS, or COMPLETED"),
  handleValidationErrors,
];

const taskStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["TODO", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Status must be TODO, IN_PROGRESS, or COMPLETED"),
  handleValidationErrors,
];

module.exports = {
  taskValidator,
  taskStatusValidator,
};
