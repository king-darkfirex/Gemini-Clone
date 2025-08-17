import React, { use, useContext, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { GeminiContext } from '../../context/GeminiContext';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Main = () => {
  const {handleSend,recentPrompt,showResult,loading,userInput,typedOutput,setUserInput } = useContext(GeminiContext);

  return (
    <div className='main'>
      <div className="nav">
        <div className="Gemini">
          <img src={assets.gemini_icon} alt="" />
          <p>Gemini</p>
        </div>
        <img src={assets.user_icon} alt="" />
      </div>

      <div className="main-container">
        {!showResult ? 
            <>
              <div className="greet">
                <p><span>Hello, Tanmay</span></p>
                <p>How can I help you today?</p>
              </div>

              <div className="cards">
                <div className="card">
                  <p onClick={() =>{
                    handleSend("Summarize the book 'Atomic Habits'")}}>
                    📚 Summarize the book 'Atomic Habits'</p>
                  <img src={assets.compass_icon} alt="" />
                </div>

                <div className="card">
                  <p onClick={() => {handleSend("Write a professional email for a job application")}}>
                    📝 Write a professional email for a job application</p>
                  <img src={assets.bulb_icon} alt="" />
                </div>

                <div className="card">
                  <p onClick={()=>{handleSend("What are the latest trends in web development")}}>
                      💻 What are the latest trends in web development?</p>
                  <img src={assets.message_icon} alt="" />
                </div>

                <div className="card">
                  <p onClick={()=>{handleSend("Plan a 3-day budget trip to Goa")}}>
                    🌍 Plan a 3-day budget trip to Goa</p>
                  <img src={assets.code_icon} alt="" />
                </div>
              </div>
            </> 
          :
            <div className="response-box">
              <div className="result-title">
                <img src={assets.user_icon} alt="" />
                <div className="prompt">
                    <p>{recentPrompt}</p>
                </div>
              </div>

              <div className="result-data">
                <img src={assets.gemini_icon} alt="Gemini" />
                {loading ? (
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                ) : (
                    <div className="md">
                      <ReactMarkdown>{typedOutput}</ReactMarkdown>
                    </div>
                )}
              </div>
            </div>
          }

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder='Enter a prompt here'
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img
                src={assets.send_icon}
                alt="send"
                onClick={() => handleSend}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <p className="bottom-info">
            Gemini may display inaccurate information, including about people,
            so double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};


export default Main;
