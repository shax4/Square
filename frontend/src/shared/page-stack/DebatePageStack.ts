/**
 * 투표 탭에 쓰이는 페이지 Screen 정의 후 페이지 이동이 필요한 컴포넌트에서 다음 객체를 만들어 페이지 이동
 * 
 * 
 * import { useNavigation } from '@react-navigation/native';
 * const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>(); 
 * ... 
 * navigation.navigate('OpinionListScreen', { debateId });
 */

export type StackParamList = {
    DebateCardsScreen: undefined;
    OpinionListScreen: { 
        debateId: number;
        isDebateModalInitialVisible: boolean 
    };
    OpinionDetailScreen: { opinionId: number };
    ProposalListScreen: undefined;
    ProposalCreateScreen: undefined;
    OpinionEditScreen: {
        opinionId: number;
        content: string;
    };
};
