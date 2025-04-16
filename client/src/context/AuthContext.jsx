import { createContext, useState, useCallback, useEffect } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });

    // For development debugging only
    // console.log("User", user);
    // console.log("loginInfo", loginInfo);

    useEffect(() => {
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    }, []);

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo((prev) => ({ ...prev, ...info }));
    }, []);

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo((prev) => ({ ...prev, ...info }));
    }, []);

    const formatErrorMessage = (error) => {
        // Format the error message based on the error type
        if (typeof error === 'string') {
            return { error: true, message: error };
        }
        
        if (error?.message) {
            return { error: true, message: error.message };
        }
        
        return { error: true, message: "An unexpected error occurred. Please try again." };
    };

    const registerUser = useCallback(async (e) => {
        e.preventDefault();

        setIsRegisterLoading(true);
        setRegisterError(null);

        try {
            // Basic client-side validation
            if (!registerInfo.name || !registerInfo.email || !registerInfo.password) {
                throw new Error("All fields are required");
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(registerInfo.email)) {
                throw new Error("Please enter a valid email address");
            }

            // Password strength validation
            if (registerInfo.password.length < 8) {
                throw new Error("Password must be at least 8 characters long");
            }

            const response = await postRequest(
                `${baseUrl}/users/register`,
                JSON.stringify(registerInfo)
            );

            setIsRegisterLoading(false);

            if (response.error) {
                setRegisterError(response);
                return;
            }

            localStorage.setItem("User", JSON.stringify(response));
            setUser(response);
        } catch (error) {
            setIsRegisterLoading(false);
            setRegisterError(formatErrorMessage(error));
        }
    }, [registerInfo]);

    const loginUser = useCallback(async (e) => {
        e.preventDefault();

        setIsLoginLoading(true);
        setLoginError(null);

        try {
            // Basic validation
            if (!loginInfo.email || !loginInfo.password) {
                throw new Error("Email and password are required");
            }

            const response = await postRequest(
                `${baseUrl}/users/login`,
                JSON.stringify(loginInfo)
            );

            setIsLoginLoading(false);

            if (response.error) {
                setLoginError(response);
                return;
            }

            localStorage.setItem("User", JSON.stringify(response));
            setUser(response);
        } catch (error) {
            setIsLoginLoading(false);
            setLoginError(formatErrorMessage(error));
        }
    }, [loginInfo]);

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
                logoutUser,
                loginUser,
                loginError,
                loginInfo,
                updateLoginInfo,
                isLoginLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}