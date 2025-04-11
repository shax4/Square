export interface DebateResultData {
    leftResult: DebateResultGroup;
    rightResult: DebateResultGroup;
}

interface DebateResultGroup {
    gender: Record<string, number>;
    ageRange: Record<string, number>;
    userType: Record<string, number>;
    region: Record<string, number>;
    religion: Record<string, number>;
}
