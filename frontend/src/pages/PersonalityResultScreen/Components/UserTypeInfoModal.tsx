import React from 'react';
import {
    Modal,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    Platform,
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
        <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {/* 모달 헤더 */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>성향 유형 정보</Text>
                            <TouchableOpacity style={styles.headerCloseButton} onPress={onClose}>
                                <Text style={styles.headerCloseButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* ✅ 스크롤 가능한 영역 */}
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={true}
                        >
                            {DATA.map((item) => (
                                <View key={item.id} style={styles.section}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.description}>{item.description}</Text>

                                    <View style={styles.traitsContainer}>
                                        <View style={[styles.traitBox, styles.traitBoxLeft]}>
                                            <View style={styles.traitHeader}>
                                                <Text style={styles.traitShort}>{item.traitA.short}</Text>
                                                <Text style={styles.traitName}>{item.traitA.name}</Text>
                                            </View>
                                            <View style={styles.traitContent}>
                                                <Text style={styles.traitDefinition}>{item.traitA.definition}</Text>
                                                <Text style={styles.traitExample}>"{item.traitA.example}"</Text>
                                            </View>
                                        </View>

                                        <View style={[styles.traitBox, styles.traitBoxRight]}>
                                            <View style={styles.traitHeader}>
                                                <Text style={styles.traitShort}>{item.traitB.short}</Text>
                                                <Text style={styles.traitName}>{item.traitB.name}</Text>
                                            </View>
                                            <View style={styles.traitContent}>
                                                <Text style={styles.traitDefinition}>{item.traitB.definition}</Text>
                                                <Text style={styles.traitExample}>"{item.traitB.example}"</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                            <View style={styles.bottomPadding} />
                        </ScrollView>

                        {/* 하단 닫기 버튼 */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.closeButtonText}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>

    );
};

export default UserTypeInfoModal;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        width: '90%',
        height: '90%', // ✅ 여기 추가
        overflow: 'hidden',
        flexDirection: 'column',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        position: 'relative',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    headerCloseButton: {
        position: 'absolute',
        right: 16,
        top: 16,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCloseButtonText: {
        fontSize: 16,
        color: '#666',
    },
    scrollWrapper: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },
    traitsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    traitBox: {
        flex: 1,
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#fff',
    },
    traitBoxLeft: {
        marginRight: 6,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
    },
    traitBoxRight: {
        marginLeft: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#5d8aa8',
    },
    traitHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    traitShort: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 6,
        color: colors.primary,
        backgroundColor: '#f0f5ff',
        width: 24,
        height: 24,
        textAlign: 'center',
        lineHeight: 24,
        borderRadius: 12,
    },
    traitName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    traitContent: {
        paddingLeft: 4,
    },
    traitDefinition: {
        fontSize: 13,
        marginBottom: 6,
        color: '#444',
        lineHeight: 18,
    },
    traitExample: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#666',
    },
    bottomPadding: {
        height: 80,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    closeButton: {
        backgroundColor: colors.yesDark,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
