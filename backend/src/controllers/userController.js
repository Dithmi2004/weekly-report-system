const {
  getTeamMembers,
  getUserProfileById,
} = require("../services/userService");

const getProfile = async (req, res) => {
  try {
    const user = await getUserProfileById(req.user.id);

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error while fetching profile",
    });
  }
};

const getManagerDashboardAccess = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Manager route access granted",
  });
};

const getTeamMembersForManager = async (req, res) => {
  try {
    const members = await getTeamMembers();

    return res.status(200).json({
      success: true,
      message: "Team members fetched successfully",
      data: members,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error while fetching team members",
    });
  }
};

module.exports = {
  getProfile,
  getManagerDashboardAccess,
  getTeamMembersForManager,
};
