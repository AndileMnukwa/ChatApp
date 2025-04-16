import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

    // Helper function to check if a user is online
    const isUserOnline = (userId) => {
        if (!onlineUsers?.length) return false;
        
        // Convert IDs to strings for reliable comparison
        const userIdStr = userId.toString();
        return onlineUsers.some((user) => user.userId.toString() === userIdStr);
    };

    return (
        <>
            {potentialChats && potentialChats.length > 0 ? (
                <div className="all-users">
                    {potentialChats.map((u, index) => {
                        const online = isUserOnline(u._id);
                        
                        return (
                            <div 
                                className="single-user"
                                key={index}
                                onClick={() => createChat(user._id, u._id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus me-1" viewBox="0 0 16 16">
                                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                    <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                                {u.name}
                                {online && <span className="user-online"></span>}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-muted mb-3">
                    <p>No new users available to chat with at the moment.</p>
                </div>
            )}
        </>
    );
};

export default PotentialChats;