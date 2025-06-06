'use client'

import React, { useState, useRef, useEffect, FormEvent } from 'react';

interface Message {
    sender: 'You' | 'CloudShareBot';
    text: string;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const chatRef = useRef<HTMLDivElement>(null);

    const appendMessage = (sender: Message['sender'], text: string) => {
        setMessages(prev => [...prev, { sender, text }]);
    };

    async function callGemini(text: string) {
        const body = {
            system_instruction: {
                parts: [
                    {
                        text: `You are CloudShareBot, an assistant for a cloud sharing app. Reply in 1–2 lines. Help users upload files, send messages, and use the dashboard. Don't mention tech unless asked. The app works without login, like AirDrop. If asked about tech, say: We use Firebase, Cloudinary, Next.js (TypeScript), and Docker.`
                    }
                ]
            },
            contents: [
                {
                    parts: [{ text }]
                }
            ]
        };

        const API_KEY = "AIzaSyDakwOR9JwtJz2AtdO6Qfpcf3c9tfQgPC8";

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );

            const data = await res.json();
            if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                console.error('Invalid response from Gemini:', data);
                return "Sorry, I couldn't understand your request. Please try rephrasing.";
            }

            return data.candidates[0].content.parts[0].text;

        } catch (err) {
            console.error(err);
            return "Oops! Something went wrong. Please try again later.";
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage) return;

        appendMessage('You', userMessage);
        setInput('');

        const lowercaseMessage = userMessage.toLowerCase();
        const greetings = ['hi', 'hello', 'hey', 'salam', 'assalamualaikum'];
        const techQuestions = [
            'what language is used behind this project',
            'which technologies are used',
            'what is the tech stack'
        ];

       
        // Call Gemini for all other queries
        const botReply = await callGemini(userMessage);
        appendMessage('CloudShareBot', botReply);
    };

    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="max-w-xl mx-auto p-6 bg-black text-white rounded shadow">
            <div
                id="chat"
                ref={chatRef}
                className="bg-black border border-white rounded p-4 space-y-4 h-96 overflow-y-auto scrollbar-hide"
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={msg.sender === 'You' ? 'text-right' : 'text-left'}
                    >
                        <div
                            className={`inline-block rounded px-4 py-2 border ${msg.sender === 'You' ? 'bg-white text-black' : 'bg-black text-white border-white'
                                }`}
                        >
                            <strong>{msg.sender}:</strong> {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-white bg-black text-white rounded shadow-sm focus:outline-none placeholder-gray-400"
                    required
                />
                <button
                    type="submit"
                    className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chatbot;
