import {View, Text, Button} from 'react-native'
import { useAuth } from '../../shared/hooks'
import { userDetails } from '../../shared/stores/auth'
import { PersonalityTag } from '../../components'

const UseAuthTestScreen = () => {
    const {user, setUser, loggedIn, logOut} = useAuth();
    const login = () => {
        const userData: userDetails = {
            nickname: "sagak",
            userType: "ABCD",
            token: "token1234",
        }
        setUser(userData);
    }

    return (
        <View>
            {loggedIn ? (
                <>
                    <Text>{user?.nickname} ({user?.userType}) 님, 안녕하세요! 토큰 : {user?.token}</Text>
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