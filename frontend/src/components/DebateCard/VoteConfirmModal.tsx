// VoteConfirmModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface VoteConfirmModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const VoteConfirmModal = ({ visible, onConfirm, onCancel }: VoteConfirmModalProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>신중히 선택해주세요</Text>
                    <Text style={styles.message}>한 번 투표하면 되돌릴 수 없어요.</Text>
                    <Text style={styles.message}>정말 투표하시겠어요?</Text>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmText}>예</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelText}>아니오</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default VoteConfirmModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 40
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 15
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12
    },
    cancelButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
    },
    cancelText: {
        fontSize: 15,
        color: '#333'
    },
    confirmButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
    },
    confirmText: {
        fontSize: 15,
        color: '#fff'
    }
});
