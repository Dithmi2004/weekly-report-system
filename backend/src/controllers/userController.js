const {
  changePassword,
  createUser,
  getUsers,
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

const getUsersForManager = async (req, res) => {
  try {
    const users = await getUsers();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error while fetching users",
    });
  }
};

const createUserForManager = async (req, res) => {
  try {
    const user = await createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error while creating user",
    });
  }
};

const changeOwnPassword = async (req, res) => {
  try {
    await changePassword(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error while changing password",
    });
  }
};

module.exports = {
  getProfile,
  getManagerDashboardAccess,
  getTeamMembersForManager,
  getUsersForManager,
  createUserForManager,
  changeOwnPassword,
};
