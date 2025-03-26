import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {LikeButton} from '../../../components';

type CommentCardProps = {
  title: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  onPress?: () => void;
  onLikeToggle?: (isLiked: boolean) => void;
};

const CommentCard = ({
  title,
  content,
  likeCount,
  isLiked,
  onPress,
}: CommentCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
        
        <View style={styles.commentContainer}>
          <Text style={styles.commentPrefix}>ㄴ</Text>
          <Text style={styles.commentContent} numberOfLines={2} ellipsizeMode="tail">
            {content}
          </Text>
        </View>
      </View>
      
      <View style={styles.likeContainer}>
        <LikeButton 
          initialCount={likeCount} 
          initialLiked={isLiked} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentPrefix: {
    fontSize: 14,
    color: '#888888',
    marginRight: 4,
    fontWeight: '500',
  },
  commentContent: {
    fontSize: 14,
    color: '#555555',
    flex: 1,
    lineHeight: 20,
  },
  likeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default CommentCard;
