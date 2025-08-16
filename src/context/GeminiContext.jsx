import React, { useState, createContext }from 'react'
import { getGeminiResponse } from '../config/Gemini'; 

export const GeminiContext = createContext();

const ContextProvider = ({ children }) => {
    const [userInput, setUserInput] = useState("");
    const [geminiOutput, setGeminiOutput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const[showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
      if (!userInput.trim()) return;
      setLoading(true);
      setGeminiOutput("");
      setShowResult(true);
      setRecentPrompt(userInput);

      const Input = userInput;
      try {
        setUserInput("");
        const response = await getGeminiResponse(Input);
        setGeminiOutput(response);
      } catch (err) {
        console.error("Error:", err);
        setGeminiOutput("Error getting response from Gemini API.");
      }
      setLoading(false);
    };

    
    const contextValue = {
      userInput,
      setUserInput,
      geminiOutput, 
      recentPrompt,
      setRecentPrompt,
      prevPrompts,
      setPrevPrompts,
      showResult,
      loading,
      handleSend,
    }

    return (
      <GeminiContext.Provider value={contextValue}>
        {children}
      </GeminiContext.Provider>
    );
};

export default ContextProvider