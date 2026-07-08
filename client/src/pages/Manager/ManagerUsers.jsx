import { useCallback, useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";

import { createUser, getUsers } from "../../api/userApi";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/layout/DashboardLayout";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "TEAM_MEMBER",
};

const roleVariant = {
  MANAGER: "info",
  TEAM_MEMBER: "success",
};

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await getUsers());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createUser(form);
      setForm(initialForm);
      await loadUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Could not create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50 p-5 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            <Users size={14} />
            User management
          </div>
          <h1 className="text-3xl font-bold text-slate-950">Team Members</h1>
          <p className="mt-1 text-slate-600">
            Create team member or manager accounts from a protected manager-only page.
          </p>
        </section>

        <Card className="mt-4">
          <div className="mb-4 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-950">Add User</h2>
          </div>
          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              minLength={6}
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="TEAM_MEMBER">TEAM MEMBER</option>
              <option value="MANAGER">MANAGER</option>
            </select>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create"}
            </Button>
          </form>
        </Card>

        <Card className="mt-4 overflow-hidden p-0">
          {loading ? (
            <Loader text="Loading users..." />
          ) : users.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No users found" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-5 font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-5">
                        <Badge variant={roleVariant[user.role]}>
                          {user.role.replaceAll("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerUsers;
