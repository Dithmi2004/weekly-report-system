import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  FileText,
  AlertCircle,
  Users,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";
import { USER_ROLES } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.png";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const managerLinks = [
    { label: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
    { label: "Projects", path: "/manager/projects", icon: FolderKanban },
    { label: "Tasks", path: "/manager/tasks", icon: ListChecks },
    { label: "Reports", path: "/manager/reports", icon: FileText },
    { label: "Blockers", path: "/manager/blockers", icon: AlertCircle },
    { label: "Team Members", path: "/manager/users", icon: Users },
    { label: "Profile", path: "/manager/profile", icon: UserCircle },
  ];

  const memberLinks = [
    { label: "Dashboard", path: "/member/dashboard", icon: LayoutDashboard },
    { label: "My Projects", path: "/member/projects", icon: FolderKanban },
    { label: "My Tasks", path: "/member/tasks", icon: ListChecks },
    { label: "My Reports", path: "/member/reports", icon: FileText },
    { label: "Create Report", path: "/member/reports/create", icon: FileText },
    { label: "Profile", path: "/member/profile", icon: UserCircle },
  ];

  const links = user?.role === USER_ROLES.MANAGER ? managerLinks : memberLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-hidden bg-[#17145f] text-white shadow-2xl shadow-indigo-950/20 transition-transform lg:sticky lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg shadow-indigo-950/20">
              <img
                src={logo}
                alt="Weekly Report System"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase leading-tight tracking-wide">
                Weekly Report
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                System
              </p>
            </div>
          </div>

          <button
            className="rounded-xl p-2 text-indigo-100 hover:bg-white/10 lg:hidden"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-5 py-2">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-indigo-500/80 text-white shadow-lg shadow-indigo-950/20"
                      : "text-indigo-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-indigo-100 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
