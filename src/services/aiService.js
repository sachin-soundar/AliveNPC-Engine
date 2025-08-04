class AIService {
  constructor() {
    this.rateLimitHandler = null;
  }

  setRateLimitHandler(handler) {
    this.rateLimitHandler = handler;
  }

  async updateAllNPCsWithAI(npcsArray, event, apiConfig) {
    const { apiKey, apiUrl, modelName } = apiConfig;

    if (!apiKey || apiKey.trim() === '') {
      console.warn('Cerebras API key not configured. Using fallback simulation.');
      return npcsArray.map(npc => this.simulateNPCUpdate(npc, event));
    }
    
    // Check rate limit before making API call
    if (this.rateLimitHandler && !this.rateLimitHandler.checkRateLimit()) {
      console.warn(`Rate limit reached. Using simulation for all NPCs`);
      return npcsArray.map(npc => this.simulateNPCUpdate(npc, event));
    }

    const prompt = this.buildPrompt(npcsArray, event);

    try {
      console.log('Calling Cerebras API with model:', modelName, 'for', npcsArray.length, 'NPCs');
      
      // Increment rate limit counter
      if (this.rateLimitHandler) {
        this.rateLimitHandler.incrementCallCount();
      }
      
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
          if (this.rateLimitHandler) {
            this.rateLimitHandler.setRateLimitError(true);
          }
          return npcsArray.map(npc => this.simulateNPCUpdate(npc, event));
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
        return npcsArray.map(npc => this.simulateNPCUpdate(npc, event));
      }
    } catch (error) {
      console.error('Error calling Cerebras API:', error);
      return npcsArray.map(npc => this.simulateNPCUpdate(npc, event));
    }
  }

  buildPrompt(npcsArray, event) {
    return `You are an expert AI agent simulating NPC evolution in a Game of Thrones universe. Update ALL NPCs in the dataset based on the world event, ensuring changes align with Westerosi lore, politics, and character archetypes. Use the empirical formula: NPC Persona (with current action) × World Event = New Action + Change in Persona.

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
  }

  simulateNPCUpdate(npc, event) {
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
  }
}

export default new AIService();