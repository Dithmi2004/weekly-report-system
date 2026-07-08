import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BarChart3,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(formData);

      if (user.role === "MANAGER") {
        navigate("/manager/dashboard");
      } else {
        navigate("/member/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <section className="login-panel" aria-label="Login">
        <div className="login-visual">
          <div>
            <p className="login-kicker">Weekly Report System</p>
            <h1>Welcome Back</h1>
            <p className="login-copy">
              Track progress, review team updates, and keep weekly work moving
              with a focused workspace.
            </p>
          </div>

          <div className="login-stats" aria-hidden="true">
            <div>
              <BarChart3 size={24} />
              <p>
                <span>Reports</span>
                <strong>Weekly</strong>
              </p>
            </div>
            <div>
              <ShieldCheck size={24} />
              <p>
                <span>Access</span>
                <strong>Secure</strong>
              </p>
            </div>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-header">
            <p className="login-kicker">Sign in</p>
            <h2>Access Your Account</h2>
            <p>Use your work email and password to continue.</p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <label className="login-field">
            <span>Email Address</span>
            <div className="login-input">
              <Mail size={18} />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="login-field">
            <span>Password</span>
            <div className="login-input">
              <Lock size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button className="login-button" type="submit">
            Login
          </button>

          <p className="text-center text-sm text-slate-500">
            Need a team member account?{" "}
            <Link
              className="font-semibold text-blue-600 hover:text-blue-700"
              to="/register"
            >
              Register
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
