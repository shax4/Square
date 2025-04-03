import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ListRenderItem } from "react-native";
import colors from "../../../assets/colors";
import { Button } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import { Proposal } from "./Components/ProposalProps";
import ProposalItem from './Components/ProposalItem'
import { getAllProposals } from "./Api/proposalListAPI";
import { ProposalResponse } from "./Type/proposalListType";
const PAGE_SIZE = 10;

export default function ProposalListScreen() {
    const [sortOption, setSortOption] = useState<"latest" | "popular">("latest");
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [nextCursorLikes, setNextCursorLikes] = useState<number | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [renderedProposals, setRenderedProposals] = useState<Proposal[]>([]);

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();


    const fetchProposals = async (cursorId : number, cursorLikes : number) => {
        if(loading) return;

        setLoading(true);
        try{
            const data : ProposalResponse = await getAllProposals(sortOption, cursorId, cursorLikes, PAGE_SIZE)

            if(cursorId === null && cursorLikes === null && data.proposals.length === 0){
                setIsEmpty(true);
            }else{
                setIsEmpty(false);
            }

            setRenderedProposals((prev) => [...prev, ...data.proposals])
            setNextCursorId(data.nextCursorId || null)
            setNextCursorLikes(data.nextCursorLikes || null)
        }catch(error){
            console.error("fetchProposals 에러 발생", error)
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        const getInitialProposals = async () => {
            try{
                const data : ProposalResponse = await getAllProposals(sortOption, null, null, PAGE_SIZE);
                const initialPage = data.proposals;
                setRenderedProposals(initialPage);
            }catch(error){
                console.error("초기 주제 리스트 불러오기 에러 : ", error);
            }
        }

        getInitialProposals();
        // 서버에서 정렬된 데이터를 제공한다고 가정하고, 현재 정렬 기준에 해당하는 데이터라고 가정
        // setCurrentPage(1);
        // const initialPage = allProposals.slice(0, PAGE_SIZE);
        // setRenderedProposals(initialPage);
    }, [sortOption]);

    const handleLoadMore = () => {
        // const nextPage = currentPage + 1;
        // const nextData = allProposals.slice(0, nextPage * PAGE_SIZE);
        // console.log(nextData.length)
        // if (nextData.length > renderedProposals.length) {
        //     setRenderedProposals(nextData);
        //     setCurrentPage(nextPage);
        // }
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
