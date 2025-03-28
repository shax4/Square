import {useState} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {styles} from "./LikeButton.styles";
import {LikeButtonProps} from "./LikeButton.types";

const LikeButton = ({
    initialCount = 0, 
    initialLiked = false, 
    isVertical=true,
    size ="large"
    }: LikeButtonProps) => {

    const [liked, setLiked] = useState<boolean>(initialLiked);
    const [likeCount, setLikeCount] = useState<number>(initialCount);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev -1 : prev + 1));
    }
    const iconSize = size === "large" ? 32 : 24;
    const textSize = size === "large" ? 14 : 12;

    return (
        <TouchableOpacity onPress={handleLike} style={isVertical? styles.container : styles.containerHorizontal} activeOpacity={0.7}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={iconSize} color={liked? "red" : "gray"}/>
            <Text style={[styles.likeCount, {fontSize: textSize}]}>{likeCount}</Text>
        </TouchableOpacity>
    )
}

export default LikeButton;