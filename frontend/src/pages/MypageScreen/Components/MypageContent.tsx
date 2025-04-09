import { View, StyleSheet } from "react-native";
import PostList from "./PostList";
import CommentList from "./CommentList";
import VotingList from "./VotingList";
import OpinionList from "./OpinionList";

interface Props {
  activeTab: string;
  activePostSection: string;
  activeVoteSection: string;
  refreshTrigger?: number;
}

const MypageContent = ({
  activeTab,
  activePostSection,
  activeVoteSection,
  refreshTrigger = 0,
}: Props) => {
  const renderContent = () => {
    if (activeTab === "게시글") {
      switch (activePostSection) {
        case "작성글":
          return (
            <View style={styles.contentContainer}>
              <PostList type="작성글" refreshTrigger={refreshTrigger} />
            </View>
          );
        case "댓글":
          return (
            <View style={styles.contentContainer}>
              <CommentList refreshTrigger={refreshTrigger} />
            </View>
          );
        case "스크랩":
          return (
            <View style={styles.contentContainer}>
              <PostList type="스크랩" refreshTrigger={refreshTrigger} />
            </View>
          );
        case "좋아요":
          return (
            <View style={styles.contentContainer}>
              <PostList type="좋아요" refreshTrigger={refreshTrigger} />
            </View>
          );
        default:
          return null;
      }
    } else {
      switch (activeVoteSection) {
        case "내가 한 투표":
          return (
            <View style={styles.contentContainer}>
              <VotingList type="my-votes" />
            </View>
          );
        case "의견":
          return (
            <View style={styles.contentContainer}>
              <OpinionList />
            </View>
          );
        case "스크랩":
          return (
            <View style={styles.contentContainer}>
              <VotingList type="my-scrap" />
            </View>
          );
        default:
          return null;
      }
    }
  };

  return renderContent();
};

const styles = StyleSheet.create({
  contentContainer: { flex: 1, padding: 8, minHeight: 300 },
  placeholderText: { textAlign: "center", color: "#888888", marginTop: 40 },
  listContent: {
    padding: 16,
  },
});

export default MypageContent;
