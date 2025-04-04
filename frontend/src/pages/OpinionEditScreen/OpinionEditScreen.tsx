import { RouteProp, useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import { useLayoutEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "../../../assets/colors";
import { updateOpinion } from "../OpinionListScreen/api/OpinionApi";

type Props = {
    route: RouteProp<StackParamList, 'OpinionEditScreen'>;
};

export default function OpinionEditScreen({ route }: Props) {

    // 수정할 의견 id, 초기 컨텐츠를 받아옴
    const { opinionId, content: initialContent } = route.params;

    const submitRef = useRef<() => void>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    const [content, setContent] = useState(initialContent);

    // 수정 요청 함수
    const handleSubmit = () => {
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
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert(
                                "문제 발생",
                                "의견 수정에 실패했습니다. 다시 시도해주세요.",
                                [
                                    {
                                        text: "확인",
                                        onPress: () => navigation.goBack(),
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

            </View>

            <View>
                {/* 내용 입력 영역 */}
                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.contentInput}
                        placeholder="내용을 입력하세요"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top" // 안드로이드에서 텍스트가 상단부터 시작하도록 설정
                    />
                </View>
            </View>

        </View>
    )
}

export const styles = StyleSheet.create({
    EditButton: {

    },
    EditButtonText: {
        color: colors.primary,
        fontSize: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    contentInput: {
        margin: 15,
        padding: 10,
        fontSize: 16,
        minHeight: 400, // 내용 입력 필드 최소 높이
    },
});
