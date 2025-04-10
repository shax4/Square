import axiosInstance from "../../../shared/api/axiosInstance";
import { SignUpRequest, SignUpResponse } from "../type/signUpTypes";

export const signUp = async (email : string, socialType : string, nickname : string, s3Key : string, region : string, gender : string, yearOfBirth : number, religion : string) : Promise<SignUpResponse>=> {
    try{
        const response = await axiosInstance.post('/api/users', {
            email, socialType, nickname, s3Key, region, gender, yearOfBirth, religion
        })

        return response.data;
    }catch(error){
        throw error;
    }
}