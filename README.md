# NPC Simulation Arena - Game of Thrones AI Engine

A React-based simulation arena for Game of Thrones NPCs powered by AI, featuring real-time character evolution based on world events.

## Features

- **AI-Powered NPC Evolution**: Uses Cerebras API with Qwen/Llama models to intelligently update NPC personas
- **Real-time Simulation**: Automatic event processing every 15 seconds with pause/resume controls
- **Interactive Dashboard**: Load personas and world events, monitor NPC changes in real-time
- **Fallback System**: Graceful degradation to simulation mode when AI is unavailable
- **Configurable AI Engine**: Easy setup for different models and API endpoints

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure AI Engine

#### Option A: Using the UI (Recommended)
1. Start the application: `npm start`
2. Click the "⚙️ AI Engine Config" button in the header
3. Enter your Cerebras API key
4. Select your preferred model (Qwen 2.5 72B recommended for best results)
5. Save the configuration

#### Option B: Using Environment Variables
Create a `.env` file in the project root:
```env
REACT_APP_CEREBRAS_API_KEY=your_cerebras_api_key_here
REACT_APP_CEREBRAS_API_URL=https://api.cerebras.ai/v1/chat/completions
REACT_APP_MODEL_NAME=qwen2.5-72b
```

### 3. Get Cerebras API Access
1. Visit [Cerebras Cloud](https://cloud.cerebras.ai/)
2. Sign up for an account
3. Generate an API key
4. Choose from available models:
   - **qwen-3-coder-480b** (Recommended - Latest Qwen 3 Coder 480B model)
   - **qwen2.5-72b** (Good for complex reasoning)
   - **llama3.1-70b** (Good balance of speed and quality)
   - **llama3.1-8b** (Fastest, lower quality)

### 4. Start the Application
```bash
npm start
```

The application will be available at `http://localhost:3000`

## How It Works

### AI Engine Formula
The AI engine uses the empirical formula:
```
NPC Persona (with current behavior) × World Event = New Behavior + Change in Persona
```

### NPC Evolution Process
1. **Impact Assessment**: AI analyzes how the world event affects the NPC's house, role, location, and relationships
2. **Behavior Generation**: Creates new natural language behavior descriptions grounded in Westerosi lore
3. **Trait Adjustment**: Subtle changes to personality traits (-20 to +20 points)
4. **Relationship Updates**: Modifies relationship strengths and adds/removes connections as logical
5. **Status Changes**: Updates location and status only when directly implied by events

### Fallback System
When the AI engine is unavailable (no API key or connection issues), the system automatically falls back to:
- Rule-based trait modifications
- Event-type specific behavior patterns
- Randomized but logical personality shifts

## Usage Guide

### Loading Data
- **Load World Quest**: Loads `world_events.json` with 25+ major Game of Thrones events
- **Load Persona**: Loads `npcs_100.json` with 100 detailed NPC personas

### Event Processing
- **Auto Events**: Processes events every 15 seconds (configurable)
- **Force Next Event**: Manually trigger the next world event
- **Custom Events**: Send custom events on the fly

### Monitoring NPCs
- Left panel shows all NPCs with real-time updates
- Each NPC card displays: ID, name, house, age, gender, role, traits, relationships, location, status, and current behavior
- Watch traits and behaviors evolve as events unfold

## Data Structure

### NPC Schema
```json
{
  "id": "stark_001",
  "name": "Ser Gareth of House Stark",
  "house": "Stark",
  "age": 34,
  "gender": "male",
  "role": "knight",
  "traits": {
    "honor": 82,
    "loyalty": 88,
    "intelligence": 65,
    "emotional_intelligence": 70,
    "evil": 15,
    "selflessness": 75,
    "ambition": 45,
    "combat_skill": 78,
    "political_cunning": 35,
    "religious_devotion": 60
  },
  "relationships": [
    {
      "npc_id": "stark_002",
      "relationship_type": "ally",
      "strength": 85
    }
  ],
  "location": "Winterfell",
  "status": "active",
  "current_behavior": "Training new recruits in the castle courtyard"
}
```

### World Event Schema
```json
{
  "event_id": 1,
  "title": "The Death of Jon Arryn",
  "description": "Jon Arryn, Hand of the King, dies under mysterious circumstances...",
  "political_context": {
    "House Stark": "Ned Stark faces pressure to become the new Hand...",
    "House Lannister": "The Lannisters see an opportunity to consolidate power..."
  },
  "cascading_effects": {
    "House Stark": "Honor increases, loyalty tested...",
    "House Lannister": "Ambition rises, political maneuvering intensifies..."
  }
}
```

## Troubleshooting

### Common Issues

1. **"API Key Required" Error**
   - Configure your Cerebras API key in the AI Engine Config panel
   - Ensure the key is valid and has sufficient credits

2. **NPCs Not Updating**
   - Check browser console for API errors
   - Verify internet connection
   - System will fall back to simulation mode automatically

3. **Events Not Processing**
   - Ensure Auto Events is enabled
   - Check that world events are loaded
   - Verify timer interval is set correctly

### Performance Tips

- **Qwen 2.5 72B**: Best quality but slower response times
- **Llama 3.1 70B**: Good balance for most use cases
- **Llama 3.1 8B**: Fastest responses for rapid testing

## Development

### Project Structure
```
├── public/
│   ├── dataset/
│   │   ├── npcs_100.json
│   │   └── npcs_300.json
│   └── world_events.json
├── src/
│   ├── App.js          # Main application logic
│   ├── App.css         # Styling
│   └── index.js        # React entry point
└── README.md
```

### Key Functions
- `updateNPCWithAI()`: Core AI integration function
- `simulateNPCUpdate()`: Fallback simulation logic
- `processNextEvent()`: Event processing pipeline
- `formatNPCDisplay()`: UI rendering for NPCs

## Contributing

Feel free to contribute by:
- Adding new world events
- Expanding NPC datasets
- Improving AI prompts
- Enhancing UI/UX
- Adding new AI model integrations

## License

MIT License - Feel free to use and modify for your projects.