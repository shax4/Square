export interface FirebaseLoginResponse{
	"isMember": boolean;
	"email": string;
	"socialType": string;
	"nickname": string;
	"userType": string;
	"accessToken": string;
	"refreshToken": string;
}