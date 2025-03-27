// 전체 응답 인터페이스 (debates 배열 + nextCursorId 포함)
import { Debate } from "./Debate.types";

export interface DebatesResponse {
    debates: Debate[];
    nextCursorId: number;
}