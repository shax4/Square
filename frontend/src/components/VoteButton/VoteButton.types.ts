import { Debate } from "../../pages/DebateCardsScreen/Components";

export type AfterVoteButtonViewProps = {
    debate: Debate;
    onSelectLeft: () => void;
    onSelectRight: () => void;
};

export type BeforeVoteButtonViewProps = {
    debate: Debate;
    onSelectLeft: () => void;
    onSelectRight: () => void;
};
