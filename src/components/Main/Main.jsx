import React, { useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { getGeminiResponse } from '../../config/gemini'; // adjust path if needed

const Main = () => {
  const [userInput, setUserInput] = useState("");
  const [geminiOutput, setGeminiOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    try {
      const response = await getGeminiResponse(userInput);
      setGeminiOutput(response);
    } catch (err) {
      console.error("Error:", err);
      setGeminiOutput("Error getting response from Gemini API.");
    }
    setLoading(false);
  };

  return (
    <div className='main'>
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>

      <div className="main-container">
        <div className="greet">
          <p><span>Hello, Tanmay</span></p>
          <p>How can I help you today?</p>
        </div>

        {/* Loading and Response */}
        {loading && <p>Loading...</p>}
        {!loading && geminiOutput && (
          <div className="response-box">
            <p>{geminiOutput}</p>
          </div>
        )}

        <div className="cards">
          <div className="card">
            <p>Suggest some beautiful songs to listen on a road trip</p>
            <img src={assets.compass_icon} alt="" />
          </div>

          <div className="card">
            <p>Briefly summarise this concept: Urban Planning</p>
            <img src={assets.bulb_icon} alt="" />
          </div>

          <div className="card">
            <p>Brainstorm team bonding activities for our work retreat</p>
            <img src={assets.message_icon} alt="" />
          </div>

          <div className="card">
            <p>Improve the readability of the following code</p>
            <img src={assets.code_icon} alt="" />
          </div>
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder='Enter a prompt here'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img
                src={assets.send_icon}
                alt="send"
                onClick={handleSend}
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
