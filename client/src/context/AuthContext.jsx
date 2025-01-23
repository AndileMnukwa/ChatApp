import { createContext, useState, useCallback, useEffect } from "react";
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

       

        useEffect(()=>{
            const user = localStorage.getItem("User");

            setUser(JSON.parse(user));
        },[]);

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

    const logoutUser = useCallback(()=>{
        localStorage.removeItem("User");
        setUser(null);
    }, []);

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
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
