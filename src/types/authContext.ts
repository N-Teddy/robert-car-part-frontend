import type { LoginRequest, RegisterRequest } from './request/auth';
import type { User } from './response/auth';

export interface DecodedToken {
    sub: string;
    email: string;
    role: string;
    exp: number;
    iat: number;
    fullName: string;
    isActive: boolean;
    phoneNumber: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}

export interface AuthContextType {
    user: User | null;
    tokens: Tokens | null;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}
