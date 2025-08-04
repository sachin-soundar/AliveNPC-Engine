import React from 'react';
import './StatsDisplay.css';

const StatsDisplay = ({ npcs, apiCallCount, rateLimitError }) => {
  const getGroupedStats = () => {
    const houseStats = {};
    const genderStats = {};
    const locationStats = {};
    
    npcs.forEach(npc => {
      const house = npc.house.replace('House ', '');
      houseStats[house] = (houseStats[house] || 0) + 1;
      genderStats[npc.gender] = (genderStats[npc.gender] || 0) + 1;
      const location = npc.location || 'Unknown';
      locationStats[location] = (locationStats[location] || 0) + 1;
    });
    
    return { houseStats, genderStats, locationStats };
  };

  const { houseStats, genderStats, locationStats } = getGroupedStats();

  const getRateLimitClass = () => {
    if (rateLimitError) return 'rate-limit-error';
    if (apiCallCount >= 7) return 'rate-limit-warning';
    return 'rate-limit-ok';
  };

  return (
    <div className="stats-display">
      <div className="stat-group">
        <strong>Houses:</strong> {Object.entries(houseStats).map(([house, count]) => `${house}(${count})`).join(', ')}
      </div>
      <div className="stat-group">
        <strong>Gender:</strong> {Object.entries(genderStats).map(([gender, count]) => `${gender}(${count})`).join(', ')}
      </div>
      <div className="stat-group">
        <strong>Locations:</strong> {Object.entries(locationStats).map(([location, count]) => `${location}(${count})`).join(', ')}
      </div>
      <div className="stat-group rate-limit-status">
        <strong>API Usage:</strong> 
        <span className={getRateLimitClass()}>
          {apiCallCount}/10 calls this minute
        </span>
        {rateLimitError && (
          <span className="rate-limit-message"> ⚠️ Rate limit reached - using simulation mode</span>
        )}
      </div>
    </div>
  );
};

export default StatsDisplay;