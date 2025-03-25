import { View, Text, StyleSheet } from "react-native";

interface Props {
    activeTab: string;
    activePostSection: string;
    activeVoteSection: string;
}

const MypageContent = ({ activeTab, activePostSection, activeVoteSection}: Props) => {
    const renderContent = () => {
        if (activeTab === "게시글") {
          switch (activePostSection) {
            case "작성글":
              return (
                <View style={styles.contentContainer}>
                  <Text style={styles.placeholderText}>작성글 내용</Text>
                </View>
              )
            case "댓글":
              return (
                <View style={styles.contentContainer}>
                  <Text style={styles.placeholderText}>댓글 내용이 여기에 표시됩니다.</Text>
                </View>
              )
            case "스크랩":
              return (
                <View style={styles.contentContainer}>
                  <Text style={styles.placeholderText}>스크랩 내용이 여기에 표시됩니다.</Text>
                </View>
              )
            case "좋아요":
              return (
                <View style={styles.contentContainer}>
                  <Text style={styles.placeholderText}>좋아요 내용이 여기에 표시됩니다.</Text>
                </View>
              )
            default:
              return null
          }
        } else {
          switch (activeVoteSection) {
            case "내가 한 투표":
              return (
                <View style={styles.contentContainer}>
                  <Text style={styles.placeholderText}>내가 한 투표 내용이 여기에 표시됩니다.</Text>
                </View>
              )
            case "의견":
              return (
                <View style={styles.contentContainer}>
                  <Text style={styles.placeholderText}>의견 내용</Text>
                </View>
              )
            case "스크랩":
              return (
                <View style={styles.contentContainer}>
                  <Text style={styles.placeholderText}>투표 스크랩 내용이 여기에 표시됩니다.</Text>
                </View>
              )
            default:
              return null
          }
        }
    }

    return renderContent();
}

const styles = StyleSheet.create({
    contentContainer: { padding: 16, minHeight: 300 },
    placeholderText: { textAlign: "center", color: "#888888", marginTop: 40 },
});

export default MypageContent;