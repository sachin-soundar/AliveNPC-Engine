import { useState, useCallback } from 'react';

const useNPCData = () => {
  const [npcs, setNpcs] = useState([]);
  const [previousNpcs, setPreviousNpcs] = useState([]);
  const [flashAnimation, setFlashAnimation] = useState(false);

  const loadSampleData = useCallback(() => {
    const sampleNpcs = [
      {
        id: "stark_001",
        name: "Ser Gareth of House Stark",
        house: "Stark",
        age: 34,
        gender: "male",
        role: "knight",
        traits: {
          honor: 82,
          loyalty: 88,
          intelligence: 65,
          emotional_intelligence: 70,
          evil: 12,
          selflessness: 75,
          ambition: 35,
          combat_skill: 80,
          political_cunning: 45,
          religious_devotion: 65
        },
        relationships: [
          { npc_id: "stark_002", relationship_type: "family", strength: 90 },
          { npc_id: "stark_015", relationship_type: "ally", strength: 75 }
        ],
        current_behavior: "Patrolling the borders with quiet determination",
        location: "Winterfell",
        status: "alive"
      }
    ];
    setNpcs(sampleNpcs);
  }, []);

  const loadPersona = useCallback(async () => {
    try {
      let npcResponse;
      try {
        npcResponse = await fetch('/dataset/npcs_30.json');
      } catch {
        try {
          npcResponse = await fetch('/dataset/npcs_100.json');
        } catch {
          npcResponse = await fetch('/dataset/npcs_300.json');
        }
      }
      const npcData = await npcResponse.json();
      setNpcs(npcData.npcs || npcData || []);
      console.log('Persona data loaded successfully');
    } catch (error) {
      console.error('Error loading persona data:', error);
      alert('Failed to load Persona data. Please check if NPC files exist.');
    }
  }, []);

  const loadDefaultData = useCallback(async () => {
    try {
      const npcResponse = await fetch('/dataset/npcs_30.json');
      const npcData = await npcResponse.json();
      setNpcs(npcData.npcs || []);
    } catch (error) {
      console.error('Error loading default data:', error);
      loadSampleData();
    }
  }, [loadSampleData]);

  const updateNPCs = useCallback((newNpcs) => {
    setPreviousNpcs([...npcs]);
    setNpcs(newNpcs);
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 1000);
  }, [npcs]);

  const resetNPCs = useCallback(() => {
    setPreviousNpcs([]);
    setFlashAnimation(false);
    loadDefaultData();
  }, [loadDefaultData]);

  return {
    npcs,
    previousNpcs,
    flashAnimation,
    loadPersona,
    loadDefaultData,
    updateNPCs,
    resetNPCs
  };
};

export default useNPCData;