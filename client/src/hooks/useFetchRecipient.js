import { useEffect, useState } from "react";    
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members?.find((id) => id !== user?._id);
    
    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return;
            
            try {
                // Fixed URL string - removed any spaces in the template literal
                const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
                
                console.log("API Response:", response); // Add logging for debugging

                if (response?.error) {
                    return setError(response.error);
                }

                setRecipientUser(response);
            } catch (err) {
                console.error("Error fetching recipient user:", err);
                setError(err.message);
            }
        };
        
        getUser();
    }, [recipientId]); // Add recipientId as dependency
    
    return { recipientUser, error };
};