import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, ListRenderItem, ActivityIndicator } from "react-native";
import colors from "../../../assets/colors";
import { Button } from "../../components";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import { Proposal } from "./Components/ProposalProps";
import ProposalItem from './Components/ProposalItem'
import { getAllProposals } from "./Api/proposalListAPI";
import { ProposalResponse } from "./Type/proposalListType";
import Text from '../../components/Common/Text';

const PAGE_SIZE = 15;

export default function ProposalListScreen() {
    const [sortOption, setSortOption] = useState<"latest" | "likes">("latest");
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [nextCursorLikes, setNextCursorLikes] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [renderedProposals, setRenderedProposals] = useState<Proposal[]>([]);
    
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    const fetchProposals = async (cursorId: number | null, cursorLikes: number | null) => {
        if (loading) return;

        setLoading(true);
        try {
            const data: ProposalResponse = await getAllProposals(sortOption, cursorId, cursorLikes, PAGE_SIZE);

            if (cursorId === null && cursorLikes === null && data.proposals.length === 0) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }

            setRenderedProposals((prev) => (cursorId === null ? data.proposals : [...prev, ...data.proposals]));
            setNextCursorId(data.nextCursorId || null);
            setNextCursorLikes(data.nextCursorLikes || null);
        } catch (error) {
            console.error("fetchProposals 에러 발생", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ goBack() 후 화면이 다시 포커스될 때 자동 새로고침
    useFocusEffect(
        useCallback(() => {
            setRenderedProposals([]);
            setNextCursorId(null);
            setNextCursorLikes(null);
            fetchProposals(null, null);
        }, [sortOption])
    );

    const loadMore = useCallback(() => {
        if (nextCursorId && nextCursorLikes && !loading) {
            fetchProposals(nextCursorId, nextCursorLikes);
        }
    }, [nextCursorId, nextCursorLikes, loading]);

    return (
        <View style={styles.Container}>
            {/* 정렬 버튼 */}
            <View style={styles.SortingTypeButtonView}>
                <TouchableOpacity
                    style={[styles.SortingTypeButton, sortOption === "latest" && styles.activeButton]}
                    onPress={() => setSortOption("latest")}
                >
                    <Text weight="medium" style={[styles.SortingTypeButtonText, sortOption === "latest" && styles.activeText]}>
                        최신순
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.SortingTypeButton, sortOption === "likes" && styles.activeButton]}
                    onPress={() => setSortOption("likes")}
                >
                    <Text weight="medium" style={[styles.SortingTypeButtonText, sortOption === "likes" && styles.activeText]}>
                        인기순
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 리스트 */}
            <View style={styles.ProposalListView}>
                <FlatList
                    data={renderedProposals}
                    renderItem={(nextData) => <ProposalItem {...nextData} />}
                    keyExtractor={(item) => item.proposalId.toString()}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
                    ListEmptyComponent={
                        isEmpty ? (
                            <View style={styles.emptyContainer}>
                                <Text weight="medium" style={styles.emptyText}>청원된 주제가 없습니다.</Text>
                            </View>
                        ) : null
                    }
                />
            </View>

            {/* 버튼 */}
            <View style={styles.ProposalButtonView}>
                <Button label="새로운 주제 작성하기" onPress={() => navigation.navigate("ProposalCreateScreen")} />
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
        marginTop: 20,
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
    },
    activeButton: {
        backgroundColor: colors.disabledText,
    },
    activeText: {
        color: "white",
        fontWeight: "700",
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
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "gray",
    },
});
