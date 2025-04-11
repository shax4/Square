/**
 * 투표 탭에 쓰이는 페이지 Screen 정의 후 페이지 이동이 필요한 컴포넌트에서 다음 객체를 만들어 페이지 이동
 * 
 * 
 * import { useNavigation } from '@react-navigation/native';
 * const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>(); 
 * ... 
 * navigation.navigate('OpinionListScreen', { debateId });
 */

import { Debate } from "../../pages/DebateCardsScreen/Components";
import { Proposal } from "../../pages/ProposalListScreen/Type/proposalListType";

export type DebateStackParamList = {
    DebateCardsScreen: undefined;
    OpinionListScreen: {
        debateId: number;
        showVoteResultModal?: boolean;
        showSummaryFirst?: boolean;
    };
    OpinionDetailScreen: {
        debateId: number;
        opinionId: number;
    };
    ProposalListScreen: undefined;
    ProposalCreateScreen: undefined;
    OpinionEditScreen: {
        debateId: number;
        opinionId: number;
        content: string;
    };
    PersonalityResultScreen: { nickname: string };
    PersonalitySurveyPage: undefined;
    ProposalEditScreen : {
        proposal: Proposal;
    }
};
