import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, History, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

export function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: "/history", label: "Meeting History", icon: <History className="w-4 h-4" /> },
    { to: "/analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Meeting<span className="text-blue-600">2</span>Tasks
              </span>
            </Link>
            
            <div className="hidden md:flex md:ml-10 md:space-x-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg absolute w-full">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/dashboard"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
