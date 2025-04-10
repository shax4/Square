import axiosInstance from "../../api/axiosInstance";
import { S3Response } from "../type/s3Types";

export const signUp = async (fileName : string, contentType: string, folder : string) : Promise<S3Response>=> {
    try{
        const response = await axiosInstance.post('/api/s3/presigned-put', {
            fileName, contentType, folder
        })

        return response.data;
    }catch(error){
        throw error;
    }
}