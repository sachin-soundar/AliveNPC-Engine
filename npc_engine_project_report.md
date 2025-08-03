# NPC Engine Project - Detailed Information Report

## Project Overview

**Core Concept**: An AI-orchestrated NPC engine that creates hundreds of Non-Player Characters with varied personas, backgrounds, and behavioral traits. The system simulates mass behavioral changes in response to world events, demonstrated through a Game of Thrones-inspired setting.

**Primary Objective**: Showcase how dynamic NPCs can make any game scenario wild and fun based on player activities. The Game of Thrones world serves as an example scenario to demonstrate the engine's capabilities.

## Project Scale & Datasets

### NPC Population
- **Primary Dataset**: 100 NPCs across 10 major houses
- **Extended Dataset**: 300 NPCs for larger-scale testing
- **Distribution**: Uneven numbers per house reflecting their power, influence, and population size
- **Uniqueness**: Each NPC must be completely random and unique within their respective datasets

### House Structure (10 Major Houses)
1. **House Stark** (North) - Major house, large territory
2. **House Lannister** (Westerlands) - Wealthy, influential
3. **House Baratheon** (Stormlands) - Royal house with internal conflicts
4. **House Targaryen** (Exiled) - Smaller numbers, high resentment
5. **House Greyjoy** (Iron Islands) - Island population
6. **House Tully** (Riverlands) - Strategic location
7. **House Tyrell** (Reach) - Abundant resources
8. **House Martell** (Dorne) - Southern kingdom
9. **House Arryn** (Vale) - Mountain stronghold
10. **Dothraki Clans** (Essos) - Large nomadic population

## NPC Character Structure

### Basic Information
- **Name**: Original names only (NO canonical character names from the show)
- **House Affiliation**: Full house name format (e.g., "Ser Gareth of House Stark")
- **Age**: Affects personality traits (young = impulsive, old = wise/cynical)
- **Gender**: Male/Female distribution
- **Role**: Lords/Ladies (5%), Knights (15%), Maesters (5%), Merchants (10%), Soldiers (30%), Servants (20%), Craftsmen (15%)

### Trait System (0-100% Scale)
**Core Traits**:
- **Honor**: 0% = completely dishonorable, 100% = Ned Stark level integrity
- **Loyalty**: Devotion to house/family vs personal gain
- **Intelligence**: Strategic thinking, book smarts
- **Emotional Intelligence**: Reading people, social manipulation ability
- **Evil/Cruelty**: 0% = saint-like, 100% = Joffrey-level cruelty
- **Selflessness**: Personal sacrifice for others

**Game of Thrones Specific Traits**:
- **Ambition**: Desire for power, throne, advancement
- **Combat Skill**: Fighting ability, military prowess
- **Political Cunning**: Scheming, alliance-making, court intrigue
- **Religious Devotion**: Faith in Old Gods, Seven, Lord of Light, etc.

### Relationship System
- **Family Ties**: Blood relations within and across houses
- **Alliances**: Political and personal partnerships
- **Enemies**: Hostile relationships and feuds
- **Romantic Interests**: Personal connections affecting loyalty

### Dynamic States
- **Current Behavior**: Short description of present mindset/actions
- **Location**: Geographic position in the world
- **Status**: Alive/Dead/Exiled/Imprisoned
- **Current Mood**: Emotional state affected by recent events
- **Recent Actions**: History of decisions and behaviors

## World Events System

### Timeline & Starting Point
- **Beginning**: Jon Arryn's death (opening of the TV show)
- **Event Count**: 30-40 major events covering the entire Game of Thrones storyline
- **Initial State**: Decade of peace with underlying tensions

### Event Structure Requirements
**Comprehensive Political Context**: Each event must detail implications for ALL houses, not just primary participants.

**Example Event Format**:
```
Event: "Lord Ned Stark of House Stark executed by King Joffrey Baratheon"

Political Context:
- House Stark vs House Lannister: Open war declared, honor vs pragmatism clash
- House Baratheon Split: Stannis Baratheon vs Renly Baratheon factions emerge
- Northern Houses: Rally behind Stark cause, loyalty surge to House Stark
- Common Folk: Terror of arbitrary royal justice, self-preservation mode activated
- Religious Communities: Question divine right of kings, faith shaken
- Economic Impact: Trade disrupted, resources hoarded
```

### Event Characteristics
- **Frequency**: Regular intervals (testing phase: every 30 seconds)
- **Impact Scope**: Mass behavioral shifts affecting hundreds of NPCs simultaneously
- **Cascading Effects**: Events trigger secondary consequences and relationship changes
- **Notable Changes**: Each event must have significant, measurable implications

