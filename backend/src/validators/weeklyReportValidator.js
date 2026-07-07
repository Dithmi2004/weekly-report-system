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

const weeklyReportValidator = [
    body("projectId").notEmpty().withMessage("Project ID is required"),
    body("weekStartDate").notEmpty().withMessage("Week start date is required"),
    body("weekEndDate").notEmpty().withMessage("Week end date is required"),
    body("hoursWorked")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Hours worked must be a positive number"),
    body("completedTaskIds")
        .optional()
        .isArray()
        .withMessage("Completed task IDs must be an array"),
    body("plannedTaskIds")
        .optional()
        .isArray()
        .withMessage("Planned task IDs must be an array"),
    body("manualCompletedTasks")
        .optional()
        .isArray()
        .withMessage("Manual completed tasks must be an array"),
    body("manualPlannedTasks")
        .optional()
        .isArray()
        .withMessage("Manual planned tasks must be an array"),
    handleValidationErrors,
];

module.exports = {
    weeklyReportValidator,
};