import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator  } from "@react-navigation/bottom-tabs";
import {Ionicons} from '@expo/vector-icons'

import {BoardScreen, MainScreen, MypageScreen, NotificationScreen} from '../../pages'

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
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size} : {focused: boolean; color : string; size: number}) => {
                    let iconName = 'key';
                    let routeName = route.name;

                    if(routeName === boardName){
                        iconName = focused ? 'key' : 'key-outline';
                    }else if(routeName === mainName){
                        iconName = focused ? 'key' : 'key-outline';
                    }else if(routeName === notificationName){
                        iconName = focused ? 'key' : 'key-outline';
                    }else if(routeName === mypageName){
                        iconName = focused ? 'key' : 'key-outline';
                    }

                    return <Ionicons name={'key'} size={size} color={color}/>
                },
            })}>
                <Tab.Screen name={boardName} component={BoardScreen}/>
                <Tab.Screen name={mainName} component={MainScreen}/>
                <Tab.Screen name={notificationName} component={NotificationScreen}/>
                <Tab.Screen name={mypageName} component={MypageScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}