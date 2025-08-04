import { useState, useRef } from 'react';

const useRateLimit = () => {
  const [rateLimitError, setRateLimitError] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(Date.now());
  const rateLimitRef = useRef({ calls: 0, resetTime: Date.now() });

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

  const incrementCallCount = () => {
    rateLimitRef.current.calls++;
    setApiCallCount(rateLimitRef.current.calls);
  };

  const resetRateLimit = () => {
    rateLimitRef.current.calls = 0;
    rateLimitRef.current.resetTime = Date.now();
    setApiCallCount(0);
    setLastResetTime(Date.now());
    setRateLimitError(false);
  };

  return {
    rateLimitError,
    apiCallCount,
    lastResetTime,
    checkRateLimit,
    incrementCallCount,
    resetRateLimit
  };
};

export default useRateLimit;