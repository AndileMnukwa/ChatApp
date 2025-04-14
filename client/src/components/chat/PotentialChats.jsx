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
            <div className="all-users">
                {potentialChats && potentialChats.map((u, index) => {
                    const online = isUserOnline(u._id);
                    
                    return (
                        <div 
                            className="single-user"
                            key={index}
                            onClick={() => createChat(user._id, u._id)}
                        >
                            {u.name}
                            {/* Using your existing CSS class without inline styles */}
                            {online && <span className="user-online"></span>}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default PotentialChats;