import {useState} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {styles} from "./LikeButton.styles";
import {LikeButtonProps} from "./LikeButton.types";

const LikeButton = ({initialCount = 0, initialLiked = false}: LikeButtonProps) => {
    const [liked, setLiked] = useState<boolean>(initialLiked);
    const [likeCount, setLikeCount] = useState<number>(initialCount);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev -1 : prev + 1));
    }

    return (
        <TouchableOpacity onPress={handleLike} style={styles.container} activeOpacity={0.7}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={32} color={liked? "red" : "gray"}/>
            <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
    )
}

export default LikeButton;