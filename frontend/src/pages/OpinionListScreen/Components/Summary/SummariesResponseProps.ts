import { Summary } from "./SummaryProps";
import { DebateProps } from "../../../DebateCardsScreen/DebateCard";

export interface SummariesResponse {
    debate: DebateProps;
    summaries: Summary[];
}
