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

const projectValidator = [
  body("name").notEmpty().withMessage("Project name is required"),
  body("description").optional(),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE"),
  handleValidationErrors,
];

const assignMemberValidator = [
  body("userId").notEmpty().withMessage("User ID is required"),
  handleValidationErrors,
];

module.exports = {
  projectValidator,
  assignMemberValidator,
};