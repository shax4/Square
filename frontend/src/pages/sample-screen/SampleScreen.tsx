import { useEffect, useState } from "react";
import {View, Text, StyleSheet} from "react-native";
import { fetchHomeData } from "./Api";

export default function SampleScreen() {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchHomeData();
                setData(result.message);
            } catch (error) {
                setData("데이터 로딩 실패");
            }
        }

        loadData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{data ?? "데이터를 로딩 중입니다."}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "teal",
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
});