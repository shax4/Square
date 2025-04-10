import { axiosInstance } from "../../../shared";

export const deleteAccount = async ()=> {
    try{
        const response = await axiosInstance.delete('/api/users')

        return response.data;
    }catch(error){
        throw error;
    }
}