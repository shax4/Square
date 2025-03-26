import { DebateProps } from "../../pages/DebateCardsScreen/DebateCard";

export type AfterVoteButtonViewProps = {
    debate: DebateProps;
    onSelectLeft: () => void;
    onSelectRight: () => void;
};

export type BeforeVoteButtonViewProps = {
    debate: DebateProps;
    onSelectLeft: () => void;
    onSelectRight: () => void;
};
