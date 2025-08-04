import { useState, useEffect } from 'react';

const useAPIConfig = () => {
  const [apiConfig, setApiConfig] = useState({
    apiKey: '',
    apiUrl: 'https://api.cerebras.ai/v1/chat/completions',
    modelName: 'qwen-3-coder-480b'
  });

  // Load environment variables on mount
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

  const updateConfig = (newConfig) => {
    setApiConfig(newConfig);
  };

  const isConfigured = () => {
    return apiConfig.apiKey && apiConfig.apiKey.trim() !== '';
  };

  return {
    apiConfig,
    updateConfig,
    isConfigured
  };
};

export default useAPIConfig;