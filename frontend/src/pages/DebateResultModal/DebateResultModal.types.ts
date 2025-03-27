export interface DebateResultModalProps {
    visible: boolean;
    onClose: () => void;
    onPressMoreOpinion: () => void;
    leftOption : string,
    rightOption: string,
    data: {
      leftResult: {
        gender: { value: number; label: string }[];
        age: { value: number; label: string }[];
        type: { value: number; label: string }[];
        region: { value: number; label: string }[];
        religion: { value: number; label: string }[];
        userInfo: {
          ageGroup: string;
          religionGroup: string;
        };
      };
      rightResult: {
        gender: { value: number; label: string }[];
        age: { value: number; label: string }[];
        type: { value: number; label: string }[];
        region: { value: number; label: string }[];
        religion: { value: number; label: string }[];
        userInfo: {
          ageGroup: string;
          religionGroup: string;
        };
      };
    };
  }
  