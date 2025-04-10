import { NavigationContainer, useNavigationState } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { navigationRef } from './NavigationService';
import BoardHeaderBar from "./stacks/BoardHeaderBar";
import NotificationHeaderBar from "./stacks/NotificationHeaderBar";
import MainHeaderBar from "./stacks/MainHeaderBar";
import MyPageHeaderBar from "./stacks/MyPageHeaderBar";

import { hideTabBarScreens } from "./NavigationData"
import { useAuthStore } from "../../shared/stores";

import LandingScreen from "../../pages/LandingScreen/LandingScreen";
import { useEffect, useState } from "react";
import { useAuth } from "../../shared/hooks";
import { useDebateTabRefreshStore } from "../../shared/stores/debateTabRefreshStore";

// 하단에 표시되는 탭 이름.
const boardName = "게시판";
const mainName = "메인 홈";
const notificationName = "알림";
const mypageName = "마이페이지";

const Tab = createBottomTabNavigator();

function BottomTabs() {
    const navigationState = useNavigationState((state) => state);

    const getNestedRouteName = (state: any): string | null => {
        if (!state) return null;
        const route = state.routes[state.index];
        if (route.state) {
            return getNestedRouteName(route.state);
        }
        return route.name;
    };

    const currentRouteName = getNestedRouteName(navigationState);

    return (
        <Tab.Navigator
            initialRouteName={mainName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons
                        name={
                            route.name === boardName
                                ? focused
                                    ? "chatbox"
                                    : "chatbox-outline"
                                : route.name === mainName
                                    ? "home"
                                    : route.name === notificationName
                                        ? focused
                                            ? "notifications"
                                            : "notifications-outline"
                                        : route.name === mypageName
                                            ? focused
                                                ? "person"
                                                : "person-outline"
                                            : "help-circle"
                        }
                        size={size}
                        color={color}
                    />
                ),
                tabBarStyle: {
                    display: hideTabBarScreens.includes(currentRouteName!) ? "none" : "flex",
                    position: "absolute",
                    backgroundColor: "white",
                    borderRadius: 20,
                    marginHorizontal: 20,
                    marginBottom: 10,
                    marginTop: 10,
                    height: 60,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                },
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >

            <Tab.Screen
                name={mainName}
                component={MainHeaderBar}
                listeners={({ navigation, route }) => ({
                    tabPress: (e) => {
                        const state = navigation.getState();
                        const currentRoute = state.routes[state.index];

                        // 탭이 이미 포커스된 상태에서 다시 눌렸는지 확인
                        if (currentRoute.name === route.name) {
                            useDebateTabRefreshStore.getState().triggerRefresh();
                        }
                    },
                })}
            />
            <Tab.Screen name={boardName} component={BoardHeaderBar} />
            <Tab.Screen name={notificationName} component={NotificationHeaderBar} />
            <Tab.Screen name={mypageName} component={MyPageHeaderBar} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { user } = useAuth()

    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        if (user?.accessToken)
            setIsUserLoggedIn(true);
        else
            setIsUserLoggedIn(false);
    }, [user])

    return (
        <NavigationContainer ref={navigationRef}>
            {isUserLoggedIn ? <BottomTabs /> : <LandingScreen />}
        </NavigationContainer>
    );
}
