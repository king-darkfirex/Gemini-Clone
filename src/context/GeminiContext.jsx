import React, { useState, createContext, useEffect, useRef } from 'react';
import { getGeminiResponse } from '../config/Gemini';

export const GeminiContext = createContext();

const ContextProvider = ({ children }) => {
  // ----- Multi-chat state -----
  const firstIdRef = useRef(Date.now());
  const [chats, setChats] = useState([
    { id: firstIdRef.current, title: 'New Chat', messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState(firstIdRef.current);

  // ----- UI / input state you already had -----
  const [userInput, setUserInput] = useState('');
  const [geminiOutput, setGeminiOutput] = useState(''); // full text, if you still use it
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // ----- Typing effect -----
  const [typedOutput, setTypedOutput] = useState('');
  const intervalRef = useRef(null);

  const stopTyping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Safe, readable typing effect: pre-increment from -1
  const startTyping = (text, speed = 15) => {
    stopTyping();               // clear any previous interval
    setTypedOutput('');         // reset display

    let index = -1;             // using -1 so first tick becomes 0
    intervalRef.current = setInterval(() => {
      if (!text) {
        stopTyping();
        return;
      }
      index++;                  // first run -> 0
      if (index < text.length) {
        setTypedOutput(prev => prev + text[index]);
      } else {
        stopTyping();           // finished cleanly, no "undefined"
      }
    }, speed);
  };

  useEffect(() => {
    if (geminiOutput) startTyping(geminiOutput);
  }, [geminiOutput]);

  useEffect(() => {
    return () => stopTyping();  // cleanup on unmount
  }, []);

  // Helpers
  const setActiveChatTitleIfNeeded = (chat, firstPrompt) => {
    if (chat.title === 'New Chat' && firstPrompt) {
      return { ...chat, title: firstPrompt.slice(0, 32) };
    }
    return chat;
  };

  const handleNewChat = () => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const newChat = { id, title: 'New Chat', messages: [] };
    setChats(prev => [...prev, newChat]);
    setActiveChatId(id);
    setShowResult(false);
    setUserInput('');
    setGeminiOutput('');
    setTypedOutput('');
    stopTyping();
  };

  const handleSend = async () => {
    const text = userInput.trim();
    if (!text) return;

    setLoading(true);
    setShowResult(true);

    // 1) Append user message and title (if first)
    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id !== activeChatId) return chat;
        const updated = {
          ...chat,
          messages: [...chat.messages, { role: 'user', text }]
        };
        return setActiveChatTitleIfNeeded(updated, text);
      })
    );

    // clear input for UI
    setUserInput('');

    try {
      // 2) Get AI response
      const response = await getGeminiResponse(text);
      setGeminiOutput(response); // triggers typing effect

      // 3) Append AI message to active chat
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, { role: 'ai', text: response }] }
            : chat
        )
      );
    } catch (err) {
      console.error('Gemini error:', err);
      const fallback = 'Error getting response from Gemini API.';
      setGeminiOutput(fallback);
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, { role: 'ai', text: fallback }] }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Derived helper to get the active chat quickly in your Main
  const activeChat = chats.find(c => c.id === activeChatId);

  const contextValue = {
    // Chat system
    chats,
    activeChatId,
    setActiveChatId,
    activeChat,
    handleNewChat,

    // Typing / API
    userInput,
    setUserInput,
    handleSend,
    loading,
    showResult,
    typedOutput,
    geminiOutput, // keep if you still use it elsewhere
  };

  return (
    <GeminiContext.Provider value={contextValue}>
      {children}
    </GeminiContext.Provider>
  );
};

export default ContextProvider;
