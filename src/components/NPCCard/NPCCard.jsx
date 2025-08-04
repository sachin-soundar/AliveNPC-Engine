import React from 'react';
import './NPCCard.css';

const NPCCard = ({ npc, previousNpc }) => {
  const traits = npc.traits;
  const relationships = npc.relationships || [];
  const relationshipText = relationships
    .map(rel => `👨‍👦 ${rel.npc_id} ${rel.relationship_type} Str${rel.strength}`)
    .join(' ') || '';
  
  const genderIcon = npc.gender === 'male' ? '👨M' : '👩F';
  const houseShort = npc.house.replace('House ', '');
  const houseLower = houseShort.toLowerCase();
  
  const formatTooltipData = (npcData) => {
    if (!npcData) return 'No previous data available';
    const prevTraits = npcData.traits;
    return `Previous State:\nHonor: ${prevTraits.honor} Loyal: ${prevTraits.loyalty} IQ: ${prevTraits.intelligence} EQ: ${prevTraits.emotional_intelligence}\nEvil: ${prevTraits.evil} Selfless: ${prevTraits.selflessness} Ambition: ${prevTraits.ambition}\nCombat: ${prevTraits.combat_skill} Political: ${prevTraits.political_cunning} Religion: ${prevTraits.religious_devotion}\nLocation: ${npcData.location || 'Unknown'} Status: ${npcData.status}\nBehavior: ${npcData.current_action || npcData.current_behavior || 'Idle'}`;
  };
  
  return (
    <div 
      className={`npc-card-two-line npc-card-${houseLower}`}
      title={formatTooltipData(previousNpc)}
    >
      <img 
        src={`/${houseLower}.png`} 
        alt={`${houseShort} sigil`}
        className="npc-house-image"
      />
      <div className="npc-content">
        <div className="npc-line-1">
          id: {npc.id} name: {npc.name} 🏠 {houseShort} 🔞{npc.age} {genderIcon} 💼 {npc.role} | Honor: {traits.honor} Loyal: {traits.loyalty} IQ: {traits.intelligence} EQ: {traits.emotional_intelligence} Evil: {traits.evil} Selfless: {traits.selflessness} Ambition: {traits.ambition} Combat: {traits.combat_skill} Political: {traits.political_cunning} Religion: {traits.religious_devotion} {relationshipText}
        </div>
        <div className="npc-line-2">
          🌍 {npc.location || 'Unknown'} 🟢 {npc.status} Current_Behavior: {npc.current_action || npc.current_behavior || 'Idle'}
        </div>
      </div>
    </div>
  );
};

export default NPCCard;