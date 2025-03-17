import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator  } from "@react-navigation/bottom-tabs";
import {Ionicons} from '@expo/vector-icons';

import {BoardScreen, MainScreen, MypageScreen, NotificationScreen} from '../../pages'
import HeaderBar from './stacks/HeaderBar'

// 하단에 표시되는 탭 이름.
const boardName = '게시판';
const mainName = '메인 홈';
const notificationName = '알림';
const mypageName = '마이페이지';

const Tab = createBottomTabNavigator();

export default function BottomNav(){
    return(
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={mainName}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                    return (
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
                    );
                    },
                    tabBarStyle: {
                        position: "absolute", // 바를 떠있는 느낌으로 만들기 위해 필요
                        backgroundColor: "white", // 배경색 설정
                        borderRadius: 20, // 네비게이션 바의 모서리를 둥글게
                        marginHorizontal: 20, // 좌우 여백 추가
                        marginBottom: 10, // 아래 여백 추가
                        marginTop : 10,
                        height: 60, // 네비게이션 바 높이 조정
                        shadowColor: "#000", // 그림자 효과
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        elevation: 5, // 안드로이드 그림자 효과
                    },
                    tabBarActiveTintColor: "black",
                    tabBarInactiveTintColor: "gray",
                    headerShown: false,
                })}
                >

                <Tab.Screen name={boardName} component={HeaderBar}/>
                <Tab.Screen name={mainName} component={MainScreen}/>
                <Tab.Screen name={notificationName} component={NotificationScreen}/>
                <Tab.Screen name={mypageName} component={MypageScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}