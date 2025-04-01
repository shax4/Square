import { Summary } from "../Components/Summary/Summary.types";
import { Debate } from "../../DebateCardsScreen/DebateCard";

export interface SummariesResponse {
    debate: Debate;
    summaries: Summary[];
}
