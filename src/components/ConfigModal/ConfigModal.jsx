import React from 'react';
import './ConfigModal.css';

const ConfigModal = ({ 
  isVisible, 
  apiConfig, 
  onConfigChange, 
  onClose 
}) => {
  if (!isVisible) return null;

  const handleInputChange = (field, value) => {
    onConfigChange({ ...apiConfig, [field]: value });
  };

  const modelOptions = [
    { value: 'qwen-3-coder-480b', label: 'Qwen 3 Coder 480B (Default)' },
    { value: 'qwen-3-235b-a22b-instruct-2507', label: 'Qwen 3 235B A22B Instruct 2507' },
    { value: 'qwen-3-235b-a22b-thinking-2507', label: 'Qwen 3 235B A22B Thinking 2507' },
    { value: 'llama-3.3-70b', label: 'Llama 3.3 70B' },
    { value: 'qwen-3-32b', label: 'Qwen 3 32B' },
    { value: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill Llama 70B' }
  ];

  return (
    <div className="config-modal">
      <div className="config-content">
        <h3>AI Engine Configuration</h3>
        <div className="config-form">
          <div className="config-field">
            <label>Cerebras API Key:</label>
            <input
              type="password"
              value={apiConfig.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="Enter your Cerebras API key"
              className="config-input"
            />
          </div>
          <div className="config-field">
            <label>API URL:</label>
            <input
              type="text"
              value={apiConfig.apiUrl}
              onChange={(e) => handleInputChange('apiUrl', e.target.value)}
              className="config-input"
            />
          </div>
          <div className="config-field">
            <label>Model Name:</label>
            <select
              value={apiConfig.modelName}
              onChange={(e) => handleInputChange('modelName', e.target.value)}
              className="config-select"
            >
              {modelOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
          <button onClick={onClose} className="config-save-btn">
            Save & Close
          </button>
          <button onClick={onClose} className="config-cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;