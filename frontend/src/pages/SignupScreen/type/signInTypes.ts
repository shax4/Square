export interface SignInRequest{
    email: string;
    socialType: string;
    nickname: string;
    s3Key: string;
    region: string;
    gender: string;
    yearOfBirth: number;
    religion: string;
}

export interface SignInResponse{
    isMember: boolean;
    email: string;
    socialType: string;
    nickname: string;
    userType: string;
    accessToken: string;
    refreshToken: string;
}