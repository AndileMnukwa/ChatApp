import { useRef, useContext, useState, useEffect } from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { Stack, Card, Spinner } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import avatar from "../../assets/avatar.svg";

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessagesLoading, sendTextMessage, onlineUsers } = useContext(ChatContext);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState("");
    const scroll = useRef();

    // Check if the recipient is online
    const isRecipientOnline = () => {
        if (!recipientUser?._id || !onlineUsers?.length) return false;
        
        const recipientId = recipientUser._id.toString();
        return onlineUsers.some(user => user.userId.toString() === recipientId);
    };

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!recipientUser)
        return (
            <Card className="chat-box h-100 d-flex justify-content-center align-items-center">
                <div className="text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#6C7A9C" className="bi bi-chat-square-text mb-3" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    <h5>No conversation selected</h5>
                    <p className="text-muted">Choose a chat from the sidebar to start messaging</p>
                </div>
            </Card>
        );

    if (isMessagesLoading)
        return (
            <Card className="chat-box h-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading conversation...</p>
            </Card>
        );

    return (
        <Card className="chat-box h-100">
            <div className="chat-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <div className="position-relative me-2">
                        <img src={avatar} height="40px" className="rounded-circle" alt={recipientUser?.name} />
                        {isRecipientOnline() && <span className="user-online"></span>}
                    </div>
                    <div>
                        <strong>{recipientUser?.name}</strong>
                        <div className="small text-muted">
                            {isRecipientOnline() ? (
                                <span className="text-success">Online</span>
                            ) : (
                                <span>Offline</span>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <button className="btn btn-sm btn-light rounded-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                        </svg>
                    </button>
                </div>
            </div>
            <Stack gap={3} className="messages">
                {messages && messages.length > 0 ? (
                    messages.map((message, index) => (
                        <Stack 
                            key={index} 
                            className={`${
                                message?.senderId === user?._id 
                                    ? "message self align-self-end flex-grow-0" 
                                    : "message align-self-start flex-grow-0"
                            }`}
                            ref={index === messages.length - 1 ? scroll : null}
                        >
                            <span>{message.text}</span>
                            <span className="message-footer">
                                {moment(message.createdAt).calendar()}
                            </span>
                        </Stack>
                    ))
                ) : (
                    <p className="no-messages">No messages yet. Start the conversation!</p>
                )}
            </Stack>
            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    placeholder="Type a message..."
                    fontFamily="Poppins"
                    borderColor="rgba(72, 112, 223, 0.2)"
                />
                <button 
                    className="send-btn" 
                    onClick={() => sendTextMessage(textMessage, user, currentChat._id, setTextMessage)}
                    disabled={!textMessage.trim()}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        className="bi bi-send-fill" 
                        viewBox="0 0 16 16"
                    >
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                    </svg>
                </button>
            </Stack>
        </Card>
    );
};

export default ChatBox;