### Key Event Types
- Royal deaths and succession crises
- Major battles and wars
- Political betrayals (Red Wedding, etc.)
- Religious movements and revelations
- Economic disruptions
- Natural disasters and supernatural events
- Dragon returns and magical elements

## Initial State Configuration

### Starting Conditions (Decade of Peace)
- **Most Houses**: High honor (60-90%), strong loyalty (70-95%), moderate ambition
- **House Targaryen**: High ambition and resentment, low loyalty to current regime
- **Common Folk**: Content, trusting of authority, stable economic conditions
- **Religious Groups**: Stable faith, moderate devotion levels
- **Inter-House Relations**: Peaceful coexistence with underlying historical tensions

## Behavioral Evolution System

### Persona Engine Integration
- **Separate AI Agent**: Dedicated persona agent handles all behavioral changes
- **Event Listening**: Agent monitors world events and assigns appropriate behavioral shifts
- **Trait Modification**: Both permanent changes and temporary fluctuations
- **Relationship Dynamics**: Bonds strengthen/weaken based on shared experiences and actions

### Change Mechanisms
- **Immediate Responses**: Instant reactions to major events
- **Gradual Evolution**: Slow personality shifts over time
- **Relationship Formation**: New alliances based on shared trauma/interests
- **Randomness Factor**: Unpredictable elements to maintain NPC authenticity

## Frontend Visualization Requirements

### Testing Phase Interface
- **Simple Display**: List format showing names, current behaviors, and traits
- **Trait Visualization**: All percentage-based traits clearly displayed
- **Behavior Summary**: One-line descriptions of current NPC mindset
- **House Grouping**: NPCs organized by their house affiliations

### Full Vision (Future Development)
- **Canvas Layout**: Interactive visual space with NPC representations
- **Image-Based NPCs**: Each character represented by an image/avatar
- **Behavior Text**: Short current behavior description visible beneath each NPC
- **Hover Functionality**: Detailed trait information on mouse-over
- **House Clustering**: Visual grouping of NPCs by their house boundaries
- **Dynamic Updates**: Real-time changes visible as events trigger

### Gamification Elements
- **Mass Behavioral Visualization**: Show how events create ripple effects across populations
- **Individual Character Tracking**: Follow specific NPCs through their personal evolution
- **House Loyalty Meters**: Aggregate statistics for each house's overall state
- **Relationship Networks**: Visual connections between allied and enemy NPCs

## Data Management Structure

### File Organization
- **NPC Datasets**: Separate JSON files for 100 and 300 NPC configurations
- **World Events**: Comprehensive timeline with detailed political implications
- **House Definitions**: Characteristics and starting conditions for each house
- **Relationship Mapping**: Connection data between NPCs across houses
- **Behavioral States**: Current conditions and recent changes for each character

### Data Persistence
- **Historical Tracking**: Record of all behavioral changes and their triggers
- **Relationship Evolution**: History of how alliances and enmities developed
- **Event Impact Logs**: Documentation of how each world event affected the population
- **Recovery Mechanisms**: Ability to restore previous states for testing purposes

## Project Goals & Success Metrics

### Primary Objectives
- **Dynamic Storytelling**: Demonstrate how NPCs can create emergent narratives
- **Behavioral Realism**: Show believable responses to political and social upheaval
- **Mass Psychology**: Simulate how events affect large populations simultaneously
- **Individual Character Depth**: Maintain unique personalities within group dynamics

### Success Indicators
- **Believable Reactions**: NPC responses feel appropriate to their personalities and circumstances
- **Relationship Evolution**: Alliances and conflicts develop naturally based on shared experiences
- **House Dynamics**: Each house maintains distinct cultural characteristics while adapting to events
- **Emergent Behavior**: Unexpected but logical character developments arise from event combinations

## Technical Integration Points

### AI Agent Interface
- **Event Processing**: Clear data format for the persona agent to interpret world events
- **Behavioral Updates**: Standardized method for the agent to modify NPC traits and relationships
- **Relationship Management**: System for the agent to create, modify, and dissolve connections between NPCs
- **State Persistence**: Reliable method to save and restore NPC configurations

### Scalability Considerations
- **Performance Testing**: Ability to handle both 100 and 300 NPC datasets efficiently
- **Event Processing Speed**: System capable of handling regular event triggers without lag
- **Data Growth Management**: Accommodation for expanding relationship networks and behavioral histories
- **Future Expansion**: Architecture flexible enough to add new houses, traits, or event types

This NPC engine represents a comprehensive system for creating dynamic, believable virtual populations that respond realistically to changing circumstances while maintaining individual character depth and authentic relationship dynamics.