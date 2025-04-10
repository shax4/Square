// 임시 로그인 시 반환되는 유저 정보.
export interface userDetails{
    nickname: string | null;
    userType: string | null;
    email: string | null;
    socialType: string | null;
    state: string;
    isMember : boolean;
    accessToken : string | null;
    refreshToken : string | null;
}

export interface UserInfo{
    profileUrl: string;
    region: string;
    religion: string;
    userState: string;
}