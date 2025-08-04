import { useState, useRef, useCallback } from 'react';

const useAutoRun = (processNextEvent) => {
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState(15);
  const intervalRef = useRef(null);

  const startAutoRun = useCallback(() => {
    setIsAutoRunning(true);
    intervalRef.current = setInterval(() => {
      processNextEvent();
    }, timerInterval * 1000);
  }, [processNextEvent, timerInterval]);

  const stopAutoRun = useCallback(() => {
    setIsAutoRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateTimerInterval = useCallback((newInterval) => {
    setTimerInterval(newInterval);
    
    // If auto-run is active, restart with new interval
    if (isAutoRunning) {
      stopAutoRun();
      setTimeout(() => startAutoRun(), 100);
    }
  }, [isAutoRunning, startAutoRun, stopAutoRun]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return {
    isAutoRunning,
    timerInterval,
    startAutoRun,
    stopAutoRun,
    updateTimerInterval,
    cleanup
  };
};

export default useAutoRun;