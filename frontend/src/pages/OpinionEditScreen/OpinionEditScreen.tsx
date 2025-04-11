import { RouteProp, useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DebateStackParamList } from "../../shared/page-stack/DebatePageStack";
import { useLayoutEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "../../../assets/colors";
import { updateOpinion } from "../OpinionListScreen/api/OpinionApi";

type Props = {
    route: RouteProp<DebateStackParamList, 'OpinionEditScreen'>;
};

export default function OpinionEditScreen({ route }: Props) {

    // 수정할 의견 id, 초기 컨텐츠를 받아옴
    const { debateId, opinionId, content: initialContent } = route.params;
    const [showWarning, setShowWarning] = useState(false);

    const submitRef = useRef<() => void>();
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();

    const [content, setContent] = useState(initialContent);

    const returnOpinionListPage = () => {
        navigation.pop(2); // 현재 화면에서 2단계 뒤로
        navigation.navigate('OpinionDetailScreen', {
            debateId,
            opinionId,
        });
    }

    // 수정 요청 함수
    const handleSubmit = () => {
        const trimmedContent = content.trim();
        const isInvalid = trimmedContent.length < 10 || trimmedContent.length > 150;

        if (isInvalid) {
            setShowWarning(true);
            return;
        }

        setShowWarning(false);

        Alert.alert(
            "수정 확인",
            "정말로 이 의견을 수정하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                },
                {
                    text: "확인",
                    onPress: async () => {
                        try {
                            await updateOpinion(opinionId, content);
                            returnOpinionListPage()
                        } catch (error) {
                            Alert.alert(
                                "문제 발생",
                                "의견 수정에 실패했습니다. 다시 시도해주세요.",
                                [
                                    {
                                        text: "확인",
                                        onPress: () => returnOpinionListPage(),
                                    },
                                ]
                            );
                        }
                    },
                },
            ]
        );
    };


    // 이 submit 함수 자체를 외부에서 호출할 수 있게 ref에 저장
    submitRef.current = handleSubmit;

    // 헤더에 수정 버튼 설정 (최초 마운트 시 한 번만)
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.EditButton}
                    onPress={() => {
                        if (submitRef.current) {
                            submitRef.current();
                        }
                    }}
                >
                    <Text style={styles.EditButtonText}>수정</Text>
                </TouchableOpacity>
            ),
        });
    }, []);


    return (
        <View>
            <View>
                {/* 내용 입력 영역 */}
                <View>
                    <TextInput
                        style={styles.contentInput}
                        placeholder="내용을 입력하세요"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top" // 안드로이드에서 텍스트가 상단부터 시작하도록 설정
                    />
                </View>
                {showWarning && (
                    <Text style={styles.WarningText}>
                        의견은 최소 10자 이상, 최대 150자 이하이어야 합니다.
                    </Text>
                )}
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    TextEditArea: {
        backgroundColor: colors.white,
    },
    EditButton: {

    },
    EditButtonText: {
        color: colors.primary,
        fontSize: 16,
    },
    contentInput: {
        margin: 15,
        padding: 10,
        fontSize: 16,
        minHeight: 200, // 내용 입력 필드 최소 높이
        borderRadius: 15,
        backgroundColor: colors.white,
    },
    WarningText: {
        margin: 15,
        color: colors.warnRed,
    }
});
