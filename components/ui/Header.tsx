"use client";

import { useState, useRef, useEffect } from "react";
import {
  HelpCircle,
  Bell,
  Settings,
  User,
  LogOut,
  Shield,
  ChevronDown,
  Sun,
  Moon,
  LayoutDashboard,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Header = ({
  currentPage = "Dashboard",
  user = { name: "John Doe", email: "john@example.com", avatar: null },
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const { signOut } = useClerk();
  const router = useRouter();

  // Navigation items
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New message received",
      description: "You have a new message from Sarah",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Report generated",
      description: "Your monthly report is ready",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "System update",
      description: "System maintenance scheduled for tonight",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 4,
      title: "New team member",
      description: "Alex joined your team",
      time: "1 day ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header
      className="h-20 px-6 sticky top-0 z-40 flex bg-card items-center"
      style={{
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: "32px",
                height: "32px",
                background: darkMode
                  ? "linear-gradient(135deg, rgb(164, 143, 255) 0%, rgb(121, 134, 203) 100%)"
                  : "linear-gradient(135deg, rgb(110, 86, 207) 0%, rgb(93, 95, 239) 100%)",
              }}
            >
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold">RingoAI</span>
          </div>

          <div
            className="h-6 w-px"
            style={{
              backgroundColor: darkMode
                ? "rgb(48, 48, 82)"
                : "rgb(224, 224, 240)",
            }}
          ></div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.label;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className="flex bg-primary text-black hover:bg-primary/80 items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span
                    className="text-sm font-medium"
                    style={{ letterSpacing: "0em" }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Icons and Dropdowns */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: "transparent",
              color: darkMode ? "rgb(160, 160, 192)" : "rgb(108, 108, 138)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? "rgb(48, 48, 96)"
                : "rgb(240, 240, 250)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Help Icon */}
          <button
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: "transparent",
              color: darkMode ? "rgb(160, 160, 192)" : "rgb(108, 108, 138)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? "rgb(48, 48, 96)"
                : "rgb(240, 240, 250)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: "transparent",
                color: darkMode ? "rgb(160, 160, 192)" : "rgb(108, 108, 138)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode
                  ? "rgb(48, 48, 96)"
                  : "rgb(240, 240, 250)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: "rgb(255, 84, 112)",
                  }}
                ></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-background border">
                <div className="p-4 border-b-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs font-medium to-muted-foreground">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 transition-colors cursor-pointer border-2"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 w-2 h-2 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="text-xs mt-2 text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t-2">
                  <button
                    className="w-full text-center text-sm font-medium transition-colors"
                    style={{
                      color: darkMode
                        ? "rgb(164, 143, 255)"
                        : "rgb(110, 86, 207)",
                    }}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 p-1 rounded-lg transition-colors"
              style={{
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode
                  ? "rgb(48, 48, 96)"
                  : "rgb(240, 240, 250)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: darkMode
                      ? "linear-gradient(135deg, rgb(164, 143, 255) 0%, rgb(121, 134, 203) 100%)"
                      : "linear-gradient(135deg, rgb(110, 86, 207) 0%, rgb(93, 95, 239) 100%)",
                  }}
                >
                  <span className="text-white text-sm font-medium">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              )}
              <ChevronDown
                className="w-4 h-4"
                style={{
                  color: darkMode ? "rgb(160, 160, 192)" : "rgb(108, 108, 138)",
                }}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-lg shadow-xl"
                style={{
                  backgroundColor: darkMode
                    ? "rgb(26, 26, 46)"
                    : "rgb(255, 255, 255)",
                  border: `1px solid ${darkMode ? "rgb(48, 48, 82)" : "rgb(224, 224, 240)"}`,
                  boxShadow: darkMode
                    ? "0px 4px 10px 0px hsl(240 30% 5% / 0.30)"
                    : "0px 4px 10px 0px hsl(240 30% 25% / 0.12)",
                }}
              >
                <div
                  className="p-4"
                  style={{
                    borderBottom: `1px solid ${darkMode ? "rgb(48, 48, 82)" : "rgb(224, 224, 240)"}`,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: darkMode
                            ? "linear-gradient(135deg, rgb(164, 143, 255) 0%, rgb(121, 134, 203) 100%)"
                            : "linear-gradient(135deg, rgb(110, 86, 207) 0%, rgb(93, 95, 239) 100%)",
                        }}
                      >
                        <span className="text-white font-medium">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: darkMode
                            ? "rgb(226, 226, 245)"
                            : "rgb(42, 42, 74)",
                        }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: darkMode
                            ? "rgb(160, 160, 192)"
                            : "rgb(108, 108, 138)",
                        }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors"
                    style={{
                      color: darkMode
                        ? "rgb(226, 226, 245)"
                        : "rgb(42, 42, 74)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode
                        ? "rgb(34, 34, 68)"
                        : "rgb(240, 240, 250)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors"
                    style={{
                      color: darkMode
                        ? "rgb(226, 226, 245)"
                        : "rgb(42, 42, 74)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode
                        ? "rgb(34, 34, 68)"
                        : "rgb(240, 240, 250)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors"
                    style={{
                      color: darkMode
                        ? "rgb(226, 226, 245)"
                        : "rgb(42, 42, 74)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode
                        ? "rgb(34, 34, 68)"
                        : "rgb(240, 240, 250)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Switch Account</span>
                  </button>
                </div>

                <div
                  className="py-1"
                  style={{
                    borderTop: `1px solid ${darkMode ? "rgb(48, 48, 82)" : "rgb(224, 224, 240)"}`,
                  }}
                >
                  <button
                    className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors"
                    style={{
                      color: "rgb(255, 84, 112)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 84, 112, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
