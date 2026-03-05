"use client";
import AuthorizedPage from "../ReusableUI/AuthorizedPage";
import { StandardCard } from "../ReusableUI/Cards/StandardCard/StandardCard";
import SearchBar from "../ReusableUI/SearchBar/SearchBar";
import "./Binder.css";

export default function Binder() {
  const cards = Array(8).fill(null);

  return (
    <AuthorizedPage className="binder-page">
      <StandardCard className="binder-card-color">
        <div className="binder-header">
          <div className="binder-title-section">
            <h1 className="binder-main-title">The Binder</h1>
            <p className="binder-subtitle">Repository of Known Associates</p>
          </div>
          <SearchBar bgColor="#fee2e2" textColor="#991b1b" />
        </div>
        <div className="card-grid">
          {cards.map((_, index) => (
            <div key={index} className="binder-slot">
              <div className="card-content-placeholder"></div>
            </div>
          ))}
        </div>
      </StandardCard>
    </AuthorizedPage>
  );
}
