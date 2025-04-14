import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]); 
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Set up the socket connection when the component mounts
    useEffect(() => {
        if (!user?._id) return; // Don't connect if user is not logged in
        
        const newSocket = io("http://localhost:3000", {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        
        setSocket(newSocket);
        
        // Clean up on unmount
        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, [user]);

    // Register user with socket server when socket is ready
    useEffect(() => {
        if (socket === null || !user?._id) return;
        
        console.log("Registering user with socket", user._id);
        socket.emit("addNewUser", user._id);
        
        // Listen for online users updates
        socket.on("getOnlineUsers", (users) => {
            console.log("Received online users:", users);
            setOnlineUsers(users);
        });
        
        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket, user]);

    // Send new message to socket server
    useEffect(() => {
        if (socket === null || !newMessage) return;
        
        const recipientId = currentChat?.members.find(
            (id) => id !== user?._id
        );
        
        if (recipientId) {
            console.log("Sending message to:", recipientId);
            socket.emit("sendMessage", { ...newMessage, recipientId });
        }
    }, [newMessage, currentChat, user, socket]);

    // Receive messages from socket server
    useEffect(() => {
        if (socket === null) return;

        socket.on("getMessage", (res) => {
            console.log("Received message:", res);
            
            if (currentChat?._id === res.chatId) {
                setMessages((prev) => [...prev, res]);
            }
        });

        return () => {
            socket.off("getMessage");
        };
    }, [socket, currentChat]);

    // Get potential chats (users that the current user hasn't chatted with yet)
    useEffect(() => {
        const getUsers = async () => {
            if (!user?._id) return;
            
            const response = await getRequest(`${baseUrl}/users`);

            if (response.error) {
                return console.log("Error fetching users:", response.error);
            }

            const pChats = response.filter((u) => {
                let isChatCreated = false;

                if (user._id === u._id) return false;

                if (userChats) {
                    isChatCreated = userChats.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                }

                return !isChatCreated;
            });

            setPotentialChats(pChats);
        };

        getUsers();
    }, [userChats, user]);

    // Get user's chats
    useEffect(() => {
        const getUserChats = async () => {
            if (!user?._id) return;
            
            setIsUserChatsLoading(true);
            setUserChatsError(null);

            const response = await getRequest(`${baseUrl}/chats/${user._id}`);

            setIsUserChatsLoading(false);

            if (response.error) {
                return setUserChatsError(response);
            }

            setUserChats(response);
        };

        getUserChats();
    }, [user]);

    // Get messages for the current chat
    useEffect(() => {
        const getMessages = async () => {
            if (!currentChat?._id) return;

            setIsMessagesLoading(true);
            setMessagesError(null);

            const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);

            setIsMessagesLoading(false);

            if (response.error) {
                return setMessagesError(response);
            }

            setMessages(response);
        };

        getMessages();
    }, [currentChat]);

    // Send a text message
    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("No text message provided...");

        const response = await postRequest(
            `${baseUrl}/messages`, 
            JSON.stringify({ 
                chatId: currentChatId,
                senderId: sender._id, 
                text: textMessage,  
            })
        );

        if (response.error) {
            return setSendTextMessageError(response.error);
        }
        
        setNewMessage(response);
        setMessages((prev) => [...(prev || []), response]);
        setTextMessage("");
    }, []);

    // Update the current chat
    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    // Create a new chat
    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(
            `${baseUrl}/chats`, 
            JSON.stringify({ 
                firstId, 
                secondId 
            })
        );

        if (response.error) {
            return console.log("Error creating chat:", response.error);
        }

        setUserChats((prev) => [...(prev || []), response]);
    }, []);

    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,
                potentialChats,
                createChat,
                updateCurrentChat,
                currentChat,
                messages,
                isMessagesLoading,
                messagesError,
                sendTextMessage,
                onlineUsers
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};