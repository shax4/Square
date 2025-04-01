import React from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, View } from "react-native";

import { styles } from "./Components/CommentInput.styles";
import ProfileImage from "../ProfileImage";
import { Icons } from "../../../assets/icons/Icons";

interface CommentInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    disabled?: boolean;
    profileImageUrl?: string;
}

const CommentInput = ({
    value,
    onChangeText,
    onSubmit,
    placeholder = "댓글을 입력하세요...",
    disabled = false,
    profileImageUrl,
}: CommentInputProps): JSX.Element => {
    return (
        <KeyboardAvoidingView
            style={styles.CommentCreateView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <View style={styles.CommentProfileImage}>
                <ProfileImage variant="small" imageUrl={profileImageUrl} />
            </View>

            <TextInput
                style={styles.commentInput}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                editable={!disabled}
                multiline
            />

            <TouchableOpacity
                style={styles.CommentSendButton}
                onPress={() => {
                    if (value.trim() !== "") {
                        onSubmit();
                    }
                }}
                disabled={disabled}
            >
                <Icons.send />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default CommentInput;
