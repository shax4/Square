import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { useAuth } from "../../shared/hooks";
import SettingToggleItem from "./components/SettingToggleItem";
import { useAdminMode } from "../../shared/hooks/useAdminMode";

const SettingScreen = () => {
    const { user } = useAuth();
    const { isAdminMode, setAdminMode, isAdminState, setAdminState } = useAdminMode();
    const [settings, setSettings] = useState({
        newTopic: true,
        popularOpinion: true,
        commentAlert: true,
        vibrate: true,
        sound: true,
        alert: true,
        hidePreference: false,
    });

    const toggleSetting = (key: keyof typeof settings) => (val: boolean) => {
        setSettings(prev => ({ ...prev, [key]: val }));
    };

    return (
        <ScrollView style={styles.container}>
            <SettingToggleItem label="새 토픽 알림" value={settings.newTopic} onValueChange={toggleSetting("newTopic")} />
            <SettingToggleItem label="인기 의견 알림" value={settings.popularOpinion} onValueChange={toggleSetting("popularOpinion")} />
            <SettingToggleItem label="내 글에 대한 댓글 알림" value={settings.commentAlert} onValueChange={toggleSetting("commentAlert")} />
            <SettingToggleItem label="앱 실행 중 진동" value={settings.vibrate} onValueChange={toggleSetting("vibrate")} />
            <SettingToggleItem label="앱 실행 중 사운드" value={settings.sound} onValueChange={toggleSetting("sound")} />
            <SettingToggleItem label="앱 실행 중 알림" value={settings.alert} onValueChange={toggleSetting("alert")} />
            <SettingToggleItem label="내 성향 숨기기" value={settings.hidePreference} onValueChange={toggleSetting("hidePreference")} />

            {isAdminState && (
                <>
                    <View style={styles.sectionDivider} />
                    <Text style={styles.sectionTitle}>관리자 모드</Text>
                    <SettingToggleItem
                        label="관리자 모드 전환"
                        value={isAdminMode}
                        onValueChange={setAdminMode}
                    />
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: "#999",
        marginVertical: 12,
    },
    sectionTitle: {
        paddingHorizontal: 16,
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
    },
});

export default SettingScreen;
