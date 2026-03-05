import "./HitRateCard.css";
import { StandardCard } from "../StandardCard/StandardCard";

export default function HitRateCard() {
  return (
    <div className="hit-rate-card-container">
      <StandardCard>
        <div className="card-header">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="header-icon"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
              fill="currentColor"
            />
          </svg>
          <h1>PER HIT RATE</h1>
        </div>

        <div className="rate-container">
          <p className="rate-label">Targeted</p>
          <p className="rate-number value-targeted">$0</p>
        </div>

        <div className="rate-container">
          <p className="rate-label">Idle</p>
          <p className="rate-number value-idle">$0</p>
        </div>
      </StandardCard>
    </div>
  );
}
