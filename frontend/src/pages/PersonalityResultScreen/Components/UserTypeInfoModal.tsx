import React from 'react';
import {
    Modal,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Text from '../../../components/Common/Text';
import colors from '../../../../assets/colors';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

interface UserTypeInfoModalProps {
    visible: boolean;
    onClose: () => void;
}

const DATA = [
    {
        id: 1,
        title: "🌍 가치관",
        description: "의사결정에서 현실적인 요소와 이상적인 요소 중 어느 쪽을 더 고려하는가?",
        traitA: {
            name: "Pragmatism",
            short: "P",
            definition: "현실을 우선",
            example: "실용적인 해결책이 중요"
        },
        traitB: {
            name: "Idealism",
            short: "I",
            definition: "이상적인 가치를 추구",
            example: "이상적 목표를 추구"
        }
    },
    {
        id: 2,
        title: "🤝 사회관",
        description: "개인의 자유와 공동체의 조화 중 어느 쪽을 더 중요하게 생각하는가?",
        traitA: {
            name: "Individualism",
            short: "N",
            definition: "개인의 자유를 중시",
            example: "자유와 경쟁이 중요"
        },
        traitB: {
            name: "Collectivism",
            short: "C",
            definition: "공동체와 협력을 중시",
            example: "협력과 조화가 더 중요"
        }
    },
    {
        id: 3,
        title: "⚡ 미래관",
        description: "기술 발전과 환경 보호 중 어느 쪽을 더 우선해야 한다고 생각하는가?",
        traitA: {
            name: "Technological Progress",
            short: "T",
            definition: "기술 발전을 중시",
            example: "기술 혁신이 미래를 바꾼다"
        },
        traitB: {
            name: "Sustainability",
            short: "S",
            definition: "지속 가능한 환경 보호를 중시",
            example: "환경 보호가 더 시급하다"
        }
    },
    {
        id: 4,
        title: "🎯 성취관",
        description: "안정적인 삶과 새로운 도전 중 어떤 가치를 더 중시하는가?",
        traitA: {
            name: "Stability",
            short: "B",
            definition: "안정적인 삶을 추구",
            example: "안정적인 직장이 중요"
        },
        traitB: {
            name: "Risk-taking",
            short: "R",
            definition: "도전을 통해 성장을 추구",
            example: "도전을 통해 성장해야"
        }
    }
];

const UserTypeInfoModal = ({ visible, onClose }: UserTypeInfoModalProps) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <View style={styles.scrollWrapper}>
                                <ScrollView
                                    style={styles.scrollView}
                                    contentContainerStyle={styles.scrollContent}
                                    showsVerticalScrollIndicator={true}
                                >
                                    {DATA.map((item) => (
                                        <View key={item.id} style={styles.section}>
                                            <Text style={styles.title}>{item.title}</Text>
                                            <Text style={styles.description}>{item.description}</Text>

                                            <View style={styles.traitsContainer}>
                                                <View style={styles.traitBox}>
                                                    <Text style={styles.traitShort}>{item.traitA.short}</Text>
                                                    <Text style={styles.traitName}>{item.traitA.name}</Text>
                                                    <Text style={styles.traitDefinition}>{item.traitA.definition}</Text>
                                                    <Text style={styles.traitExample}>{item.traitA.example}</Text>
                                                </View>

                                                <View style={styles.traitBox}>
                                                    <Text style={styles.traitShort}>{item.traitB.short}</Text>
                                                    <Text style={styles.traitName}>{item.traitB.name}</Text>
                                                    <Text style={styles.traitDefinition}>{item.traitB.definition}</Text>
                                                    <Text style={styles.traitExample}>{item.traitB.example}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* 항상 하단에 고정되는 닫기 버튼 */}
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>


    );
};

export default UserTypeInfoModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.blurbackgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: colors.white,
        borderRadius: 15,
        width: '90%',
        maxHeight: '85%',
        overflow: 'hidden',
        flexDirection: 'column',
    },
    scrollWrapper: {
        flex: 1,
    },
    scrollView: {
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingVertical: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        marginBottom: 12,
    },
    traitsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10, // 좌우 여백 추가
    },
    traitBox: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 5, // traitBox 사이 여백
    },
    traitShort: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
        color: colors.primary,
    },
    traitName: {
        fontSize: 15,
        fontWeight: '600',
    },
    traitDefinition: {
        fontSize: 13,
        marginTop: 4,
    },
    traitExample: {
        fontSize: 12,
        marginTop: 4,
        fontStyle: 'italic',
        color: '#666',
    },
    closeButton: {
        backgroundColor: colors.yesDark,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 12,
    },
    closeButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
