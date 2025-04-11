export interface SignUpRequest{
    email: string;
    socialType: string;
    nickname: string;
    s3Key: string;
    region: string;
    gender: string;
    yearOfBirth: number;
    religion: string;
}

export interface SignUpResponse{
    isMember: boolean;
    email: string;
    socialType: string;
    nickname: string;
    userType: string;
    accessToken: string;
    refreshToken: string;
}