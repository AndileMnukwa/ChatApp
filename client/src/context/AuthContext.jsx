import { createContext, useState, useCallback } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null)
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo((prev) => ({ ...prev, ...info }));
    }, []);

    const registerUser = useCallback(async (e) => {
        e.preventDefault()

        setIsRegisterLoading(true)
        setRegisterError(null)

        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify
            (registerInfo)
        );

        setIsRegisterLoading(false)

        if (response.error) {
            return setRegisterError(response);
        }

        localStorage.setItem("user", JSON.stringify(response))
        setUser(response)
    }, [registerInfo]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser, // Expose `setUser` if user updates are needed elsewhere
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
