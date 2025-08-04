import React from 'react';
import './Header.css';

const Header = ({ onLoadWorldQuest, onLoadPersona, onRestartWorld, onShowConfig }) => {
  return (
    <header className="app-header">
      <h1>Live NPC Engine</h1>
      <div className="header-buttons">
        <button onClick={onLoadWorldQuest} className="load-btn">
          📜 Load World Quest
        </button>
        <button onClick={onLoadPersona} className="load-btn">
          👥 Load Persona
        </button>
        <button onClick={onRestartWorld} className="restart-btn">
          🔄 Restart World
        </button>
        <button onClick={onShowConfig} className="config-btn">
          ⚙️ AI Engine Config
        </button>
      </div>
    </header>
  );
};

export default Header;