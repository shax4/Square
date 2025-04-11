// VoteConfirmModal.tsx
import React from 'react';
import { Modal, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { styles } from './DebateCard.styles';
import Text from '../../../components/Common/Text';

interface VoteConfirmModalProps {
    visible: boolean;
    onConfirm: (debateId: number, isLeft: boolean) => void;
    onCancel: () => void;
    isLeft: boolean;
    debateId: number;
}

const VoteConfirmModal = ({ visible, onConfirm, onCancel, debateId, isLeft }: VoteConfirmModalProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            {/* 배경을 눌러도 투표 취소되도록 */}
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay} >
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>신중히 선택해주세요</Text>
                        <Text weight="medium" style={styles.message}>한 번 투표하면 되돌릴 수 없어요.</Text>
                        <Text weight="medium" style={styles.message}>정말 투표하시겠어요?</Text>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirm(debateId, isLeft)}>
                                <Text style={styles.confirmText}>예</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                <Text style={styles.cancelText}>아니오</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default VoteConfirmModal;

