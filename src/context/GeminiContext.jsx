import React, { useState, createContext, useEffect, useRef } from 'react';
import { getGeminiResponse } from '../config/Gemini';

export const GeminiContext = createContext();

const genId = () => Date.now() + Math.floor(Math.random() * 1000000);

const ContextProvider = ({ children }) => {
  // --- Multi-chat state ---
  const firstIdRef = useRef(Date.now());
  const [chats, setChats] = useState([]);

  const [activeChatId, setActiveChatId] = useState(firstIdRef.current);

  // --- UI state ---
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentPrompt, setRecentPrompt] = useState('');

  // --- typing control ---
  const intervalRef = useRef(null);
  const [typedOutput, setTypedOutput] = useState('');

  const stopTyping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Type into a specific message of a specific chat
  const startTyping = (fullText, chatId, messageId, speed = 15) => {
    stopTyping();
    if (!fullText) return;

    setTypedOutput('');

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i < fullText.length) {
        const ch = fullText[i];
        setChats(prev =>
          prev.map(chat =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map(m =>
                    m.id === messageId ? { ...m, text: m.text + ch} : m
                  )
                }
              : chat
          )
        );
        i += 1;
      } else {
        stopTyping();
      }
    }, speed);
  };

  useEffect(() => () => stopTyping(), []);

  const setActiveChatTitleIfNeeded = (chat, firstPrompt) => {
    if (chat.title === 'New Chat' && firstPrompt) {
      return { ...chat, title: firstPrompt.slice(0, 28) };
    }
    return chat;
  };

  const handleNewChat = () => {
    const id = genId();
    const newChat = { id, title: 'New Chat', messages: [] };
    setChats(prev => [...prev, newChat]);
    setActiveChatId(id);
    setShowResult(false);
    setUserInput('');
    stopTyping();
  };

  const handleSend = async (customPrompt) => {
    const prompt = (customPrompt ?? userInput).trim();
    if (!prompt) return;

    const currentChatId = activeChatId;

    // 1) append USER message
    setChats(prev =>
      prev.map(chat => {
        if (chat.id !== currentChatId) return chat;
        const updated = {
          ...chat,
          messages: [
            ...chat.messages,
            { id: genId(), sender: 'user', text: prompt }
          ]
        };
        return setActiveChatTitleIfNeeded(updated, prompt);
      })
    );

    setUserInput('');
    setShowResult(true);
    setLoading(true);

    // 2) append AI placeholder message we will type into
    const botMsgId = genId();
    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { id: botMsgId, sender: 'ai', text: ''}
              ]
            }
          : chat
      )
    );

    try {
      // 3) fetch AI response
      const response = await getGeminiResponse(prompt);

      // 4) start typing into that placeholder
      startTyping(response || '', currentChatId, botMsgId, 15);
    } catch (e) {
      const fallback = 'Error getting response from Gemini API.';
      // type the error so UI behavior is consistent
      startTyping(fallback, currentChatId, botMsgId, 15);
      console.error(e);
    } finally {
      // loader shows only during fetch (optional)
      setLoading(false);
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  // Load chats on mount
  useEffect(() => {
    const saved = localStorage.getItem("chats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChats(parsed);
        if (parsed.length > 0) setActiveChatId(parsed[0].id);
      } catch (err) {
        console.error("Error parsing saved chats:", err);
        setChats([]);
      }
    } else {
      // If nothing in storage, create one default chat
      const firstId = Date.now();
      const defaultChat = { id: firstId, title: "New Chat", messages: [] };
      setChats([defaultChat]);
      setActiveChatId(firstId);
    }
  }, []);


  // Save chats whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats]);


  const contextValue = {
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
  };

  return (
    <GeminiContext.Provider value={contextValue}>
      {children}
    </GeminiContext.Provider>
  );
};

export default ContextProvider;