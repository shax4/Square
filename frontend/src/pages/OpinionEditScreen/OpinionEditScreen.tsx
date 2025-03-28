import { RouteProp, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import { useLayoutEffect, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "../../../assets/colors";

type Props = {
    route: RouteProp<StackParamList, 'OpinionEditScreen'>;
};

export default function OpinionEditScreen({ route }: Props) {

    const { opinionId } = route.params;
    const submitRef = useRef<() => void>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    // 수정 요청 함수
    const handleSubmit = () => {
        console.log('서버로 의견 수정 요청:', opinionId);
        // 요청 보내고 성공하면 이전 화면으로 이동
        navigation.goBack();
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

        <Text>edit</Text>
    )
}

export const styles = StyleSheet.create({
    EditButton: {
        
    },
    EditButtonText: {
        color: colors.primary,
        fontSize: 16,
    }
})