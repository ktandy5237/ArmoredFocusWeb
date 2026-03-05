import PencilIcon from "../../Icons/PencilIcon";
import { StandardCard } from "../StandardCard/StandardCard";
import "./LevelCard.css";

interface LevelCardProps {
  playerName: string;
  level: number;
  currentExp: number;
  nextLevelExp: number;
  onEdit?: () => void;
}

export default function LevelCard({
  playerName,
  level,
  currentExp,
  nextLevelExp,
  onEdit,
}: LevelCardProps) {
  const progressPercentage = Math.min(
    100,
    Math.max(0, (currentExp / nextLevelExp) * 100),
  );

  const remainingExp = nextLevelExp - currentExp;

  return (
    <StandardCard className="level-card-wrapper">
      <div className="level-header">
        <div className="level-box">
          <h3 className="level-label">LEVEL</h3>
          <h3 className="level-number">{level}</h3>
        </div>

        <div className="player-name">
          <h1>{playerName}</h1>
          <div
            onClick={onEdit}
            style={{ cursor: onEdit ? "pointer" : "default", display: "flex" }}
          >
            <PencilIcon color="var(--hubBorder)" />
          </div>
        </div>
      </div>

      <div className="level-divider"></div>

      <div className="level-stats">
        <div className="xp-labels">
          <p>{currentExp} EXP</p>
          <p>{nextLevelExp}</p>
        </div>

        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <p className="xp-footer-text">{remainingExp} Exp UNTIL LEVEL UP</p>
      </div>
    </StandardCard>
  );
}
