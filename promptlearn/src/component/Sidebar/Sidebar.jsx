import React, { useEffect, useMemo, useState } from "react";

const navItems = [
  { key: "new", label: "New Chat", icon: "📝" },
  { key: "history", label: "History", icon: "🕘" },
  { key: "collections", label: "Collections", icon: "📚" },
  { key: "saved", label: "Saved", icon: "⭐" },
];

const bottomItems = [
  { key: "settings", label: "Settings", icon: "⚙️" },
  { key: "help", label: "Help", icon: "❓" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeKey, setActiveKey] = useState("new"); // simple local active state

  // Persist collapsed state
  useEffect(() => {
    const persisted = localStorage.getItem("sidebar:collapsed");
    if (persisted === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("sidebar:collapsed", String(collapsed));
  }, [collapsed, mounted]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setCollapsed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visibleNav = useMemo(() => navItems, []);
  const visibleBottom = useMemo(() => bottomItems, []);

  const handleSelect = (key) => {
    setActiveKey(key);
    // Optional: emit a custom event for the host app to react to selection
    // window.dispatchEvent(new CustomEvent("sidebar:navigate", { detail: { key } }));
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} aria-label="Primary">
      <div className="sidebar-header">
        <button
          className="collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "›" : "‹"}
        </button>
        {!collapsed && (
          <div className="brand">
            <div className="brand-logo">🤖</div>
            <div className="brand-name">ChatApp</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav" role="navigation">
        <ul>
          {visibleNav.map((item) => (
            <li key={item.key}>
              <button
                className={`nav-link ${activeKey === item.key ? "active" : ""}`}
                onClick={() => handleSelect(item.key)}
              >
                <span className="icon">{item.icon}</span>
                {!collapsed && <span className="label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <ul>
          {visibleBottom.map((item) => (
            <li key={item.key}>
              <button
                className={`nav-link ${activeKey === item.key ? "active" : ""}`}
                onClick={() => handleSelect(item.key)}
              >
                <span className="icon">{item.icon}</span>
                {!collapsed && <span className="label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="user-card" title="Account">
          <div className="avatar">S</div>
          {!collapsed && (
            <div className="user-meta">
              <div className="user-name">SDE1 Builder</div>
              <div className="user-email">dev@example.com</div>
            </div>
          )}
          <button
            className="kebab"
            aria-label="Account menu"
            onClick={() => alert("Open account menu")}
          >
            ⋮
          </button>
        </div>
      </div>
    </aside>
  );
}
