import AuthorizedPage from "../ReusableUI/AuthorizedPage";
import ActiveQuestBoard from "../ReusableUI/Boards/QuestBoard/ActiveQuestBoard";
import StandardButton from "../ReusableUI/Buttons/StandardButton";
import BonusBoardCard from "../ReusableUI/Cards/BonusBoardCard/BonusBoardCard";
import HitRateCard from "../ReusableUI/Cards/HitRateCard/HitRateCard";
import LevelCard from "../ReusableUI/Cards/LevelCard/LevelCard";
import CoinsIcon from "../ReusableUI/Icons/CoinsIcon";
import SIcon from "../ReusableUI/Icons/SIcon";
import StackIcon from "../ReusableUI/Icons/StackIcon";
import "./Hub.css";

export default function Hub() {
  return (
    <AuthorizedPage className="hub-page">
      <div className="hub-container">
        <div className="side-cards">
          <LevelCard
            playerName="Drew Leui"
            level={5}
            currentExp={1250}
            nextLevelExp={2000}
          />
          <StandardButton
            variant="green"
            label="Start Card Quest"
            icon={<CoinsIcon />}
          />
          <StandardButton
            variant="purple"
            label="Start Standalone Quest"
            icon={<SIcon />}
          />
          <StandardButton
            variant="gold"
            label="Draw New Card"
            icon={<StackIcon />}
          />
          <HitRateCard />
          <BonusBoardCard />
        </div>
        <ActiveQuestBoard />
      </div>
    </AuthorizedPage>
  );
}
