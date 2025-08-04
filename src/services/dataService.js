class DataService {
  async loadNPCData(filename = 'npcs_30.json') {
    try {
      const response = await fetch(`/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.npcs || data;
    } catch (error) {
      console.error(`Error loading NPC data from ${filename}:`, error);
      return this.getSampleNPCs();
    }
  }

  async loadWorldEvents(filename = 'world_events.json') {
    try {
      const response = await fetch(`/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.events || data;
    } catch (error) {
      console.error(`Error loading world events from ${filename}:`, error);
      return this.getSampleEvents();
    }
  }

  async loadPersonaData() {
    const personaFiles = [
      'npcs_persona_1.json',
      'npcs_persona_2.json', 
      'npcs_persona_3.json',
      'npcs_persona_4.json',
      'npcs_persona_5.json'
    ];

    try {
      // Try to load a random persona file
      const randomFile = personaFiles[Math.floor(Math.random() * personaFiles.length)];
      const response = await fetch(`/${randomFile}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${randomFile}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.npcs || data;
    } catch (error) {
      console.error('Error loading persona data:', error);
      // Fallback to regular NPC data
      return this.loadNPCData();
    }
  }

  async loadWorldQuests() {
    try {
      const response = await fetch('/world_events.json');
      if (!response.ok) {
        throw new Error(`Failed to load world_events.json: ${response.statusText}`);
      }
      const data = await response.json();
      return data.events || data;
    } catch (error) {
      console.error('Error loading world quests:', error);
      return this.getSampleEvents();
    }
  }

  getSampleNPCs() {
    return [
      {
        "id": 1,
        "name": "Jon Snow",
        "house": "Stark",
        "title": "Lord Commander of the Night's Watch",
        "location": "Castle Black",
        "age": 24,
        "gender": "Male",
        "status": "Alive",
        "traits": {
          "honor": 95,
          "loyalty": 90,
          "intelligence": 75,
          "ambition": 60,
          "cruelty": 10,
          "courage": 90
        },
        "relationships": [
          { "character": "Samwell Tarly", "relationship": "Best Friend", "strength": 95 },
          { "character": "Tyrion Lannister", "relationship": "Ally", "strength": 70 },
          { "character": "Daenerys Targaryen", "relationship": "Love Interest", "strength": 85 }
        ],
        "current_action": "Defending the Wall against wildling threats while grappling with leadership responsibilities"
      },
      {
        "id": 2,
        "name": "Tyrion Lannister",
        "house": "Lannister",
        "title": "Hand of the Queen",
        "location": "Dragonstone",
        "age": 39,
        "gender": "Male",
        "status": "Alive",
        "traits": {
          "honor": 70,
          "loyalty": 75,
          "intelligence": 98,
          "ambition": 80,
          "cruelty": 25,
          "courage": 70
        },
        "relationships": [
          { "character": "Daenerys Targaryen", "relationship": "Queen", "strength": 80 },
          { "character": "Jon Snow", "relationship": "Ally", "strength": 70 },
          { "character": "Cersei Lannister", "relationship": "Sister/Enemy", "strength": -80 }
        ],
        "current_action": "Advising Daenerys on political strategy while managing the complexities of ruling"
      },
      {
        "id": 3,
        "name": "Arya Stark",
        "house": "Stark",
        "title": "No One",
        "location": "Winterfell",
        "age": 18,
        "gender": "Female",
        "status": "Alive",
        "traits": {
          "honor": 80,
          "loyalty": 95,
          "intelligence": 85,
          "ambition": 70,
          "cruelty": 60,
          "courage": 95
        },
        "relationships": [
          { "character": "Jon Snow", "relationship": "Half-Brother", "strength": 90 },
          { "character": "Sansa Stark", "relationship": "Sister", "strength": 75 },
          { "character": "The Hound", "relationship": "Complicated Ally", "strength": 60 }
        ],
        "current_action": "Training in combat while reconnecting with family and planning revenge against enemies"
      }
    ];
  }

  getSampleEvents() {
    return [
      {
        "id": 1,
        "title": "The Red Wedding",
        "description": "Robb Stark, his mother Catelyn, and many Northern lords are brutally murdered at what was supposed to be a wedding celebration. The North's rebellion is crushed.",
        "impact_level": "Major",
        "affected_houses": ["Stark", "Frey", "Bolton", "Tully"],
        "political_shift": "Lannister victory, Northern rebellion crushed"
      },
      {
        "id": 2,
        "title": "Joffrey's Death",
        "description": "King Joffrey Baratheon is poisoned at his own wedding feast. The realm is thrown into chaos as accusations fly.",
        "impact_level": "Major",
        "affected_houses": ["Baratheon", "Lannister", "Tyrell"],
        "political_shift": "Power vacuum in King's Landing, Tommen becomes king"
      },
      {
        "id": 3,
        "title": "Dragons Return to Westeros",
        "description": "Daenerys Targaryen arrives in Westeros with her dragons and Dothraki army, beginning her conquest to reclaim the Iron Throne.",
        "impact_level": "Major",
        "affected_houses": ["Targaryen", "Lannister", "All Houses"],
        "political_shift": "New claimant to the throne, dragons return to Westeros"
      }
    ];
  }
}

export default new DataService();