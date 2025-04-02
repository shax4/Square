import React from "react";
import { FlatList, StyleSheet } from "react-native";
import SummaryBox from "./SummaryBox";
import { Summary } from "./Summary.types";

interface Props {
    data: Summary[];
}

const SummaryBoxList = ({ data }: Props) => {
    return (
        <FlatList
            data={data}
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
