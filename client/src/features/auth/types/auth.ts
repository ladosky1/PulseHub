export interface User {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    avatar?: string | null;
};

export interface AuthResponse {
    message: string;
    user: User;
}