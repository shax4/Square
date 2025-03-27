import { Opinion } from "./OpinionProps";
import { Debate } from "../../../DebateCardsScreen/DebateCard";

export interface OpinionsResponse {
    debate: Debate;
    opinions: Opinion[];

    nextLeftCursorId: number | null;
    nextLeftCursorLikes: number | null;
    nextLeftCursorComments: number | null;

    nextRightCursorId: number | null;
    nextRightCursorLikes: number | null;
    nextRightCursorComments: number | null;
}
