import { View, Text, Button } from 'react-native'
import { useAuth } from '../../shared/hooks'
import { userDetails, UserInfo } from '../../shared/types/user'
import { loginTemp, getProfileInfos } from './Api/loginAPI'
import { useState } from 'react'

const UseAuthTestScreen = () => {
    const { user, setUser, loggedIn, logOut } = useAuth();

    const [userInfo, setUserInfo] = useState<UserInfo>();

    const login = async () => {
        try {
            const result: userDetails = await loginTemp();

            setUser(result);
        } catch (error) {
            console.error("임시 로그인 실패 :", error);
        }
    }

    const getProfInfos = async () => {
        try {
            const result: UserInfo = await getProfileInfos();

            setUserInfo(result);
        } catch (error) {
            console.error("프로필 정보 불러오기 실패 :", error);
        }
    }

    return (
        <View>
            {loggedIn ? (
                <>
                    <Text>nickname : {user?.nickname}</Text>
                    <Text>userType : {user?.userType}</Text>
                    <Text>state : {user?.state}</Text>
                    <Text>isMember : {user?.isMember}</Text>
                    <Text>accessToken : {user?.accessToken}</Text>
                    <Text>refreshToken : {user?.refreshToken}</Text>

                    <Button title="프로필 정보 조회" onPress={getProfInfos} />
                    <Text>{userInfo?.region}, {userInfo?.religion}</Text>
                    <Button title="로그아웃" onPress={logOut} />
                </>
            ) : (
                <>
                    <Button title="로그인" onPress={login} />
                </>
            )}
        </View>
    )
}

export default UseAuthTestScreen;