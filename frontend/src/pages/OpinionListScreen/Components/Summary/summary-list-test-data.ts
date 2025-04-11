import { SummariesResponse } from "../../api/SummariesResponse.types";
import { debateData } from '../../../DebateCardsScreen/Components';

export const SummariesResponse1: SummariesResponse = {
    debate: debateData[0],
    summaries: [
        {
            summaryId: 1,
            content: "강아지에 대한 AI 요약",
            isLeft: true,
        },
        {
            summaryId: 2,
            content: "고양이에 대한 AI 요약",
            isLeft: false,
        },
        {
            summaryId: 3,
            content: "강아지에 대한 AI 요약",
            isLeft: true,
        },
        {
            summaryId: 4,
            content: "고양이에 대한 AI 요약",
            isLeft: false,
        },
    ]
}