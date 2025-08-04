class NPCService {
  formatNPCDisplay(npc, previousNpcs) {
    const previousNpc = previousNpcs?.find(p => p.id === npc.id);
    
    return {
      ...npc,
      displayData: {
        hasChanges: this.hasSignificantChanges(npc, previousNpc),
        traitChanges: this.getTraitChanges(npc, previousNpc),
        relationshipChanges: this.getRelationshipChanges(npc, previousNpc)
      }
    };
  }

  hasSignificantChanges(current, previous) {
    if (!previous) return false;
    
    // Check trait changes
    const traitThreshold = 5;
    for (const trait in current.traits) {
      if (Math.abs(current.traits[trait] - previous.traits[trait]) >= traitThreshold) {
        return true;
      }
    }
    
    // Check relationship changes
    if (current.relationships?.length !== previous.relationships?.length) {
      return true;
    }
    
    // Check for relationship strength changes
    for (const rel of current.relationships || []) {
      const prevRel = previous.relationships?.find(r => r.character === rel.character);
      if (!prevRel || Math.abs(rel.strength - prevRel.strength) >= 10) {
        return true;
      }
    }
    
    // Check action changes
    if (current.current_action !== previous.current_action) {
      return true;
    }
    
    return false;
  }

  getTraitChanges(current, previous) {
    if (!previous) return {};
    
    const changes = {};
    for (const trait in current.traits) {
      const diff = current.traits[trait] - previous.traits[trait];
      if (Math.abs(diff) >= 1) {
        changes[trait] = diff;
      }
    }
    return changes;
  }

  getRelationshipChanges(current, previous) {
    if (!previous) return { added: [], removed: [], modified: [] };
    
    const changes = { added: [], removed: [], modified: [] };
    
    // Find added relationships
    for (const rel of current.relationships || []) {
      const prevRel = previous.relationships?.find(r => r.character === rel.character);
      if (!prevRel) {
        changes.added.push(rel);
      } else if (Math.abs(rel.strength - prevRel.strength) >= 5) {
        changes.modified.push({ ...rel, previousStrength: prevRel.strength });
      }
    }
    
    // Find removed relationships
    for (const prevRel of previous.relationships || []) {
      const currentRel = current.relationships?.find(r => r.character === prevRel.character);
      if (!currentRel) {
        changes.removed.push(prevRel);
      }
    }
    
    return changes;
  }

  getGroupedStats(npcs) {
    const stats = {
      houses: {},
      genders: {},
      locations: {}
    };

    npcs.forEach(npc => {
      // Count by house
      stats.houses[npc.house] = (stats.houses[npc.house] || 0) + 1;
      
      // Count by gender
      stats.genders[npc.gender] = (stats.genders[npc.gender] || 0) + 1;
      
      // Count by location
      stats.locations[npc.location] = (stats.locations[npc.location] || 0) + 1;
    });

    return stats;
  }

  getHouseColor(house) {
    const houseColors = {
      'Stark': '#8B9DC3',
      'Lannister': '#FFD700',
      'Targaryen': '#8B0000',
      'Baratheon': '#FFD700',
      'Greyjoy': '#2F4F4F',
      'Martell': '#FF8C00',
      'Tyrell': '#228B22',
      'Arryn': '#87CEEB',
      'Tully': '#4682B4',
      'Frey': '#696969',
      'Bolton': '#8B0000',
      'Mormont': '#8B4513',
      'Reed': '#556B2F',
      'Karstark': '#708090',
      'Umber': '#2F4F4F'
    };
    
    return houseColors[house] || '#666666';
  }

  validateNPCData(npcs) {
    if (!Array.isArray(npcs)) {
      throw new Error('NPCs data must be an array');
    }
    
    for (const npc of npcs) {
      if (!npc.id || !npc.name || !npc.house) {
        throw new Error(`Invalid NPC data: missing required fields for ${npc.name || 'unknown'}`);
      }
      
      if (!npc.traits || typeof npc.traits !== 'object') {
        throw new Error(`Invalid traits data for NPC ${npc.name}`);
      }
    }
    
    return true;
  }
}

export default new NPCService();