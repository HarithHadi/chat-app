import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, User, Bot } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3001");

export function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socketId, setSocketId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        //On connect set socket id 
        const handleConnect = () => {
            // Without this socket.id will exist inside the socket object, but your component won't re-render when it changes.
            setSocketId(socket.id);
        };

        const handleReceiveMessage = (data) => {
            if (data.senderId !== socketId) {
                setMessages(prev => [...prev, data]);
            }
        };

        socket.on("connect", handleConnect);
        socket.on("receive_message", handleReceiveMessage);

        // Cleanup function (stops the function from running forever)
        return () => {
            // Stop calling this handler when event happens
            socket.off("connect", handleConnect);
            socket.off("receive_message", handleReceiveMessage);
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        if(e) e.preventDefault();
        if(!inputMessage.trim()) return;

        const newMessage ={
            id: Date.now(),
            text: inputMessage,
            senderId : socketId,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        };

        setMessages(prev => [...prev, newMessage]);
        socket.emit("send_message", newMessage);
        setInputMessage("");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <Card className="h-[600px] overflow-hidden">
                <div className="flex flex-col h-[calc(600px-80px)]">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-6">
                        <div className="space-y-4 py-4">
                            {messages.map((message) => {
                                const isOwnMessage = message.senderId === socketId;
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-start gap-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`p-2 rounded-full ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            {isOwnMessage ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </div>
                                        <div className={`rounded-lg p-3 ${isOwnMessage ? 'bg-primary text-primary-foreground ml-2' : 'bg-muted mr-2'}`}>
                                            <p className="text-sm">{message.text}</p>
                                            <span className={`text-xs opacity-70 mt-1 block ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                            {message.timestamp}
                                            </span>
                                        </div>
                                        </div>
                                    </div>
                                );
                                })}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="border-t p-4 bg-background">
                        <div className="flex gap-2">
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSendMessage}
                                size="sm"
                                disabled={!inputMessage.trim()}
                                className="px-3"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
