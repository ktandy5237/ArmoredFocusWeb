import { useState } from "react";
import "./TodaysScrollCard.css";

export default function TodaysScrollCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="todays-scroll-container">
      <div className="scroll-header">
        <div className="scroll-title-group">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="scroll-icon"
          >
            <path
              d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 7H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 3V7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3>Today's Scroll</h3>
        </div>

        <button
          className="scroll-expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "COLLAPSE" : "EXPAND"}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`chevron-icon ${isExpanded ? "open" : ""}`}
          >
            <path
              d="M18 15L12 9L6 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="scroll-body">
        <div className="scroll-content">
          <p className="scroll-empty-text">The scroll is blank...</p>
        </div>

        <div className="scroll-footer-shadow"></div>
      </div>
    </div>
  );
}
