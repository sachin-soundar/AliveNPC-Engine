import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const App = () => {
  const [npcs, setNpcs] = useState([]);
  const [worldEvents, setWorldEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState(15);
  const [customEvent, setCustomEvent] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    apiKey: '',
    apiUrl: 'https://api.cerebras.ai/v1/chat/completions',
    modelName: 'qwen-3-coder-480b'
  });
  const [isProcessingEvent, setIsProcessingEvent] = useState(false);
  const [previousNpcs, setPreviousNpcs] = useState([]);
  const [flashAnimation, setFlashAnimation] = useState(false);
  const intervalRef = useRef(null);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(Date.now());
  const rateLimitRef = useRef({ calls: 0, resetTime: Date.now() });

  const loadSampleData = useCallback(() => {
    // Sample NPCs based on the schema
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

    const sampleEvents = [
      {
        event_id: 1,
        title: "Lord Jon Arryn of House Arryn dies mysteriously",
        description: "The Hand of the King dies suddenly, creating a power vacuum in King's Landing",
        political_context: {
          house_stark: "Ned Stark of House Stark reluctantly accepts Hand position, honor compels duty to realm"
        },
        cascading_effects: ["Power vacuum in King's Landing", "Stark family travels south"]
      }
    ];

    setNpcs(sampleNpcs);
    setWorldEvents(sampleEvents);
  }, []);

  const loadDefaultData = useCallback(async () => {
    try {
      // Load NPCs
      const npcResponse = await fetch('/dataset/npcs_30.json');
      const npcData = await npcResponse.json();
      setNpcs(npcData.npcs || []);

      // Load World Events
      const eventsResponse = await fetch('/world_events.json');
      const eventsData = await eventsResponse.json();
      setWorldEvents(eventsData.world_events || []);
    } catch (error) {
      console.error('Error loading default data:', error);
      // Fallback to sample data if files not found
      loadSampleData();
    }
  }, [loadSampleData]);

  // Load environment variables on component mount
  useEffect(() => {
    const envApiKey = process.env.REACT_APP_CEREBRAS_API_KEY;
    const envApiUrl = process.env.REACT_APP_CEREBRAS_API_URL;
    const envModelName = process.env.REACT_APP_MODEL_NAME;
    
    if (envApiKey || envApiUrl || envModelName) {
      setApiConfig({
        apiKey: envApiKey || '',
        apiUrl: envApiUrl || 'https://api.cerebras.ai/v1/chat/completions',
        modelName: envModelName || 'qwen-3-coder-480b'
      });
    }
  }, []);

  // Load default data on component mount
  useEffect(() => {
    loadDefaultData();
  }, [loadDefaultData]);

  const loadWorldQuest = async () => {
    try {
      const eventsResponse = await fetch('/world_events.json');
      const eventsData = await eventsResponse.json();
      setWorldEvents(eventsData.world_events || []);
      setCurrentEventIndex(0); // Reset to first event
      console.log('World Quest loaded successfully');
    } catch (error) {
      console.error('Error loading world events:', error);
      alert('Failed to load World Quest. Please check if world_events.json exists.');
    }
  };

  const loadPersona = async () => {
    try {
      // Load 30 NPCs by default, with fallbacks to larger datasets
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
  };

  const restartWorld = () => {
    setCurrentEventIndex(0);
    setIsAutoRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    console.log('World restarted - reset to first event');
  };

  const checkRateLimit = () => {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    
    // Reset counter every minute
    if (now - rateLimitRef.current.resetTime > oneMinute) {
      rateLimitRef.current.calls = 0;
      rateLimitRef.current.resetTime = now;
      setApiCallCount(0);
      setLastResetTime(now);
      setRateLimitError(false);
    }
    
    // Check if we're at the limit (9 calls to leave buffer)
    if (rateLimitRef.current.calls >= 9) {
      setRateLimitError(true);
      return false;
    }
    
    return true;
  };

  const updateAllNPCsWithAI = async (npcsArray, event) => {
    const { apiKey, apiUrl, modelName } = apiConfig;

    if (!apiKey || apiKey.trim() === '') {
      console.warn('Cerebras API key not configured. Using fallback simulation.');
      return npcsArray.map(npc => simulateNPCUpdate(npc, event));
    }
    
    // Check rate limit before making API call
    if (!checkRateLimit()) {
      console.warn(`Rate limit reached (${rateLimitRef.current.calls}/10 calls per minute). Using simulation for all NPCs`);
      return npcsArray.map(npc => simulateNPCUpdate(npc, event));
    }

    const prompt = `You are an expert AI agent simulating NPC evolution in a Game of Thrones universe. Update ALL NPCs in the dataset based on the world event, ensuring changes align with Westerosi lore, politics, and character archetypes. Use the empirical formula: NPC Persona (with current action) × World Event = New Action + Change in Persona.

NPC Dataset (JSON schema-compliant):
${JSON.stringify(npcsArray, null, 2)}

World Event:
${event.title} - ${event.description}

Reason step by step:
1. Assess impact: How does the event affect EACH NPC's house, role, location, status, traits, and relationships? Factor in traits (e.g., high evil amplifies malice, low loyalty risks defection).
2. New Action: Craft a concise natural language description of updated mood/actions for each NPC, grounded in lore. Use 'current_action' field instead of 'current_behavior'.
3. Persona Changes: Adjust traits by -20 to +20 max (subtle shifts); modify relationship strengths by -30 to +30 or add/remove if logical; update location/status only if directly implied.
4. Consistency: Avoid drastic overhauls—events ripple, not revolutionize. Preserve JSON schema integrity.
5. Process the ENTIRE dataset as a cohesive world where NPCs may interact and influence each other.

Output ONLY the updated NPC dataset as a JSON array. No extra text.`;

    try {
      console.log('Calling Cerebras API with model:', modelName, 'for', npcsArray.length, 'NPCs');
      
      // Increment rate limit counter
      rateLimitRef.current.calls++;
      setApiCallCount(rateLimitRef.current.calls);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "system",
              content: "You are an expert Game of Thrones NPC simulation engine. Always respond with valid JSON array only."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_completion_tokens: 8000,
          top_p: 0.8,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        // Handle rate limit specifically
        if (response.status === 429) {
          console.error('Rate limit exceeded! Switching to simulation mode.');
          setRateLimitError(true);
          return npcsArray.map(npc => simulateNPCUpdate(npc, event));
        }
        
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.json();
      const aiResponse = responseData.choices[0].message.content;
      
      // Parse the AI response as JSON
      try {
        const updatedNpcs = JSON.parse(aiResponse);
        // Validate that it's an array and has the right length
        if (Array.isArray(updatedNpcs) && updatedNpcs.length === npcsArray.length) {
          return updatedNpcs;
        } else {
          throw new Error('Invalid NPC array structure returned by AI');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        console.log('AI Response:', aiResponse);
        return npcsArray.map(npc => simulateNPCUpdate(npc, event));
      }
    } catch (error) {
      console.error('Error calling Cerebras API:', error);
      return npcsArray.map(npc => simulateNPCUpdate(npc, event));
    }
  };

  const updateNPCWithAI = async (npc, event) => {
    // Legacy function for backward compatibility - now just calls simulation
    return simulateNPCUpdate(npc, event);
  };

  const simulateNPCUpdate = (npc, event) => {
    // Fallback simulation when AI is not available
    const updatedNpc = { ...npc };
    
    // Simulate trait changes based on event
    if (event.title.includes('dies') || event.title.includes('executed')) {
      updatedNpc.traits.honor = Math.max(0, Math.min(100, updatedNpc.traits.honor + (Math.random() * 20 - 10)));
      updatedNpc.traits.loyalty = Math.max(0, Math.min(100, updatedNpc.traits.loyalty + (Math.random() * 15 - 5)));
      updatedNpc.current_action = `Reacting to recent tragic events with ${updatedNpc.traits.honor > 70 ? 'righteous anger' : 'calculated caution'}`;
    } else if (event.title.includes('war') || event.title.includes('battle')) {
      updatedNpc.traits.ambition = Math.max(0, Math.min(100, updatedNpc.traits.ambition + (Math.random() * 15 - 5)));
      updatedNpc.current_action = `Preparing for the conflicts ahead with ${updatedNpc.traits.ambition > 70 ? 'eager anticipation' : 'cautious planning'}`;
    } else {
      updatedNpc.traits.intelligence = Math.max(0, Math.min(100, updatedNpc.traits.intelligence + (Math.random() * 10 - 5)));
      updatedNpc.current_action = `Adapting to changing circumstances with ${updatedNpc.traits.intelligence > 70 ? 'strategic thinking' : 'careful observation'}`;
    }

    return updatedNpc;
  };

  const processNextEvent = async () => {
    if (currentEventIndex >= worldEvents.length) {
      setIsAutoRunning(false);
      return;
    }

    // Start loading animation
    setIsProcessingEvent(true);
    
    // Store previous NPC data before updating
    setPreviousNpcs([...npcs]);

    const currentEvent = worldEvents[currentEventIndex];

    console.log(`Processing event: ${currentEvent.title}`);
    console.log(`Current API calls this minute: ${rateLimitRef.current.calls}/10`);

    // Use the new batch processing function - processes entire dataset in single call
    const updatedNpcs = await updateAllNPCsWithAI(npcs, currentEvent);
    
    console.log(`Event completed. Processed ${npcs.length} NPCs in single API call`);

    // Update NPCs and trigger flash animation
    setNpcs(updatedNpcs);
    setCurrentEventIndex(prev => prev + 1);
    
    // End loading animation
    setIsProcessingEvent(false);
    
    // Trigger flash animation for new data
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 1000);
  };

  const startAutoRun = () => {
    setIsAutoRunning(true);
    intervalRef.current = setInterval(() => {
      processNextEvent();
    }, timerInterval * 1000);
  };

  const stopAutoRun = () => {
    setIsAutoRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const sendCustomEvent = async () => {
    if (!customEvent.trim()) return;

    const event = {
      event_id: 999,
      title: customEvent,
      description: "Custom event triggered by user",
      political_context: {},
      cascading_effects: []
    };

    // Start loading animation
    setIsProcessingEvent(true);
    
    // Store previous NPC data before updating
    setPreviousNpcs([...npcs]);

    console.log(`Processing custom event: ${customEvent}`);
    console.log(`Current API calls this minute: ${rateLimitRef.current.calls}/10`);

    // Use the new batch processing function - processes entire dataset in single call
    const updatedNpcsFromCustomEvent = await updateAllNPCsWithAI(npcs, event);
    
    console.log(`Custom event completed. Processed ${npcs.length} NPCs in single API call`);

    setNpcs(updatedNpcsFromCustomEvent);
    setCustomEvent('');
    
    // End loading animation
    setIsProcessingEvent(false);
    
    // Trigger flash animation for new data
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 1000);
  };

  const formatNPCDisplay = (npc) => {
    const traits = npc.traits;
    const relationships = npc.relationships || [];
    const relationshipText = relationships
      .map(rel => `👨‍👦 ${rel.npc_id} ${rel.relationship_type} Str${rel.strength}`)
      .join(' ') || '';
    
    const genderIcon = npc.gender === 'male' ? '👨M' : '👩F';
    const houseShort = npc.house.replace('House ', '');
    const houseLower = houseShort.toLowerCase();
    
    // Find previous data for this NPC
    const previousNpc = previousNpcs.find(prevNpc => prevNpc.id === npc.id);
    
    const formatTooltipData = (npcData) => {
      if (!npcData) return 'No previous data available';
      const prevTraits = npcData.traits;
      return `Previous State:\nHonor: ${prevTraits.honor} Loyal: ${prevTraits.loyalty} IQ: ${prevTraits.intelligence} EQ: ${prevTraits.emotional_intelligence}\nEvil: ${prevTraits.evil} Selfless: ${prevTraits.selflessness} Ambition: ${prevTraits.ambition}\nCombat: ${prevTraits.combat_skill} Political: ${prevTraits.political_cunning} Religion: ${prevTraits.religious_devotion}\nLocation: ${npcData.location || 'Unknown'} Status: ${npcData.status}\nBehavior: ${npcData.current_action || npcData.current_behavior || 'Idle'}`;
    };
    
    return (
      <div 
        key={npc.id} 
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Live NPC Engine</h1>
        <div className="header-buttons">
          <button onClick={loadWorldQuest} className="load-btn">
            📜 Load World Quest
          </button>
          <button onClick={loadPersona} className="load-btn">
            👥 Load Persona
          </button>
          <button onClick={restartWorld} className="restart-btn">
            🔄 Restart World
          </button>
          <button onClick={() => setShowConfig(true)} className="config-btn">
            ⚙️ AI Engine Config
          </button>
        </div>
      </header>

      {showConfig && (
        <div className="config-modal">
          <div className="config-content">
            <h3>AI Engine Configuration</h3>
            <div className="config-form">
              <div className="config-field">
                <label>Cerebras API Key:</label>
                <input
                  type="password"
                  value={apiConfig.apiKey}
                  onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                  placeholder="Enter your Cerebras API key"
                  className="config-input"
                />
              </div>
              <div className="config-field">
                <label>API URL:</label>
                <input
                  type="text"
                  value={apiConfig.apiUrl}
                  onChange={(e) => setApiConfig({...apiConfig, apiUrl: e.target.value})}
                  className="config-input"
                />
              </div>
              <div className="config-field">
                <label>Model Name:</label>
                <select
                  value={apiConfig.modelName}
                  onChange={(e) => setApiConfig({...apiConfig, modelName: e.target.value})}
                  className="config-select"
                >
                  <option value="qwen-3-coder-480b">Qwen 3 Coder 480B (Default)</option>
                  <option value="qwen-3-235b-a22b-instruct-2507">Qwen 3 235B A22B Instruct 2507</option>
                  <option value="qwen-3-235b-a22b-thinking-2507">Qwen 3 235B A22B Thinking 2507</option>
                  <option value="llama-3.3-70b">Llama 3.3 70B</option>
                  <option value="qwen-3-32b">Qwen 3 32B</option>
                  <option value="deepseek-r1-distill-llama-70b">DeepSeek R1 Distill Llama 70B</option>
                </select>
              </div>
              <div className="config-status">
                {apiConfig.apiKey ? (
                  <span className="status-connected">🟢 API Key Configured</span>
                ) : (
                  <span className="status-disconnected">🔴 API Key Required</span>
                )}
              </div>
            </div>
            <div className="config-buttons">
              <button onClick={() => setShowConfig(false)} className="config-save-btn">
                Save & Close
              </button>
              <button onClick={() => setShowConfig(false)} className="config-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="left-panel">
          <h2>NPCs ({npcs.length})</h2>
          
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
              <span className={rateLimitError ? 'rate-limit-error' : apiCallCount >= 7 ? 'rate-limit-warning' : 'rate-limit-ok'}>
                {apiCallCount}/10 calls this minute
              </span>
              {rateLimitError && (
                <span className="rate-limit-message"> ⚠️ Rate limit reached - using simulation mode</span>
              )}
            </div>
          </div>
          
          <div className={`npc-list ${flashAnimation ? 'flash-animation' : ''}`}>
            {npcs.map(npc => formatNPCDisplay(npc))}
          </div>
        </div>

        <div className="right-panel">
          <div className="world-events-section">
            <h3>World Events</h3>
            
            <div className="event-controls">
              <div className="timer-controls">
                <label>
                  Auto Timer: 
                  <input 
                    type="number" 
                    value={timerInterval} 
                    onChange={(e) => setTimerInterval(parseInt(e.target.value))}
                    min="5"
                    max="300"
                  /> sec
                </label>
              </div>
              
              <div className="control-buttons">
                <button onClick={() => {
                  if (currentEventIndex === 0) {
                    processNextEvent();
                  }
                }} className="manual-start-btn">
                  🚀 Manual Start Event
                </button>
                
                {!isAutoRunning ? (
                  <button onClick={startAutoRun} className="start-btn">
                    ▶️ Auto Events
                  </button>
                ) : (
                  <button onClick={stopAutoRun} className="stop-btn">
                    ⏸️ Pause Auto
                  </button>
                )}
                
                <button onClick={processNextEvent} className="next-btn">
                  ⏭️ Next Event
                </button>
              </div>
              
              <div className="custom-event">
                <input 
                  type="text" 
                  placeholder="Custom event..."
                  value={customEvent}
                  onChange={(e) => setCustomEvent(e.target.value)}
                  className="custom-event-input"
                />
                <button onClick={sendCustomEvent} className="send-btn">
                  📤 Send
                </button>
              </div>
            </div>
            
            <div className="events-stack" style={{ position: 'relative' }}>
              {isProcessingEvent && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Executing World Event...</div>
                </div>
              )}
              {worldEvents.map((event, index) => {
                let statusClass = 'event-pending';
                if (index < currentEventIndex) {
                  statusClass = 'event-completed';
                } else if (index === currentEventIndex) {
                  statusClass = 'event-running';
                }
                
                return (
                  <div key={event.event_id} className={`event-card-stack ${statusClass}`}>
                    <div className="event-header">
                      <span className="event-number">#{event.event_id}</span>
                      <span className="event-status-indicator">
                        {index < currentEventIndex ? '✅' : index === currentEventIndex ? '🔄' : '⏳'}
                      </span>
                    </div>
                    <div className="event-title">{event.title}</div>
                    <div className="event-description">{event.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;