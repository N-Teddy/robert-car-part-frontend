import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
    useRef,
} from "react";
import { jwtDecode } from "jwt-decode";
import type {
    LoginRequest,
    RegisterRequest,
    RefreshTokenRequest,
} from "../types/request/auth";
import type { User } from "../types/response/auth";
import { useLogin, useRefreshToken, useRegister } from "../hooks/authHook";
import type { AuthContextType, DecodedToken, Tokens } from "../types/authContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<Tokens | null>(null);
    const [loading, setLoading] = useState(true);
    const isRefreshing = useRef(false);

    const loginMutation = useLogin();
    const registerMutation = useRegister();
    const refreshMutation = useRefreshToken();

    /** Decode JWT and set user */
    const decodeAndSetUser = useCallback((accessToken: string) => {
        try {
            const decoded = jwtDecode<DecodedToken>(accessToken);
            setUser({
                id: decoded.sub,
                email: decoded.email,
                fullName: "", // not in token, but could be fetched if needed
                role: decoded.role as any,
                isActive: true, // assume active if token is valid
                phoneNumber: "", // not in token
            });
        } catch (err) {
            console.error("Failed to decode token", err);
            setUser(null);
        }
    }, []);

    /** Save tokens to state + storage */
    const saveTokens = useCallback(
        (newTokens: Tokens) => {
            setTokens(newTokens);
            localStorage.setItem("authToken", JSON.stringify(newTokens));
            decodeAndSetUser(newTokens.accessToken);
        },
        [decodeAndSetUser]
    );

    /** Restore session on mount */
    useEffect(() => {
        const stored = localStorage.getItem("authToken");
        if (stored) {
            const parsed: Tokens = JSON.parse(stored);
            const decoded = jwtDecode<DecodedToken>(parsed.accessToken);

            if (decoded.exp * 1000 > Date.now()) {
                // token still valid
                saveTokens(parsed);
            } else {
                // try refresh
                refreshMutation.mutate(
                    { refreshToken: parsed.refreshToken } as RefreshTokenRequest,
                    {
                        onSuccess: (res) => saveTokens(res.data),
                        onError: () => logout(),
                    }
                );
            }
        }
        setLoading(false);
    }, [refreshMutation, saveTokens]);

    /** Auto refresh before expiry */
    useEffect(() => {
        if (!tokens || isRefreshing.current) return;

        const decoded = jwtDecode<DecodedToken>(tokens.accessToken);
        const expiresInMs = decoded.exp * 1000 - Date.now();

        // Don't refresh if token has more than 5 minutes left
        if (expiresInMs > 300000) return;

        // refresh 30s before expiry
        const timeout = setTimeout(() => {
            isRefreshing.current = true;
            refreshMutation.mutate(
                { refreshToken: tokens.refreshToken } as RefreshTokenRequest,
                {
                    onSuccess: (res) => {
                        saveTokens(res.data);
                        isRefreshing.current = false;
                    },
                    onError: () => {
                        logout();
                        isRefreshing.current = false;
                    },
                }
            );
        }, Math.max(expiresInMs - 30000, 0));

        return () => clearTimeout(timeout);
    }, [tokens, refreshMutation, saveTokens]);

    /** Login */
    const login = async (data: LoginRequest) => {
        return new Promise<void>((resolve, reject) => {
            loginMutation.mutate(data, {
                onSuccess: (res) => {
                    saveTokens(res.data);
                    resolve();
                },
                onError: (err) => reject(err),
            });
        });
    };

    /** Register */
    const register = async (data: RegisterRequest) => {
        return new Promise<void>((resolve, reject) => {
            registerMutation.mutate(data, {
                onSuccess: (res) => {
                    saveTokens(res.data);
                    resolve();
                },
                onError: (err) => reject(err),
            });
        });
    };

    /** Logout */
    const logout = () => {
        setUser(null);
        setTokens(null);
        localStorage.removeItem("authToken");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                tokens,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                loading,
            }
            }
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
    return ctx;
};
