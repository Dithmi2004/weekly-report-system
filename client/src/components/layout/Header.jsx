import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const displayRole = user?.role?.replaceAll("_", " ");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu size={24} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-slate-500">Welcome back,</p>
        <h2 className="font-semibold text-slate-900">
          {user?.firstName} {user?.lastName}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={21} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            {user?.firstName?.charAt(0)}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500">{displayRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
