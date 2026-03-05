import "./BonusBoardCard.css";
import { StandardCard } from "../StandardCard/StandardCard";

export default function BonusBoardCard() {
  const progress = 2;
  const total = 5;
  const percentage = (progress / total) * 100;

  return (
    <div className="bonus-board-card-container">
      <StandardCard>
        <div className="card-header">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="header-icon-gold"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1>BONUS BOARD</h1>
        </div>

        <div className="bonus-task-card">
          <h3 className="task-title">Plan Day 5 Days Straight</h3>

          <div className="progress-row">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {progress}/{total}
            </span>
          </div>
        </div>
      </StandardCard>
    </div>
  );
}
