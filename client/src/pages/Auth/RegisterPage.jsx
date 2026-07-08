import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { registerUser } from "../../api/authApi";
import "./LoginPage.css";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await registerUser(form);
      setSuccess("Account created. You can now log in.");
      setForm(initialForm);
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-panel" aria-label="Register">
        <div className="login-visual">
          <div>
            <p className="login-kicker">Weekly Report System</p>
            <h1>Create Account</h1>
            <p className="login-copy">
              Register as a team member and start tracking weekly work.
            </p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-header">
            <p className="login-kicker">Register</p>
            <h2>Team Member Account</h2>
            <p>Public registration always creates a team member account.</p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="login-error border-emerald-200 bg-emerald-50 text-emerald-700" role="status">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <label className="login-field">
            <span>First Name</span>
            <div className="login-input">
              <User size={18} />
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
          </label>

          <label className="login-field">
            <span>Last Name</span>
            <div className="login-input">
              <User size={18} />
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
          </label>

          <label className="login-field">
            <span>Email Address</span>
            <div className="login-input">
              <Mail size={18} />
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
          </label>

          <label className="login-field">
            <span>Password</span>
            <div className="login-input">
              <Lock size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button className="login-button" type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/login">
              Login
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default RegisterPage;
