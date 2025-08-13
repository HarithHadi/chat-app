import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, User, Bot } from 'lucide-react';

export function Chat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! How can I help you today?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: messages.length + 1, 
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');

        // Simulate bot responses
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: "Thanks for the message! This is a demo response.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botResponse]);        
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSendMessage(e);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <Card className="h-[600px] overflow-hidden">
                
                <div className="flex flex-col h-[calc(600px-80px)]">
                    {/* Messages Area - Fixed height calculation */}
                    <div className="flex-1 overflow-y-auto px-6">
                        <div className="space-y-4 py-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`flex items-start gap-2 max-w-[70%] ${
                                            message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-full ${
                                            message.sender === 'user' 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'bg-muted'
                                        }`}>
                                            {message.sender === 'user' ? (
                                                <User className="h-4 w-4" />
                                            ) : (
                                                <Bot className="h-4 w-4" />
                                            )}
                                        </div>
                                        
                                        <div className={`rounded-lg p-3 ${
                                            message.sender === 'user'
                                                ? 'bg-primary text-primary-foreground ml-2'
                                                : 'bg-muted mr-2'
                                        }`}>
                                            <p className="text-sm">{message.text}</p>
                                            <span className={`text-xs opacity-70 mt-1 block ${
                                                message.sender === 'user' ? 'text-right' : 'text-left'
                                            }`}>
                                                {message.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
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