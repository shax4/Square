import { DebateResultData } from "./DebateResultData.types";

export interface DebateResultModalProps {
  visible: boolean;
  onClose: () => void;
  onPressMoreOpinion: () => void;
  leftOption: string,
  rightOption: string,
  data: DebateResultData,
}
