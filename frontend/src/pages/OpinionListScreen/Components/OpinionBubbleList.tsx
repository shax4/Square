import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { OpinionsResponse } from "./OpinionsResponseProps";
import OpinionBubble from "./OpinionBubble";

interface Props {
    data: OpinionsResponse;
    onEndReached?: () => void;
}

const OpinionBubbleList = ({ data, onEndReached }: Props) => {
    return (
        <FlatList
            data={data.opinions}
            keyExtractor={(item) => item.opinionId.toString()}
            renderItem={({ item }) => <OpinionBubble opinion={item} />}
            contentContainerStyle={styles.listContainer}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
        />
    );
};

export default OpinionBubbleList;

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});
