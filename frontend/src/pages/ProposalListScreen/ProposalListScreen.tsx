import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ListRenderItem } from "react-native";
import colors from "../../../assets/colors";
import { Button } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import { Proposal } from "./Components/ProposalProps";
import { proposals as allProposals } from "./Components/proposal-test-data";
import ProposalItem from './Components/ProposalItem'
const PAGE_SIZE = 3;

export default function ProposalListScreen() {
    const [sortOption, setSortOption] = useState<"latest" | "popular">("latest");
    const [currentPage, setCurrentPage] = useState(1);
    const [renderedProposals, setRenderedProposals] = useState<Proposal[]>([]);

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    useEffect(() => {
        // 서버에서 정렬된 데이터를 제공한다고 가정하고, 현재 정렬 기준에 해당하는 데이터라고 가정
        setCurrentPage(1);
        const initialPage = allProposals.slice(0, PAGE_SIZE);
        setRenderedProposals(initialPage);
    }, [sortOption]);

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        const nextData = allProposals.slice(0, nextPage * PAGE_SIZE);
        console.log(nextData.length)
        if (nextData.length > renderedProposals.length) {
            setRenderedProposals(nextData);
            setCurrentPage(nextPage);
        }
    };

    return (
        <View style={styles.Container}>
            {/* 정렬 버튼 */}
            <View style={styles.SortingTypeButtonView}>
                <TouchableOpacity
                    style={[styles.SortingTypeButton, sortOption === "latest" && styles.activeButton,]}
                    onPress={() => setSortOption("latest")}
                >
                    <Text style={[styles.SortingTypeButtonText, sortOption === "latest" && styles.activeText,]} >
                        최신순
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.SortingTypeButton, sortOption === "popular" && styles.activeButton,]}
                    onPress={() => setSortOption("popular")}
                >
                    <Text style={[styles.SortingTypeButtonText, sortOption === "popular" && styles.activeText,]} >
                        인기순
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 리스트 */}
            <View style={styles.ProposalListView}>
                <FlatList
                    data={renderedProposals}
                    renderItem={(nextData) => <ProposalItem{...nextData} />}
                    keyExtractor={(item) => item.proposalId.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.2}
                />
            </View>

            {/* 버튼 */}
            <View style={styles.ProposalButtonView}>
                <Button
                    label="새로운 주제 작성하기"
                    onPress={() => navigation.navigate("ProposalCreateScreen")}
                />
            </View>
            <View style={styles.BottomPadding} />
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    SortingTypeButtonView: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    SortingTypeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 6,
        borderRadius: 20,
        backgroundColor: "#eee",
    },
    SortingTypeButtonText: {
        color: colors.placeholderText,
        fontWeight: "500",
    },
    activeButton: {
        backgroundColor: colors.disabledText,
    },
    activeText: {
        color: "white",
        fontWeight: "bold",
    },
    ProposalListView: {
        flex: 8,
        paddingHorizontal: 20,
        marginTop: 50,
    },
    ProposalButtonView: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
    },
    BottomPadding: {
        flex: 1,
    },
});
