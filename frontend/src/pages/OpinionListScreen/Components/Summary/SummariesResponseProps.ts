import { Summary } from "./SummaryProps";
import { Debate } from "../../../DebateCardsScreen/DebateCard";

export interface SummariesResponse {
    debate: Debate;
    summaries: Summary[];
}
