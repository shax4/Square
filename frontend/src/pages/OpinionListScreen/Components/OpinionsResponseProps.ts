import { Opinion } from "./OpinionProps";
import { DebateProps } from "../../DebateCardsScreen/DebateCard";

export interface OpinionsResponse {
    debate: DebateProps;
    opinions: Opinion[];

    nextLeftCursorId: number | null;
    nextLeftCursorLikes: number | null;
    nextLeftCursorComments: number | null;

    nextRightCursorId: number | null;
    nextRightCursorLikes: number | null;
    nextRightCursorComments: number | null;
}
