import React, { useState, useRef, useEffect } from 'react';
import { BsChatDots, BsX, BsSend } from 'react-icons/bs';
import api from '../utils/api';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you find your dream property today?', animated: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [conversationState, setConversationState] = useState('greeting');
    const [widgetVisible, setWidgetVisible] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Show widget after page load with animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setWidgetVisible(true);
        }, 1000); // Show after 1 second

        return () => clearTimeout(timer);
    }, []);

    // Handle scroll events to show/hide scroll to bottom button
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            // Show button if scrolled up more than 100px from bottom
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
            setShowScrollToBottom(!isNearBottom);
        }
    };

    // Set up scroll listener when container is available
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container && isOpen) {
            // Initial check
            handleScroll();

            // Add scroll listener
            container.addEventListener('scroll', handleScroll, { passive: true });

            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, [isOpen]); // Re-run when chat opens/closes

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;

            // Only scroll if there's content to scroll
            if (container.scrollHeight > container.clientHeight) {
                // Try scrollTo first, fallback to scrollIntoView
                try {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'smooth'
                    });
                } catch (error) {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }

                // Hide scroll button after scrolling to bottom
                setTimeout(() => setShowScrollToBottom(false), 500);
            }
        }
    };



    // Auto-scroll to bottom when new messages arrive or chat opens
    useEffect(() => {
        if (isOpen && messages.length > 0) {
            // Delay scrolling to allow animations to complete
            const scrollDelay = messages.length === 1 ? 300 : 500; // Longer delay for initial load
            const timeoutId = setTimeout(() => {
            scrollToBottom();
            }, scrollDelay);

            return () => clearTimeout(timeoutId);
        }
    }, [messages, isOpen]);

    // Scroll to bottom when chat first opens (for existing messages)
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                scrollToBottom();
            }, 400); // Wait for chat widget animation to complete
        }
    }, [isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input, animated: true };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const payload = {
                message: userMessage.content,
                sessionId: sessionId
            };

            const response = await api.post('/ai/chat', payload);

            // Simulate typing delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

            const botMessage = {
                role: 'assistant',
                content: response.data.reply,
                type: response.data.type,
                properties: response.data.properties,
                animated: false // Will animate in
            };

            setIsTyping(false);
            setMessages((prev) => [...prev, botMessage]);

            // Update session state
            if (response.data.sessionId && !sessionId) {
                setSessionId(response.data.sessionId);
            }
            if (response.data.conversationState) {
                setConversationState(response.data.conversationState);
            }

            // Handle different response types with animation delays
            if (response.data.type === 'search_results' && response.data.properties?.length > 0) {
                // Add property cards for search results with staggered animation
                const propertyCards = response.data.properties.slice(0, 3).map((property, index) => ({
                    role: 'assistant',
                    content: `🏠 **${property.title}**\n💰 ${formatPrice(property.price)}\n📍 ${property.location?.city || 'Rajkot'}\n🛏️ ${property.bedrooms} BHK`,
                    type: 'property_card',
                    property: property,
                    animated: false
                }));

                if (propertyCards.length > 0) {
                    propertyCards.forEach((card, index) => {
                        setTimeout(() => {
                            setMessages((prev) => [...prev, card]);
                        }, 800 + (index * 300)); // Staggered appearance
                    });
                }
            }

        } catch (error) {
            console.error('Chat error:', error);
            setIsTyping(false);
            let errorMessage = 'Sorry, I am having trouble connecting right now.';
            if (error.response && error.response.status === 503) {
                errorMessage = 'The AI service is currently not configured correctly. Please contact admin.';
            } else if (error.response?.data?.reply) {
                errorMessage = error.response.data.reply;
            }
            setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage, animated: false }]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            {/* Animation Styles */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes typewriter {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .animate-slide-in {
                    animation: slideIn 0.5s ease-out;
                }

                .animate-slide-in-right {
                    animation: slideInRight 0.4s ease-out;
                }

                .animate-slide-in-left {
                    animation: slideInLeft 0.4s ease-out;
                }

                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-bounce-in {
                    animation: bounceIn 0.6s ease-out;
                }

                .animate-slide-up {
                    animation: slideUp 0.4s ease-out 0.2s both;
                }

                .animate-fade-in-delayed {
                    animation: fadeIn 0.4s ease-out 0.3s both;
                }

                .animate-fade-in-delayed-2 {
                    animation: fadeIn 0.4s ease-out 0.5s both;
                }

                .animate-fade-in-delayed-3 {
                    animation: fadeIn 0.4s ease-out 0.7s both;
                }

                .animate-message-appear {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-typewriter {
                    animation: typewriter 0.8s ease-out;
                }

                /* Custom scrollbar styles */
                .scrollbar-thin {
                    scrollbar-width: thin;
                }

                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }

                .scrollbar-thin::-webkit-scrollbar-track {
                    background: #f9fafb;
                    border-radius: 10px;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }

                /* Smooth scrolling for the container */
                .messages-container {
                    scroll-behavior: smooth;
                }

                /* Scroll to bottom button animation */
                .scroll-to-bottom-btn {
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .scroll-to-bottom-btn:hover {
                    transform: scale(1.1);
                }

                /* Ensure messages container is scrollable */
                .messages-container {
                    position: relative;
                    overflow-y: auto !important;
                    overflow-x: hidden;
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                }

                /* Prevent text selection issues */
                .messages-container * {
                    user-select: text;
                    -webkit-user-select: text;
                    -moz-user-select: text;
                    -ms-user-select: text;
                }

                /* Chat widget open/close animation */
                .chat-widget-enter-active {
                    animation: chatWidgetSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @keyframes chatWidgetSlideIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.7) translateY(30px) rotate(5deg);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05) translateY(-5px) rotate(0deg);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0) rotate(0deg);
                    }
                }

                /* Chat button pulse animation */
                .chat-button-pulse {
                    animation: chatButtonPulse 2s infinite;
                }

                @keyframes chatButtonPulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                    }
                }

                /* Typing indicator enhanced */
                .typing-dots {
                    display: flex;
                    gap: 4px;
                }

                .typing-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #9ca3af;
                    animation: typingDot 1.4s infinite ease-in-out;
                }

                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                .typing-dot:nth-child(3) { animation-delay: 0s; }

                @keyframes typingDot {
                    0%, 80%, 100% {
                        transform: scale(0.8);
                        opacity: 0.6;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>

            <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans transition-all duration-500 ${widgetVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-100 flex flex-col chat-widget-enter-active">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <div>
                            <h3 className="font-semibold text-sm tracking-wide">AI Assistant</h3>
                                <p className="text-xs text-blue-100 opacity-90">
                                    {conversationState === 'greeting' && 'Ready to help!'}
                                    {conversationState === 'gathering_requirements' && 'Gathering your preferences'}
                                    {conversationState === 'searching' && 'Searching properties...'}
                                    {conversationState === 'showing_results' && 'Found some matches!'}
                                    {conversationState === 'negotiating' && 'Discussing terms'}
                                    {conversationState === 'scheduling_visit' && 'Planning your visit'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="text-white hover:text-gray-200 transition-colors focus:outline-none"
                        >
                            <BsX size={24} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={messagesContainerRef}
                        className="relative flex-1 p-4 min-h-0 h-80 max-h-80 overflow-y-auto bg-gray-50 flex flex-col space-y-3 scrollbar-thin messages-container"
                        style={{
                            minHeight: '320px',
                            maxHeight: '320px',
                            overflowY: 'auto',
                            scrollBehavior: 'smooth'
                        }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
                                style={{
                                    animationDelay: msg.animated === false ? '0ms' : `${index * 100}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                {msg.type === 'property_card' && msg.property ? (
                                    <div className="max-w-[85%] bg-white rounded-xl shadow-md border border-gray-200 p-3 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 animate-bounce-in">
                                                <span className="text-blue-600 text-lg">🏠</span>
                                            </div>
                                            <div className="flex-1 min-w-0 animate-slide-up">
                                                <h4 className="font-semibold text-gray-900 text-sm truncate">{msg.property.title}</h4>
                                                <div className="mt-1 space-y-1">
                                                    <div className="flex items-center text-xs text-gray-600 animate-fade-in-delayed">
                                                        <span className="mr-2">💰</span>
                                                        <span>{formatPrice(msg.property.price)}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-600 animate-fade-in-delayed-2">
                                                        <span className="mr-2">📍</span>
                                                        <span>{msg.property.location?.city || 'Rajkot'}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-600 animate-fade-in-delayed-3">
                                                        <span className="mr-2">🛏️</span>
                                                        <span>{msg.property.bedrooms} BHK</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm animate-message-appear ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none animate-slide-in-right'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none animate-slide-in-left'
                                            }`}
                                    >
                                        <div className="whitespace-pre-line animate-typewriter">{msg.content}</div>
                                </div>
                                )}
                            </div>
                        ))}

                        {/* Enhanced Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="typing-dots">
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                        </div>
                                        <span className="text-gray-500 text-xs animate-pulse">AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm flex items-center space-x-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />

                        {/* Scroll to Bottom Button */}
                        {showScrollToBottom && (
                            <button
                                onClick={scrollToBottom}
                                className="scroll-to-bottom-btn absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 animate-bounce-in"
                                title="Scroll to bottom"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {conversationState === 'greeting' && messages.length <= 2 && (
                        <div className="px-3 py-2 bg-blue-50 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setInput('Find 3BHK apartments in Rajkot')}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                                >
                                    🏠 3BHK in Rajkot
                                </button>
                                <button
                                    onClick={() => setInput('Show me villas under 2 crores')}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                                >
                                    🏡 Villas &lt; 2Cr
                                </button>
                                <button
                                    onClick={() => setInput('Commercial properties for rent')}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                                >
                                    🏢 Commercial
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Input Area */}
                    <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                conversationState === 'gathering_requirements' ? 'Tell me your budget, location, or preferences...' :
                                conversationState === 'showing_results' ? 'Ask for details, negotiate, or schedule a visit...' :
                                'Ask about properties...'
                            }
                            className="flex-1 bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            <BsSend size={16} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className={`bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center focus:outline-none ring-4 ring-blue-50 ${!isOpen ? 'chat-button-pulse' : ''}`}
                style={{
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                <BsChatDots
                    size={24}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}`}
                />
                <BsX
                    size={28}
                    className={`absolute transition-transform duration-300 ${isOpen ? 'rotate-0 scale-100' : 'rotate-180 scale-0'}`}
                />
            </button>
        </div>
        </>
    );
};

export default ChatWidget;
