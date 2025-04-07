import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PopularPostProps {
  item: {
    postId: number;
    title: string;
    likeCount: number;
    commentCount: number;
  };
  onPress: () => void;
}

const PopularPostCard: React.FC<PopularPostProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>
        {item.title}
      </Text>
      <Text style={styles.stats}>
        좋아요 {item.likeCount} • 댓글 {item.commentCount}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    padding: 15,
    marginLeft: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  stats: {
    fontSize: 12,
    color: "#666",
  },
});

export default PopularPostCard;
