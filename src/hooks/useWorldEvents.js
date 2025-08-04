import { useState, useCallback } from 'react';

const useWorldEvents = () => {
  const [worldEvents, setWorldEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [customEvent, setCustomEvent] = useState('');

  const loadSampleEvents = useCallback(() => {
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
    setWorldEvents(sampleEvents);
  }, []);

  const loadWorldQuest = useCallback(async () => {
    try {
      const eventsResponse = await fetch('/world_events.json');
      const eventsData = await eventsResponse.json();
      setWorldEvents(eventsData.world_events || []);
      setCurrentEventIndex(0);
      console.log('World Quest loaded successfully');
    } catch (error) {
      console.error('Error loading world events:', error);
      alert('Failed to load World Quest. Please check if world_events.json exists.');
    }
  }, []);

  const loadDefaultEvents = useCallback(async () => {
    try {
      const eventsResponse = await fetch('/world_events.json');
      const eventsData = await eventsResponse.json();
      setWorldEvents(eventsData.world_events || []);
    } catch (error) {
      console.error('Error loading default events:', error);
      loadSampleEvents();
    }
  }, [loadSampleEvents]);

  const restartWorld = useCallback(() => {
    setCurrentEventIndex(0);
    setWorldEvents([]);
    loadDefaultEvents();
    console.log('World restarted - reset to first event and reloaded events');
  }, [loadDefaultEvents]);

  const nextEvent = useCallback(() => {
    setCurrentEventIndex(prev => prev + 1);
  }, []);

  const createCustomEvent = useCallback((eventTitle) => {
    return {
      event_id: 999,
      title: eventTitle,
      description: "Custom event triggered by user",
      political_context: {},
      cascading_effects: []
    };
  }, []);

  const processNextEvent = useCallback(() => {
    if (currentEventIndex < worldEvents.length) {
      setCurrentEventIndex(prev => prev + 1);
    }
  }, [currentEventIndex, worldEvents.length]);

  const sendCustomEvent = useCallback((event, immediate = false) => {
    if (immediate) {
      // Add custom event as completed above current event
      const newEvents = [...worldEvents];
      newEvents.splice(currentEventIndex, 0, { ...event, completed: true });
      setWorldEvents(newEvents);
      setCurrentEventIndex(prev => prev + 1);
    } else {
      // Add to end of stack
      setWorldEvents(prev => [...prev, event]);
    }
  }, [worldEvents, currentEventIndex]);

  return {
    worldEvents,
    currentEventIndex,
    customEvent,
    setCustomEvent,
    loadWorldQuest,
    loadDefaultEvents,
    restartWorld,
    nextEvent,
    createCustomEvent,
    processNextEvent,
    sendCustomEvent
  };
};

export default useWorldEvents;