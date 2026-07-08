const { registerUser, loginUser } = require("../services/authService");

const getAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24,
});

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error during registration",
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.cookie("auth_token", result.token, getAuthCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error during login",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("auth_token", getAuthCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

module.exports = {
  register,
  login,
  logout,
};
