import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, View, Keyboard, Text } from "react-native";

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
    contentMinSize?: number;
    contentMaxSize?: number;
}

const CommentInput = ({
    value,
    onChangeText,
    onSubmit,
    placeholder = "댓글을 입력하세요...",
    disabled = false,
    profileImageUrl,
    contentMinSize = 1,
    contentMaxSize = 100,
}: CommentInputProps): JSX.Element => {

    const [WarnVisible, setWarnVisible] = useState(false);

    const showWarning = () => {
        setWarnVisible(true);
        setTimeout(() => {
            setWarnVisible(false);
        }, 2000); // 2초 후에 사라짐
    };

    const handleSubmit = () => {
        const valueLength = value.trim().length;
        if (valueLength >= contentMinSize && valueLength <= contentMaxSize) {
            onSubmit();
            Keyboard.dismiss();
        } else {
            showWarning();
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 100}
        >
            {WarnVisible && (
                <View style={styles.ErrorInfoView}>
                    <Text style={styles.ErrorINfoText}>
                        최소 {contentMinSize}자 이상, 최대 {contentMaxSize}자 이하 이어야 합니다.
                    </Text>
                </View>
            )}
            <View style={styles.CommentCreateView}>
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
                    onPress={() => { handleSubmit() }}
                    disabled={disabled}
                >
                    <Icons.send />
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>

    );
};

export default CommentInput;