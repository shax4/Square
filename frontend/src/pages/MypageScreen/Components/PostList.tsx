import { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  RefreshControl,
} from "react-native";
import PostCard from "./PostCard";
import { getMypagePosts } from "../Api/postAPI";
import { Post as MypagePost, PostResponse } from "../Type/mypagePost";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../../shared/page-stack/MyPageStack";
import Text from "../../../components/Common/Text";
import { useLikeStore, LikeState } from "../../../shared/stores/LikeStore";

interface Props {
  type: "작성글" | "스크랩" | "좋아요";
  refreshTrigger?: number;
}

const API_URLS = {
  작성글: "my",
  스크랩: "my-scraps",
  좋아요: "my-likes",
};

const PostList = ({ type, refreshTrigger = 0 }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const [posts, setPosts] = useState<MypagePost[]>([]);
  const [nextCursorId, setNextCursorId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const initializeLikes = useLikeStore(
    (state: LikeState) => state.initializeLikes
  );

  const fetchPosts = useCallback(
    async (cursorId: number | null) => {
      if (loading && !isRefreshing) return;
      setLoading(true);
      try {
        const data: PostResponse = await getMypagePosts(
          API_URLS[type],
          cursorId,
          10
        );

        setPosts((prevPosts) => {
          const newPosts =
            cursorId === null
              ? data.posts ?? []
              : [...prevPosts, ...(data.posts ?? [])];
          return newPosts;
        });

        setNextCursorId(data.nextCursorId || null);

        if (data.posts && data.posts.length > 0) {
          const likeUpdates: Record<
            string,
            { isLiked: boolean; likeCount: number }
          > = {};
          data.posts.forEach((post: MypagePost) => {
            const key = `POST_${post.postId}`;
            if (useLikeStore.getState().likeStatuses[key] === undefined) {
              likeUpdates[key] = {
                isLiked: post.isLiked ?? false,
                likeCount: post.likeCount ?? 0,
              };
            }
          });
          if (Object.keys(likeUpdates).length > 0) {
            console.log(
              `[Mypage/PostList - ${type}] Initializing LikeStore for new items:`,
              likeUpdates
            );
            initializeLikes(likeUpdates);
          }
        }
      } catch (error) {
        console.error(`마이페이지 게시글 (${type}) 조회 실패 : `, error);
        setPosts([]);
        setNextCursorId(null);
      } finally {
        setLoading(false);
      }
    },
    [type, initializeLikes, loading, isRefreshing]
  );

  useEffect(() => {
    console.log(
      `[Mypage/PostList - ${type}] Initial fetch or type/trigger changed.`
    );
    setIsRefreshing(false);
    setPosts([]);
    setNextCursorId(null);
    setIsEmpty(false);
    fetchPosts(null);
  }, [type, refreshTrigger]);

  useEffect(() => {
    if (!loading && !isRefreshing && posts.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [posts, loading, isRefreshing]);

  const loadMore = useCallback(() => {
    if (nextCursorId && !loading && !isRefreshing) {
      console.log(
        `[Mypage/PostList - ${type}] Loading more posts from cursor: ${nextCursorId}`
      );
      fetchPosts(nextCursorId);
    }
  }, [nextCursorId, loading, isRefreshing, fetchPosts, type]);

  const onRefresh = useCallback(async () => {
    if (loading || isRefreshing) return;

    console.log(`[Mypage/PostList - ${type}] User triggered refresh.`);
    setIsRefreshing(true);
    try {
      setPosts([]);
      setNextCursorId(null);
      setIsEmpty(false);
      await fetchPosts(null);
    } catch (error) {
      console.error(`[Mypage/PostList - ${type}] Refresh failed:`, error);
    } finally {
      setIsRefreshing(false);
    }
  }, [type, fetchPosts, loading, isRefreshing]);

  const onClickPost = (postId: number) => {
    navigation.navigate("BoardDetail", { boardId: postId });
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.postId.toString()}
      renderItem={({ item }) => (
        <PostCard
          profileUrl={item.profileUrl}
          nickname={item.nickname}
          userType={item.userType}
          createdAt={item.createdAt}
          title={item.title}
          content={item.content}
          isLiked={item.isLiked}
          likeCount={item.likeCount}
          commentCount={item.commentCount}
          postId={item.postId}
          onCommentPress={() => onClickPost(item.postId)}
          onCardPress={() => onClickPost(item.postId)}
        />
      )}
      contentContainerStyle={styles.listContent}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading && !isRefreshing && posts.length > 0 ? (
          <ActivityIndicator size="small" />
        ) : null
      }
      ListEmptyComponent={
        !loading && !isRefreshing && isEmpty ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {type === "좋아요"
                ? "좋아요한 게시글이 없습니다."
                : type === "스크랩"
                ? "스크랩한 게시글이 없습니다."
                : "작성한 게시글이 없습니다."}
            </Text>
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});

export default PostList;
