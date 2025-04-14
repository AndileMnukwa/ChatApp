import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg";
import { Stack } from 'react-bootstrap';
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers } = useContext(ChatContext);
    const [isOnline, setIsOnline] = useState(false);
    
    useEffect(() => {
        if (recipientUser?._id && onlineUsers?.length > 0) {
            // Convert IDs to strings for reliable comparison
            const recipientId = recipientUser._id.toString();
            
            // Check if the recipient is online
            const online = onlineUsers.some(
                (user) => user.userId.toString() === recipientId
            );
            
            setIsOnline(online);
            console.log(`User ${recipientUser.name} online status:`, online);
        }
    }, [recipientUser, onlineUsers]);
    
    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
        >
            <div className="d-flex">
                <div className="me-2 position-relative">
                    <img src={avatar} height="35px" alt="User" />
                    {/* Using your existing CSS class without inline styles */}
                    {isOnline && <span className="user-online"></span>}
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name || "Unknown User"}</div>
                    <div className="text">Text Message</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">12/12/2022</div>
                <div className="this-user-notifications">2</div>
            </div>
        </Stack>
    );
};

export default UserChat;