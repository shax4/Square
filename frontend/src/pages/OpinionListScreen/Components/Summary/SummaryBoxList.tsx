import React from "react";
import { FlatList, StyleSheet } from "react-native";
import SummaryBox from "./SummaryBox";
import { Summary } from "./Summary.types";

interface Props {
    data: Summary[];
}

const SummaryBoxList = ({ data }: Props) => {

    // 좌 우 의견 순서 조정
    const pivot = data.length / 2;
    const separatedDatas: Summary[] = [];

    for(let i = 0; i < pivot; i++){ 
        separatedDatas.push(data[i]);
        separatedDatas.push(data[pivot + i]);
    }

    return (
        <FlatList
            data={separatedDatas }
            keyExtractor={(item) => item.summaryId.toString()}
            renderItem={({ item }) => <SummaryBox summary={item} />}
            contentContainerStyle={styles.listContainer}
            onEndReachedThreshold={0.5}
        />
    );
};

export default SummaryBoxList;

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});
