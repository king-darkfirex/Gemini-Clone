import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { GeminiContext } from '../../context/GeminiContext';

const Sidebar = () => {
  const [extended, setExtended] = useState(false);

  const {
    chats,
    activeChatId,
    setActiveChatId,
    handleNewChat,
  } = useContext(GeminiContext);

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended(prev => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt="Menu Icon"
        />

        <div className="new-chat" onClick={handleNewChat} style={{ cursor: 'pointer' }}>
          <img src={assets.plus_icon} alt="New chat" />
          {extended ? <p>New Chat</p> : null}
        </div>

        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>

            {chats.length === 0 && (
              <div className="recent-entry">
                <p>No chats yet</p>
              </div>
            )}

            {chats.map(chat => (
              <div
                key={chat.id}
                className={`recent-entry ${chat.id === activeChatId ? 'active' : ''}`}
                onClick={() => setActiveChatId(chat.id)}
                style={{ cursor: 'pointer' }}
              >
                <img src={assets.message_icon} alt="" />
                <p>{(chat.title || 'New Chat').slice(0, 16)}{(chat.title || '').length > 16 ? '…' : ''}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
