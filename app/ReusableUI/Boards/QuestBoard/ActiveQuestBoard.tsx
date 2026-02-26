import React from "react";
import "./ActiveQuestBoard.css";

export default function ActiveQuestBoard({
  borderColor = "var(--hubBorder)",
  themeColor = "var(--accentCyan)",
}) {
  const today = "02/11/2026";

  const customStyles = {
    "--board-border": borderColor,
    "--board-theme": themeColor,
  } as React.CSSProperties;

  return (
    <div className="quest-board-container" style={customStyles}>
      <div className="quest-header">
        <div className="header-left">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="quest-icon"
          >
            <path
              d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 9H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 21V9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2>Active Quests</h2>
        </div>

        <div className="date-badge">{today}</div>
      </div>

      <div className="quest-empty-state">
        <h3 className="empty-title">The Quest Board is Empty</h3>
        <p className="empty-subtitle">
          Your adventure awaits! Start a new quest or draw a new card to get
          started.
        </p>
      </div>
    </div>
  );
}
