// 임시 로그인 시 반환되는 유저 정보.
export interface userDetails{
    nickname: string;
    userType: string | null;
    state: string;
    isMember : boolean;
    accessToken : string;
    refreshToken : string;
}

export interface UserInfo{
    profileUrl: string;
    region: string;
    religion: string;
}