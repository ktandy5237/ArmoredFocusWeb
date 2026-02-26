import AuthorizedPage from "../ReusableUI/AuthorizedPage";
import { StandardCard } from "../ReusableUI/Cards/StandardCard/StandardCard";
import "./Rules.css";

export default function Rules() {
  return (
    <AuthorizedPage className="rules-page">
      <StandardCard className="rules-card-color ">Rules</StandardCard>
    </AuthorizedPage>
  );
}
