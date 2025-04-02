import { Summary } from "../Components/Summary/Summary.types";
import { Debate } from "../../DebateCardsScreen/Components";

export interface SummariesResponse {
    debate: Debate;
    summaries: Summary[];
}
