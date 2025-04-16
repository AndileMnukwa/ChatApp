import { useContext, useState, useRef, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const NotificationAlert = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { 
        notifications, 
        userChats, 
        allUsers, 
        markAllNotificationsAsRead, 
        markNotificationAsRead 
    } = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const notificationsRef = useRef(null);

    const unreadNotifications = unreadNotificationsFunc(notifications);
    const modifiedNotifications = notifications.map((n) => {
        const sender = allUsers.find((user) => user._id === n.senderId);
        return {
            ...n,
            senderName: sender ? sender.name : "Unknown",
        };
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="notifications" ref={notificationsRef}>
            <div 
                className="notifications-icon" 
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                </svg>
                {unreadNotifications?.length > 0 && (
                    <span className="notification-count">
                        <span>{unreadNotifications.length}</span>
                    </span>
                )}
            </div>
            {isOpen && (
                <div className="notifications-box">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        {unreadNotifications?.length > 0 && (
                            <div
                                className="mark-as-read"
                                onClick={() => markAllNotificationsAsRead(notifications)}
                                style={{ cursor: 'pointer' }}
                            >
                                Mark all as read
                            </div>
                        )}
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {modifiedNotifications?.length === 0 ? (
                            <div className="notification">
                                <div className="text-center py-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6C7A9C" className="bi bi-bell-slash mb-2" viewBox="0 0 16 16">
                                        <path d="M5.164 14H15c-.299-.199-.557-.553-.78-1-.9-1.8-1.22-5.12-1.22-6 0-.264-.02-.523-.06-.776l-.938.938c.02-.12.03-.246.03-.374v-.5c0-1.66-1.34-3-3-3-.109 0-.216.006-.323.017l-.73.73c.333-.32.788-.517 1.287-.517 1.03 0 1.87.84 1.87 1.87v.5c0 .185-.012.367-.036.548l-4.67 4.67c.5.023.825.035 1.013.035a2 2 0 0 1-3.256 1.559c.01-.958.817-1.736 1.766-1.736.091 0 .18.01.268.022zm-3.019-2.746L.85 9.1C.758 8.746.707 8.374.707 8c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 11.991 8c0 .386-.018.752-.052 1.113l-1.016-1.016c.011-.314.018-.631.018-.951v-.5a3.7 3.7 0 0 0-3.867-3.866l-1.963 1.963A3.73 3.73 0 0 0 2.941 8c0 .897.363 1.706.952 2.301l-1.534 1.534A3.98 3.98 0 0 0 0 8c0-.63.126-1.25.371-1.847l-1.038-1.038a.75.75 0 0 1 0-1.06l.638-.638a.75.75 0 0 1 1.06 0l14.997 14.996a.75.75 0 0 1 0 1.061l-.638.638a.75.75 0 0 1-1.06 0z"/>
                                    </svg>
                                    <p className="text-muted">No notifications yet</p>
                                </div>
                            </div>
                        ) : (
                            modifiedNotifications.map((n, index) => (
                                <div
                                    key={index}
                                    className={n.isRead ? "notification" : "notification not-read"}
                                    onClick={() => {
                                        markNotificationAsRead(n, userChats, user, notifications);
                                        setIsOpen(false);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots me-2" viewBox="0 0 16 16">
                                            <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                                            <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
                                        </svg>
                                        <span><strong>{n.senderName}</strong> sent you a new message</span>
                                    </div>
                                    <span className="notification-time">{moment(n.date).calendar()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationAlert;