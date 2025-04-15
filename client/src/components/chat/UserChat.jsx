import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg";
import { Stack } from 'react-bootstrap';
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers, notifications, markThisUserNotificationsAsRead } = useContext(ChatContext);
    const [isOnline, setIsOnline] = useState(false);

    const { latestMessage } = useFetchLatestMessage(chat);

    const unreadNotifications = unreadNotificationsFunc(notifications || []);
    const thisUserNotifications = unreadNotifications?.filter(
        n => n.senderId === recipientUser?._id
    ) || [];
    
    useEffect(() => {
        if (recipientUser?._id && onlineUsers?.length > 0) {
            const recipientId = recipientUser._id.toString();
            
            const online = onlineUsers.some(
                (user) => user.userId.toString() === recipientId
            );
            
            setIsOnline(online);
        }
    }, [recipientUser, onlineUsers]);
    
    const truncateText = (text) => {
        let shortText = text.substring(0, 20);

        if (text.length > 20) {
            shortText = shortText + "...";
        }

        return shortText;
    };
    
    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
            onClick={() => {
                if (thisUserNotifications.length !== 0) {
                    markThisUserNotificationsAsRead(thisUserNotifications, notifications);
                }
            }}
        >
            <div className="d-flex">
                <div className="me-2 position-relative">
                    <img src={avatar} height="35px" alt="User" />
                    {isOnline && <span className="user-online"></span>}
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name || "Unknown User"}</div>
                    <div className="text">
                        {latestMessage?.text && (
                            <span>{truncateText(latestMessage?.text)}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    {latestMessage?.createdAt && moment(latestMessage.createdAt).calendar()}
                </div>
                {thisUserNotifications.length > 0 && (
                    <div className="this-user-notifications">
                        {thisUserNotifications.length}
                    </div>
                )}
            </div>
        </Stack>
    );
};

export default UserChat;