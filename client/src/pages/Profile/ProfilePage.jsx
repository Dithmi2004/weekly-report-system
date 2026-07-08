import { useState } from "react";
import { KeyRound, UserCircle } from "lucide-react";

import { changePassword } from "../../api/userApi";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMessage("Password changed successfully");
      setForm(initialForm);
    } catch (error) {
      setError(error.response?.data?.message || "Could not change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl text-left">
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50 p-5 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            <UserCircle size={14} />
            Profile
          </div>
          <h1 className="text-3xl font-bold text-slate-950">My Profile</h1>
          <p className="mt-1 text-slate-600">View your account details and change your password.</p>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-bold text-slate-950">Account Details</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">Name:</span> {user?.firstName} {user?.lastName}</p>
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
              <p><span className="font-semibold">Role:</span> {user?.role?.replaceAll("_", " ")}</p>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <KeyRound size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-950">Change Password</h2>
            </div>
            {message && <p className="mb-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p>}
            {error && <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Current password"
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New password"
                minLength={6}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                minLength={6}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
              <Button type="submit" disabled={saving}>
                {saving ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
