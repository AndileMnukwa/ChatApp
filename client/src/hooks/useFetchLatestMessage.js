import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await getRequest(`${baseUrl}/messages/${chat._id}`);
                
                if (response.error) {
                    return console.log("Error getting messages...", response.error);
                }

                // Make sure we have messages before trying to get the last one
                if (response && response.length > 0) {
                    const lastMessage = response[response.length - 1];
                    setLatestMessage(lastMessage);
                }
            } catch (error) {
                console.log("Error getting messages...", error);
            }
        };
        
        getMessages();
    }, [chat._id, newMessage, notifications]);

    return { latestMessage };
};