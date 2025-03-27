import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { OpinionsResponse } from "./OpinionsResponseProps";
import OpinionBox from "./OpinionBox";

interface Props {
    data: OpinionsResponse;
    onEndReached?: () => void;
}

const OpinionBoxList = ({ data, onEndReached }: Props) => {
    return (
        <FlatList
            data={data.opinions}
            keyExtractor={(item) => item.opinionId.toString()}
            renderItem={({ item }) => <OpinionBox opinion={item} />}
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
