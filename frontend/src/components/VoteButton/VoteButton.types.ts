import { DebateProps } from "../DebateCard";

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
