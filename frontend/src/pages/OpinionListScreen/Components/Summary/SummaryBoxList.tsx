import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { SummariesResponse } from "./SummariesResponseProps";
import SummaryBox from "./SummaryBox";

interface Props {
    data: SummariesResponse;
    onEndReached?: () => void;
}

const OpinionBoxList = ({ data, onEndReached }: Props) => {
    return (
        <FlatList
            data={data.summaries}
            keyExtractor={(item) => item.summaryId.toString()}
            renderItem={({ item }) => <SummaryBox summary={item} />}
            contentContainerStyle={styles.listContainer}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
        />
    );
};

export default OpinionBoxList;

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});
