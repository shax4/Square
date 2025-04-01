import { Opinion } from "../Components/Opinion/Opinion.types";
import { Debate } from "../../DebateCardsScreen/DebateCard";

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
