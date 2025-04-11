import { create } from 'zustand';
import { Debate } from '../../pages/DebateCardsScreen/Components';
import { computeDebateFields } from '../../pages/DebateCardsScreen/Components/Debate.types';

interface DebateState {
    debates: Debate[];
    setDebates: (list: Debate[]) => void;
    addDebates: (list: Debate[]) => void;
    updateDebate: (id: number, updated: Partial<Debate>) => void;
    clearDebates: () => void;
}

export const useDebateStore = create<DebateState>((set) => ({
    debates: [],

    // 새로 전체 덮어쓰기 (필드 계산 포함)
    setDebates: (list) => {
        const computedList = list.map(computeDebateFields);
        set({ debates: computedList });
    },

    // 페이징 추가 (중복 제거 및 필드 계산 포함)
    addDebates: (list) =>
        set((state) => {
            const existingIds = new Set(state.debates.map((d) => d.debateId));
            const filteredNew = list
                .filter((d) => !existingIds.has(d.debateId))
                .map(computeDebateFields);
            return { debates: [...state.debates, ...filteredNew] };
        }),

    // 특정 debate 업데이트 (필드 재계산 포함)
    updateDebate: (id, updated) =>
        set((state) => ({
            debates: state.debates.map((debate) =>
                debate.debateId === id
                    ? computeDebateFields({ ...debate, ...updated })
                    : debate
            ),
        })),

    clearDebates: () => set({ debates: [] }),
}));
