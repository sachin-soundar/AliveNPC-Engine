import React from 'react';
import NPCCard from '../NPCCard/NPCCard';
import StatsDisplay from '../StatsDisplay/StatsDisplay';
import './NPCList.css';

const NPCList = ({ 
  npcs, 
  previousNpcs, 
  flashAnimation, 
  apiCallCount, 
  rateLimitError 
}) => {
  return (
    <div className="left-panel">
      <h2>NPCs ({npcs.length})</h2>
      
      <StatsDisplay 
        npcs={npcs}
        apiCallCount={apiCallCount}
        rateLimitError={rateLimitError}
      />
      
      <div className={`npc-list ${flashAnimation ? 'flash-animation' : ''}`}>
        {npcs.map(npc => {
          const previousNpc = previousNpcs.find(prevNpc => prevNpc.id === npc.id);
          return (
            <NPCCard 
              key={npc.id}
              npc={npc}
              previousNpc={previousNpc}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NPCList;