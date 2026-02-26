"use client";
import "./Quests.css";
import { CoinsIcon } from "lucide-react";
import AuthorizedPage from "../ReusableUI/AuthorizedPage";
import StandardButton from "../ReusableUI/Buttons/StandardButton";
import SIcon from "../ReusableUI/Icons/SIcon";
import StackIcon from "../ReusableUI/Icons/StackIcon";
import ActiveQuestBoard from "../ReusableUI/Boards/QuestBoard/ActiveQuestBoard";
import SearchBar from "../ReusableUI/SearchBar/SearchBar";
import TodaysScrollCard from "../ReusableUI/Cards/TodaysScrollCard/TodaysScrollCard";

export default function Quests() {
  return (
    <AuthorizedPage className="quests-page">
      <div className="quests-container">
        <div className="side-cards">
          <SearchBar
            placeholder="Search Quests..."
            onSearch={(searchQuery: string) => {
              console.log("Search Query:", searchQuery);
            }}
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
          <TodaysScrollCard />
        </div>
        <ActiveQuestBoard borderColor="#6abfa3" themeColor="#34d399" />
      </div>
    </AuthorizedPage>
  );
}
