import { useContext } from 'react';
import { Container, Stack, Row, Col, Card } from 'react-bootstrap';
import { ChatContext } from '../context/ChatContext';
import UserChat from '../components/chat/UserChat';
import { AuthContext } from '../context/AuthContext';
import PotentialChats from '../components/chat/PotentialChats';
import ChatBox from '../components/chat/ChatBox';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);
    
    return (
        <Container fluid="lg">
            <Card className="shadow-sm border-0 mb-4 p-3 bg-transparent">
                <Card.Body className="p-0">
                    <h4 className="mb-3 fw-bold">Start a Conversation</h4>
                    <PotentialChats />
                </Card.Body>
            </Card>
            
            {userChats?.length < 1 ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Card className="text-center shadow-sm border-0 p-4" style={{ maxWidth: '400px' }}>
                        <Card.Body>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#FF5A8E" className="bi bi-chat-dots mb-3" viewBox="0 0 16 16">
                                <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                                <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
                            </svg>
                            <h4>No conversations yet</h4>
                            <p className="text-muted">Start chatting with someone from the list above</p>
                        </Card.Body>
                    </Card>
                </div>
            ) : (
                <Row>
                    <Col md={4} className="mb-4 mb-md-0">
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Header className="bg-white border-bottom">
                                <h5 className="mb-0 fw-bold">Conversations</h5>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Stack className="messages-box">
                                    {isUserChatsLoading ? (
                                        <div className="d-flex justify-content-center align-items-center h-100">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading chats...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        userChats?.map((chat, index) => (
                                            <div key={index} onClick={() => updateCurrentChat(chat)}>
                                                <UserChat chat={chat} user={user} />
                                            </div>
                                        ))
                                    )}
                                </Stack>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={8}>
                        <ChatBox />
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Chat;