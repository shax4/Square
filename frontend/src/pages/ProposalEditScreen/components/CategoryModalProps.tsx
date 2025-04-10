import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
} from "react-native";
import colors from "../../../../assets/colors";

const CATEGORY_LIST = ["사회", "정치", "경제", "환경", "기술", "윤리"];

interface CategoryDropdownProps {
    category: string;
    setCategory: (value: string) => void;
}

export default function CategoryDropdown({ category, setCategory }: CategoryDropdownProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (item: string) => {
        setCategory(item);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.dropdownButtonText}>
                    {category || "카테고리를 선택하세요"}
                </Text>
            </TouchableOpacity>

            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <FlatList
                            data={CATEGORY_LIST}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.dropdownItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    dropdownButton: {
        padding: 15,
        backgroundColor: colors.hashtag,
        borderRadius: 15,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: "#333",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    dropdown: {
        marginHorizontal: 40,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 10,
    },
    dropdownItem: {
        paddingVertical: 12,
    },
    dropdownItemText: {
        fontSize: 16,
    },
});
