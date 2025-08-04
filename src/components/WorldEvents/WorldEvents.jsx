import React from 'react';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';
import './WorldEvents.css';

const WorldEvents = ({
  worldEvents,
  currentEventIndex,
  customEvent,
  setCustomEvent,
  onProcessNext,
  onSendCustom,
  autoRun,
  isLoading,
  loadingMessage
}) => {
  return (
    <div className="right-panel">
      <div className="world-events-section" style={{ position: 'relative' }}>
        <h3>World Events</h3>
        
        {isLoading && (
          <LoadingOverlay isVisible={true} message={loadingMessage} />
        )}
        
        <div className="event-controls">
          <div className="timer-controls">
            <label>
              Auto Timer: 
              <select 
                value={autoRun.timerInterval} 
                onChange={(e) => autoRun.updateTimerInterval(parseInt(e.target.value))}
                className="timer-select"
              >
                <option value={5}>5 sec</option>
                <option value={15}>15 sec</option>
                <option value={30}>30 sec</option>
              </select>
            </label>
          </div>
          
          <div className="control-buttons">
            <button 
              onClick={onProcessNext}
              className="manual-start-btn"
              disabled={currentEventIndex !== 0}
            >
              🚀 Manual Start Event
            </button>
            
            {!autoRun.isAutoRunning ? (
              <button onClick={autoRun.startAutoRun} className="start-btn">
                ▶️ Auto Events
              </button>
            ) : (
              <button onClick={autoRun.stopAutoRun} className="stop-btn">
                ⏸️ Pause Auto
              </button>
            )}
            
            <button onClick={onProcessNext} className="next-btn">
              ⏭️ Next Event
            </button>
          </div>
          
          <div className="custom-event">
            <textarea 
              placeholder="Custom event..."
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              className="custom-event-input"
              rows={4}
            />
            <div className="custom-event-buttons">
              <button 
                onClick={() => onSendCustom(true)} 
                className="send-now-btn"
                disabled={!customEvent.trim()}
              >
                🚀 Start Now
              </button>
              <button 
                onClick={() => onSendCustom(false)} 
                className="send-queue-btn"
                disabled={!customEvent.trim()}
              >
                📤 Send to Queue
              </button>
              <button 
                onClick={() => setCustomEvent('')} 
                className="delete-btn"
                disabled={!customEvent.trim()}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
        
        <div className="events-stack">
          
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
  );
};

export default WorldEvents;