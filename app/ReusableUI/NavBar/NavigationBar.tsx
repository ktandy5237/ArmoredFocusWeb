"use client";
import { useRouter, usePathname } from "next/navigation";
import "./NavBar.css";

export enum SelectedTab {
  Hub = "hub",
  Quests = "quests",
  Binder = "binder",
  Rules = "rules",
}

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = (): SelectedTab => {
    if (pathname.includes("/quests")) return SelectedTab.Quests;
    if (pathname.includes("/binder")) return SelectedTab.Binder;
    if (pathname.includes("/rules")) return SelectedTab.Rules;

    return SelectedTab.Hub;
  };

  const activeTab = getActiveTab();

  const getContainerBorder = (): string => {
    switch (activeTab) {
      case SelectedTab.Quests:
        return "var(--questBorder)";
      case SelectedTab.Binder:
        return "var(--binderBorder)";
      case SelectedTab.Rules:
        return "var(--rulesBorder)";
      default:
        return "var(--hubBorder)";
    }
  };

  return (
    <div
      className="nav-container"
      style={{ borderBottomColor: getContainerBorder() }}
    >
      <button
        onClick={() => router.push("/hub")}
        className={activeTab === SelectedTab.Hub ? "nav-button-selected" : ""}
      >
        Hub
      </button>

      <button
        onClick={() => router.push("/quests")}
        className={`quest-nav-button ${
          activeTab === SelectedTab.Quests ? "nav-button-selected" : ""
        }`}
      >
        Quests
      </button>

      <button
        onClick={() => router.push("/binder")}
        className={`binder-nav-button ${
          activeTab === SelectedTab.Binder ? "nav-button-selected" : ""
        }`}
      >
        Binder
      </button>

      <button
        onClick={() => router.push("/rules")}
        className={`rules-nav-button ${
          activeTab === SelectedTab.Rules ? "nav-button-selected" : ""
        }`}
      >
        Rules
      </button>
    </div>
  );
}
