import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import { API_BASE_URL, API_ORIGIN } from "../api";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import "./Messages.css";

const socket = io(API_ORIGIN);

export default function MessagesPage() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    // We expect state to pass { hostId, hostName } if coming from a listing
    const passedData = location.state || {};
    
    // For a real app, you'd fetch all conversations. For this demo, 
    // we use a single room based on the guest + host ID.
    const [currentRoom, setCurrentRoom] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        let room = "";
        if (passedData.hostId) {
            // Guest initiating chat with host
            room = `room_${user._id}_${passedData.hostId}`;
        } else if (user.isSuperhost) {
            // Dummy room for host view if they just click messages
            room = `room_demo_guest_${user._id}`;
        } else {
            // Dummy room for guest
            room = `room_${user._id}_host_demo`;
        }
        
        setCurrentRoom(room);
        socket.emit("join_room", room);

        // Fetch history
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/messages/${room}`, { credentials: "include" });
                if (!res.ok) throw new Error("Unable to load message history");
                const messages = await res.json();
                setMessages(messages);
            } catch (e) {
                console.error(e);
            }
        };
        fetchHistory();

        // Listen for new messages
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, [user, passedData.hostId, navigate]);

    useEffect(() => {
        // Auto scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (currentMessage.trim() !== "") {
            const messageData = {
                room: currentRoom,
                sender: user.username,
                text: currentMessage,
            };
            await socket.emit("send_message", messageData);
            // Optimistic update
            setMessages((prev) => [...prev, { ...messageData, createdAt: new Date() }]);
            setCurrentMessage("");
        }
    };

    if (!user) return null;

    return (
        <div className="wh-messages-layout">
            {/* Sidebar with conversations list */}
            <div className="wh-messages-sidebar">
                <h2>Messages</h2>
                <div className="wh-conversation-item active">
                    <FaUserCircle className="wh-convo-avatar" />
                    <div className="wh-convo-details">
                        <h4>{passedData.hostName || (user.isSuperhost ? "Guest Inquiry" : "Host Support")}</h4>
                        <p>Click to view chat...</p>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="wh-chat-area">
                <div className="wh-chat-header">
                    <h3>Chat with {passedData.hostName || (user.isSuperhost ? "Guest" : "Host")}</h3>
                </div>
                
                <div className="wh-chat-messages">
                    {messages.length === 0 ? (
                        <div className="wh-no-messages">
                            <p>Send a message to start the conversation.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMine = msg.sender === user.username;
                            return (
                                <div key={index} className={`wh-message-bubble-wrapper ${isMine ? "mine" : "theirs"}`}>
                                    <div className={`wh-message-bubble ${isMine ? "mine" : "theirs"}`}>
                                        <span className="wh-msg-sender">{isMine ? "You" : msg.sender}</span>
                                        <p>{msg.text}</p>
                                        <span className="wh-msg-time">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="wh-chat-input-area">
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Type a message..."
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button onClick={sendMessage} className="wh-send-btn">
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
}
