import React, { useState, createContext, useEffect, useRef}from 'react'
import { getGeminiResponse } from '../config/Gemini'; 

export const GeminiContext = createContext();

const ContextProvider = ({ children }) => {
    const [userInput, setUserInput] = useState("");
    const [geminiOutput, setGeminiOutput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [typedOutput, setTypedOutput] = useState("");

    const intervalRef = useRef(null);

    const startTyping = (text, speed = 15) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setTypedOutput("");

      // Use -1 so that the very first increment (0) correctly starts at text[0]
      let index = -1;

      intervalRef.current = setInterval(() => {
        // Guard: stop typing if text is empty/null
        if (!text || index >= text.length - 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return;
        }

        index++;
        setTypedOutput((prev) => prev + text[index]);
      }, speed);
    };

    // Whenever geminiOutput changes, auto trigger typing
    useEffect(() => {
    if (geminiOutput) {
      startTyping(geminiOutput);
    }
  }, [geminiOutput]);



    useEffect(() => {
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, []);

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
      typedOutput
    }

    return (
      <GeminiContext.Provider value={contextValue}>
        {children}
      </GeminiContext.Provider>
    );
};

export default ContextProvider