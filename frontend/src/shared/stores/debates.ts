import { create } from 'zustand';
import { Debate } from '../../pages/DebateCardsScreen/Components';

interface DebateState {
    debates: Debate[];
    setDebates: (list: Debate[]) => void;
    addDebates: (list: Debate[]) => void;
    updateDebate: (id: number, updated: Partial<Debate>) => void;
    clearDebates: () => void;
}

export const useDebateStore = create<DebateState>((set) => ({
    debates: [],

    // 새로 전체 덮어쓰기
    setDebates: (list) => set({ debates: list }),

    // 페이징 추가
    addDebates: (list) =>
        set((state) => {
            const existingIds = new Set(state.debates.map((d) => d.debateId));
            const filteredNew = list.filter((d) => !existingIds.has(d.debateId));
            return { debates: [...state.debates, ...filteredNew] };
        }),

    // 특정 debate 업데이트 (투표, 북마크 등)
    updateDebate: (id, updated) =>
        set((state) => ({
            debates: state.debates.map((debate) =>
                debate.debateId === id ? { ...debate, ...updated } : debate
            ),
        })),

    clearDebates: () => set({ debates: [] }),
}));
