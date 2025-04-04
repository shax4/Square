export interface ProfileBoxProps {
    imageUrl?: string;
    variant?: "small" | "medium" | "large" | "extralarge";
    nickname: string;
    userType: string | null;
    createdAt: string;
}