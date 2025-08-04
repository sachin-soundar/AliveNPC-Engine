import React, { useEffect } from 'react';
import './App.css';

// Components
import { 
  Header, 
  NPCList, 
  WorldEvents, 
  ConfigModal, 
  LoadingOverlay 
} from './components';

// Hooks
import { 
  useNPCData, 
  useWorldEvents, 
  useAPIConfig, 
  useRateLimit, 
  useAutoRun 
} from './hooks';

// Services
import { aiService } from './services';

const App = () => {
  // Custom hooks for state management
  const { 
    npcs, 
    previousNpcs, 
    flashAnimation, 
    loadPersona, 
    loadDefaultData, 
    updateNPCs,
    resetNPCs 
  } = useNPCData();
  
  const { 
    worldEvents, 
    currentEventIndex, 
    customEvent, 
    setCustomEvent,
    loadWorldQuest, 
    loadDefaultEvents, 
    restartWorld, 
    processNextEvent: baseProcessNextEvent, 
    sendCustomEvent 
  } = useWorldEvents();
  
  const { apiConfig, updateConfig, isConfigured } = useAPIConfig();
  const rateLimit = useRateLimit();
  const [showConfigModal, setShowConfigModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('');

  // Enhanced processNextEvent function that integrates AI service
  const processNextEvent = async () => {
    if (currentEventIndex >= worldEvents.length) {
      console.log('No more events to process');
      return;
    }

    const currentEvent = worldEvents[currentEventIndex];
    setIsLoading(true);
    setLoadingMessage(`Processing: ${currentEvent.title}`);
    
    try {
      const updatedNpcs = await aiService.updateAllNPCsWithAI(npcs, currentEvent, apiConfig);
      updateNPCs(updatedNpcs);
      baseProcessNextEvent();
    } catch (error) {
      console.error('Error processing event:', error);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Enhanced handleCustomEvent function
  const handleCustomEvent = async (immediate = false) => {
    if (!customEvent.trim()) return;
    
    const event = {
      event_id: Date.now(),
      title: "Custom Event",
      description: customEvent,
      impact_level: "Custom"
    };
    
    if (immediate) {
      setIsLoading(true);
      setLoadingMessage('Processing custom event...');
      
      try {
        const updatedNpcs = await aiService.updateAllNPCsWithAI(npcs, event, apiConfig);
        updateNPCs(updatedNpcs);
        sendCustomEvent(event, true); // immediate = true
        setCustomEvent(''); // Clear the input
      } catch (error) {
        console.error('Error processing custom event:', error);
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    } else {
      // Just add to queue without processing
      sendCustomEvent(event, false); // immediate = false
      setCustomEvent(''); // Clear the input
    }
  };

  // Auto-run functionality
  const autoRun = useAutoRun(processNextEvent);
  
  // Cleanup auto-run on unmount
  useEffect(() => {
    return () => autoRun.cleanup();
  }, [autoRun]);

  // Load environment variables on component mount
  useEffect(() => {
    const envApiKey = process.env.REACT_APP_CEREBRAS_API_KEY;
    const envApiUrl = process.env.REACT_APP_CEREBRAS_API_URL;
    const envModelName = process.env.REACT_APP_MODEL_NAME;
    
    if (envApiKey || envApiUrl || envModelName) {
      updateConfig({
        apiKey: envApiKey || '',
        apiUrl: envApiUrl || 'https://api.cerebras.ai/v1/chat/completions',
        modelName: envModelName || 'qwen-3-coder-480b'
      });
    }
  }, []);

  // Load default data on component mount
  useEffect(() => {
    loadDefaultData();
    loadDefaultEvents();
  }, [loadDefaultData, loadDefaultEvents]);

  return (
    <div className="App">
      <Header 
        onLoadWorldQuest={loadWorldQuest}
        onLoadPersona={loadPersona}
        onRestartWorld={() => {
          restartWorld();
          resetNPCs();
        }}
        onShowConfig={() => setShowConfigModal(true)}
      />
      
      <div className="main-content">
        <NPCList 
          npcs={npcs}
          previousNpcs={previousNpcs}
          flashAnimation={flashAnimation}
          rateLimit={rateLimit}
        />
        
        <WorldEvents 
          worldEvents={worldEvents}
          currentEventIndex={currentEventIndex}
          customEvent={customEvent}
          setCustomEvent={setCustomEvent}
          onProcessNext={processNextEvent}
          onSendCustom={handleCustomEvent}
          autoRun={autoRun}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />
      </div>
      
      {showConfigModal && (
        <ConfigModal 
          apiConfig={apiConfig}
          onUpdateConfig={updateConfig}
          onClose={() => setShowConfigModal(false)}
          isConfigured={isConfigured()}
        />
      )}
      

    </div>
  );
};

export default App;