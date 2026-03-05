/**
 * CrossArcSynergyEngine
 * 
 * Manages connections between narrative arcs, tracks cross-references,
 * and ensures synergistic storytelling across multiple storylines.
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface NarrativeArcConnection {
  id: string;
  sourceArc: string;
  targetArc: string;
  connectionType: ArcConnectionType;
  strength: number; // 0-1
  chapterEstablished: number;
  synergyPoint: SynergyPoint | null;
  reciprocal: boolean;
  evolution: ConnectionEvolution[];
}

export type ArcConnectionType = 
  | 'causal'           // One arc causes events in another
  | 'thematic'         // Shared themes between arcs
  | 'character'        // Shared characters between arcs
  | 'setting'          // Shared locations/settings
  | 'temporal'         // Connected in time
  | 'parallel'         // Running in parallel with similar beats
  | 'contrast'         // Running in parallel with opposing beats
  | 'subtext'          // Hidden connections
  | 'mirror'           // Reflecting each other
  | 'convergence'      // Leading to same point
  | 'divergence'       // Splitting from same point
  | 'nested'           // One arc contains another
  | 'tangential'       // Lightly connected
  | 'causal_chain'     // Chain of cause-effect across arcs
  | 'echo';            // One arc echoes elements of another

export interface SynergyPoint {
  chapter: number;
  arcs: string[];
  type: SynergyType;
  description: string;
  significance: number; // 0-1
  resolution: string | null;
}

export type SynergyType = 
  | 'convergence'      // Arcs come together
  | 'divergence'       // Arcs split apart
  | 'intersection'     // Arcs cross paths
  | 'catalyst'         // One arc triggers another
  | 'resolution'       // Shared resolution
  | 'revelation'       // Connection revealed
  | 'climax'           // Shared climax
  | 'mirror_moment'    // Reflecting moments
  | 'payoff'           // Combined payoff
  | 'subversion';      // Expected connection subverted

export interface ConnectionEvolution {
  chapter: number;
  changeType: 'strengthened' | 'weakened' | 'transformed' | 'revealed' | 'severed';
  reason: string;
  previousStrength: number;
  newStrength: number;
}

// ============================================================================
// ARC SYNERGY NETWORK
// ============================================================================

export interface ArcSynergyNetwork {
  arcs: ArcNode[];
  connections: ArcConnection[];
  clusters: ArcCluster[];
  centralArc: string | null;
  density: number;
}

export interface ArcNode {
  arcId: string;
  name: string;
  type: ArcType;
  status: ArcStatus;
  connectionCount: number;
  centralityScore: number;
  chapterRange: { start: number; end: number };
}

export type ArcType = 
  | 'main'
  | 'sub'
  | 'character'
  | 'world'
  | 'theme'
  | 'relationship'
  | 'mystery'
  | 'romance'
  | 'conflict'
  | 'growth'
  | 'redemption'
  | 'revenge'
  | 'quest'
  | 'discovery'
  | 'transformation';

export type ArcStatus = 
  | 'active'
  | 'dormant'
  | 'completed'
  | 'abandoned'
  | 'merged'
  | 'split';

export interface ArcConnection {
  source: string;
  target: string;
  weight: number;
  type: ArcConnectionType;
}

export interface ArcCluster {
  id: string;
  name: string;
  arcs: string[];
  sharedTheme: string;
  cohesion: number;
  collectiveProgress: number;
}

// ============================================================================
// CROSS-REFERENCE TRACKING
// ============================================================================

export interface CrossReference {
  id: string;
  type: ReferenceType;
  sourceArc: string;
  sourceChapter: number;
  targetArc: string;
  targetChapter: number | null;
  reference: string;
  significance: number;
  fulfilled: boolean;
  fulfillmentChapter?: number;
}

export type ReferenceType = 
  | 'foreshadowing'
  | 'callback'
  | 'echo'
  | 'parallel'
  | 'contrast'
  | 'mystery_seed'
  | 'character_cameo'
  | 'setting_reference'
  | 'theme_reinforcement'
  | 'symbolic_link'
  | 'plot_device'
  | 'prophecy'
  | 'legend'
  | 'history';

// ============================================================================
// SYNERGY RULES
// ============================================================================

export interface SynergyRule {
  id: string;
  name: string;
  condition: SynergyCondition;
  action: SynergyAction;
  priority: number;
  enabled: boolean;
}

export interface SynergyCondition {
  type: 'arc_stage' | 'character_state' | 'theme_present' | 'connection_strength' | 'custom';
  parameters: Record<string, any>;
}

export interface SynergyAction {
  type: 'create_connection' | 'strengthen_connection' | 'create_synergy_point' | 'trigger_event';
  parameters: Record<string, any>;
}

// ============================================================================
// SYNERGY METRICS
// ============================================================================

export interface SynergyMetrics {
  totalConnections: number;
  averageStrength: number;
  networkDensity: number;
  centralArcs: string[];
  orphanArcs: string[];
  synergyPointsCreated: number;
  synergyPointsResolved: number;
  crossReferences: number;
  fulfilledReferences: number;
}

// ============================================================================
// MAIN ENGINE CLASS
// ============================================================================

export class CrossArcSynergyEngine {
  private arcs: Map<string, ArcNode> = new Map();
  private connections: Map<string, NarrativeArcConnection> = new Map();
  private synergyPoints: Map<string, SynergyPoint> = new Map();
  private crossReferences: Map<string, CrossReference> = new Map();
  private rules: SynergyRule[] = [];
  private network: ArcSynergyNetwork | null = null;
  
  // Cross-system references
  private arcModeling?: any;
  private characterGenome?: any;
  private symbolicTracker?: any;

  constructor() {
    this.initializeDefaultRules();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private initializeDefaultRules(): void {
    // Rule: Create synergy point when arcs are in compatible stages
    this.rules.push({
      id: 'synergy-stage-match',
      name: 'Stage Match Synergy',
      condition: {
        type: 'arc_stage',
        parameters: { stages: ['climax', 'rising_action'] }
      },
      action: {
        type: 'create_synergy_point',
        parameters: { type: 'convergence' }
      },
      priority: 1,
      enabled: true
    });

    // Rule: Strengthen connection when characters interact
    this.rules.push({
      id: 'character-interaction',
      name: 'Character Interaction Boost',
      condition: {
        type: 'character_state',
        parameters: { interaction: true }
      },
      action: {
        type: 'strengthen_connection',
        parameters: { amount: 0.1 }
      },
      priority: 2,
      enabled: true
    });
  }

  // ==========================================================================
  // ARC MANAGEMENT
  // ==========================================================================

  registerArc(
    arcId: string,
    name: string,
    type: ArcType,
    chapterStart: number,
    chapterEnd?: number
  ): ArcNode {
    const arc: ArcNode = {
      arcId,
      name,
      type,
      status: 'active',
      connectionCount: 0,
      centralityScore: 0,
      chapterRange: {
        start: chapterStart,
        end: chapterEnd || chapterStart
      }
    };

    this.arcs.set(arcId, arc);
    this.recalculateNetwork();
    return arc;
  }

  updateArcStatus(arcId: string, status: ArcStatus): void {
    const arc = this.arcs.get(arcId);
    if (arc) {
      arc.status = status;
      this.recalculateNetwork();
    }
  }

  extendArc(arcId: string, newEndChapter: number): void {
    const arc = this.arcs.get(arcId);
    if (arc) {
      arc.chapterRange.end = newEndChapter;
    }
  }

  // ==========================================================================
  // CONNECTION MANAGEMENT
  // ==========================================================================

  createConnection(
    sourceArc: string,
    targetArc: string,
    type: ArcConnectionType,
    strength: number,
    chapter: number,
    reciprocal: boolean = false
  ): NarrativeArcConnection {
    const connectionId = `conn-${sourceArc}-${targetArc}-${Date.now()}`;

    const connection: NarrativeArcConnection = {
      id: connectionId,
      sourceArc,
      targetArc,
      connectionType: type,
      strength,
      chapterEstablished: chapter,
      synergyPoint: null,
      reciprocal,
      evolution: []
    };

    this.connections.set(connectionId, connection);

    // Update arc connection counts
    const sourceNode = this.arcs.get(sourceArc);
    const targetNode = this.arcs.get(targetArc);
    if (sourceNode) sourceNode.connectionCount++;
    if (targetNode) targetNode.connectionCount++;

    // Create reciprocal connection if specified
    if (reciprocal) {
      this.createConnection(targetArc, sourceArc, type, strength, chapter, false);
    }

    this.recalculateNetwork();
    return connection;
  }

  evolveConnection(
    connectionId: string,
    changeType: ConnectionEvolution['changeType'],
    reason: string,
    chapter: number,
    strengthDelta: number = 0
  ): void {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      console.warn(`Connection ${connectionId} not found`);
      return;
    }

    const previousStrength = connection.strength;
    const newStrength = Math.max(0, Math.min(1, connection.strength + strengthDelta));

    connection.evolution.push({
      chapter,
      changeType,
      reason,
      previousStrength,
      newStrength
    });

    connection.strength = newStrength;

    if (changeType === 'severed') {
      connection.strength = 0;
    }

    this.recalculateNetwork();
  }

  getConnectionsForArc(arcId: string): NarrativeArcConnection[] {
    return Array.from(this.connections.values()).filter(
      c => c.sourceArc === arcId || c.targetArc === arcId
    );
  }

  // ==========================================================================
  // SYNERGY POINT MANAGEMENT
  // ==========================================================================

  createSynergyPoint(
    chapter: number,
    arcs: string[],
    type: SynergyType,
    description: string,
    significance: number = 0.5
  ): SynergyPoint {
    const synergyId = `synergy-${chapter}-${Date.now()}`;

    const synergyPoint: SynergyPoint = {
      chapter,
      arcs,
      type,
      description,
      significance,
      resolution: null
    };

    this.synergyPoints.set(synergyId, synergyPoint);

    // Link to existing connections
    arcs.forEach(arcId => {
      const connections = this.getConnectionsForArc(arcId);
      connections.forEach(conn => {
        if (arcs.includes(conn.sourceArc) && arcs.includes(conn.targetArc)) {
          conn.synergyPoint = synergyPoint;
        }
      });
    });

    return synergyPoint;
  }

  resolveSynergyPoint(synergyId: string, resolution: string): void {
    const synergyPoint = this.synergyPoints.get(synergyId);
    if (synergyPoint) {
      synergyPoint.resolution = resolution;
    }
  }

  getSynergyPointsForChapter(chapter: number): SynergyPoint[] {
    return Array.from(this.synergyPoints.values()).filter(
      sp => sp.chapter === chapter
    );
  }

  // ==========================================================================
  // CROSS-REFERENCE MANAGEMENT
  // ==========================================================================

  createCrossReference(
    type: ReferenceType,
    sourceArc: string,
    sourceChapter: number,
    targetArc: string,
    reference: string,
    significance: number = 0.5
  ): CrossReference {
    const refId = `ref-${sourceArc}-${targetArc}-${Date.now()}`;

    const crossRef: CrossReference = {
      id: refId,
      type,
      sourceArc,
      sourceChapter,
      targetArc,
      targetChapter: null,
      reference,
      significance,
      fulfilled: false
    };

    this.crossReferences.set(refId, crossRef);
    return crossRef;
  }

  fulfillCrossReference(
    refId: string,
    targetChapter: number
  ): void {
    const crossRef = this.crossReferences.get(refId);
    if (crossRef) {
      crossRef.fulfilled = true;
      crossRef.fulfillmentChapter = targetChapter;
      crossRef.targetChapter = targetChapter;
    }
  }

  getPendingCrossReferences(targetArc: string): CrossReference[] {
    return Array.from(this.crossReferences.values()).filter(
      ref => ref.targetArc === targetArc && !ref.fulfilled
    );
  }

  // ==========================================================================
  // NETWORK ANALYSIS
  // ==========================================================================

  private recalculateNetwork(): void {
    const arcNodes = Array.from(this.arcs.values());
    const arcConnections: ArcConnection[] = [];

    this.connections.forEach(conn => {
      arcConnections.push({
        source: conn.sourceArc,
        target: conn.targetArc,
        weight: conn.strength,
        type: conn.connectionType
      });
    });

    // Calculate centrality scores
    const centralityMap = this.calculateCentrality(arcNodes, arcConnections);
    arcNodes.forEach(node => {
      node.centralityScore = centralityMap.get(node.arcId) || 0;
    });

    // Identify clusters
    const clusters = this.identifyClusters(arcNodes, arcConnections);

    // Find central arc (highest centrality)
    const sortedNodes = [...arcNodes].sort((a, b) => b.centralityScore - a.centralityScore);
    const centralArc = sortedNodes.length > 0 ? sortedNodes[0].arcId : null;

    // Calculate density
    const possibleConnections = arcNodes.length * (arcNodes.length - 1);
    const density = possibleConnections > 0 ? arcConnections.length / possibleConnections : 0;

    this.network = {
      arcs: arcNodes,
      connections: arcConnections,
      clusters,
      centralArc,
      density
    };
  }

  private calculateCentrality(
    nodes: ArcNode[],
    connections: ArcConnection[]
  ): Map<string, number> {
    const centrality = new Map<string, number>();
    const connectionCounts = new Map<string, number>();
    const totalWeight = new Map<string, number>();

    nodes.forEach(node => {
      connectionCounts.set(node.arcId, 0);
      totalWeight.set(node.arcId, 0);
    });

    connections.forEach(conn => {
      connectionCounts.set(conn.source, (connectionCounts.get(conn.source) || 0) + 1);
      connectionCounts.set(conn.target, (connectionCounts.get(conn.target) || 0) + 1);
      totalWeight.set(conn.source, (totalWeight.get(conn.source) || 0) + conn.weight);
      totalWeight.set(conn.target, (totalWeight.get(conn.target) || 0) + conn.weight);
    });

    nodes.forEach(node => {
      const connections = connectionCounts.get(node.arcId) || 0;
      const weight = totalWeight.get(node.arcId) || 0;
      const score = (connections * 0.5 + weight * 0.5) / nodes.length;
      centrality.set(node.arcId, score);
    });

    return centrality;
  }

  private identifyClusters(
    nodes: ArcNode[],
    connections: ArcConnection[]
  ): ArcCluster[] {
    const clusters: ArcCluster[] = [];
    const visited = new Set<string>();

    // Simple clustering based on connection density
    nodes.forEach(node => {
      if (visited.has(node.arcId)) return;

      const clusterArcs = new Set<string>();
      clusterArcs.add(node.arcId);

      // Find connected nodes
      connections.forEach(conn => {
        if (conn.source === node.arcId || conn.target === node.arcId) {
          clusterArcs.add(conn.source);
          clusterArcs.add(conn.target);
        }
      });

      if (clusterArcs.size > 1) {
        clusterArcs.forEach(id => visited.add(id));

        clusters.push({
          id: `cluster-${clusters.length}`,
          name: `Cluster ${clusters.length + 1}`,
          arcs: Array.from(clusterArcs),
          sharedTheme: 'Connected arcs',
          cohesion: 0.7,
          collectiveProgress: 0.5
        });
      }
    });

    return clusters;
  }

  // ==========================================================================
  // SYNERGY DETECTION
  // ==========================================================================

  detectPotentialSynergies(currentChapter: number): PotentialSynergy[] {
    const potentials: PotentialSynergy[] = [];
    const activeArcs = Array.from(this.arcs.values()).filter(a => a.status === 'active');

    // Check for arcs that could converge
    for (let i = 0; i < activeArcs.length; i++) {
      for (let j = i + 1; j < activeArcs.length; j++) {
        const arc1 = activeArcs[i];
        const arc2 = activeArcs[j];

        // Check if arcs overlap in chapter range
        const overlap = this.checkChapterOverlap(arc1, arc2);

        if (overlap) {
          const existingConnection = Array.from(this.connections.values()).find(
            c => (c.sourceArc === arc1.arcId && c.targetArc === arc2.arcId) ||
                 (c.sourceArc === arc2.arcId && c.targetArc === arc1.arcId)
          );

          if (!existingConnection || existingConnection.strength < 0.3) {
            potentials.push({
              arc1: arc1.arcId,
              arc2: arc2.arcId,
              type: 'potential_connection',
              reason: 'Arcs overlap in timeline without strong connection',
              chapter: currentChapter,
              priority: 0.5
            });
          }

          // Check for potential synergy points
          if (existingConnection && existingConnection.strength > 0.5) {
            potentials.push({
              arc1: arc1.arcId,
              arc2: arc2.arcId,
              type: 'potential_synergy_point',
              reason: 'Strong connection suggests synergy opportunity',
              chapter: currentChapter,
              priority: 0.7
            });
          }
        }
      }
    }

    return potentials;
  }

  private checkChapterOverlap(arc1: ArcNode, arc2: ArcNode): boolean {
    return !(arc1.chapterRange.end < arc2.chapterRange.start ||
             arc2.chapterRange.end < arc1.chapterRange.start);
  }

  // ==========================================================================
  // METRICS
  // ==========================================================================

  getMetrics(): SynergyMetrics {
    const totalConnections = this.connections.size;
    const averageStrength = Array.from(this.connections.values())
      .reduce((sum, c) => sum + c.strength, 0) / (totalConnections || 1);

    const orphanArcs = Array.from(this.arcs.values())
      .filter(a => a.connectionCount === 0)
      .map(a => a.arcId);

    const centralArcs = Array.from(this.arcs.values())
      .filter(a => a.centralityScore > 0.5)
      .map(a => a.arcId);

    const synergyPointsCreated = this.synergyPoints.size;
    const synergyPointsResolved = Array.from(this.synergyPoints.values())
      .filter(sp => sp.resolution !== null).length;

    const crossReferences = this.crossReferences.size;
    const fulfilledReferences = Array.from(this.crossReferences.values())
      .filter(ref => ref.fulfilled).length;

    return {
      totalConnections,
      averageStrength,
      networkDensity: this.network?.density || 0,
      centralArcs,
      orphanArcs,
      synergyPointsCreated,
      synergyPointsResolved,
      crossReferences,
      fulfilledReferences
    };
  }

  // ==========================================================================
  // ANALYSIS
  // ==========================================================================

  analyzeArc(arcId: string): ArcSynergyAnalysis {
    const arc = this.arcs.get(arcId);
    if (!arc) {
      return {
        exists: false,
        connections: [],
        synergyPoints: [],
        crossReferences: [],
        metrics: null,
        recommendations: []
      };
    }

    const connections = this.getConnectionsForArc(arcId);
    const synergyPoints = Array.from(this.synergyPoints.values())
      .filter(sp => sp.arcs.includes(arcId));
    const crossRefs = Array.from(this.crossReferences.values())
      .filter(ref => ref.sourceArc === arcId || ref.targetArc === arcId);

    const recommendations: string[] = [];
    if (connections.length === 0) {
      recommendations.push('Arc has no connections - consider linking to other arcs');
    }
    if (arc.centralityScore < 0.2 && arc.type === 'main') {
      recommendations.push('Main arc has low centrality - may need more connections');
    }
    if (synergyPoints.length === 0 && connections.length > 2) {
      recommendations.push('Multiple connections but no synergy points - consider creating one');
    }

    return {
      exists: true,
      connections,
      synergyPoints,
      crossReferences,
      metrics: {
        connectionCount: connections.length,
        averageConnectionStrength: connections.reduce((s, c) => s + c.strength, 0) / (connections.length || 1),
        centralityScore: arc.centralityScore,
        synergyPointCount: synergyPoints.length
      },
      recommendations
    };
  }

  // ==========================================================================
  // EXPORT / IMPORT
  // ==========================================================================

  exportState(): SynergyEngineState {
    return {
      arcs: Array.from(this.arcs.entries()),
      connections: Array.from(this.connections.entries()),
      synergyPoints: Array.from(this.synergyPoints.entries()),
      crossReferences: Array.from(this.crossReferences.entries()),
      rules: this.rules,
      network: this.network
    };
  }

  importState(state: SynergyEngineState): void {
    this.arcs = new Map(state.arcs);
    this.connections = new Map(state.connections);
    this.synergyPoints = new Map(state.synergyPoints);
    this.crossReferences = new Map(state.crossReferences);
    this.rules = state.rules;
    this.network = state.network;
  }

  reset(): void {
    this.arcs.clear();
    this.connections.clear();
    this.synergyPoints.clear();
    this.crossReferences.clear();
    this.rules = [];
    this.network = null;
    this.initializeDefaultRules();
  }

  /**
   * Set cross-system references for CrossArcSynergyEngine
   */
  setSystems(systems: {
    arcModeling?: any;
    characterGenome?: any;
    symbolicTracker?: any;
  }): void {
    this.arcModeling = systems.arcModeling;
    this.characterGenome = systems.characterGenome;
    this.symbolicTracker = systems.symbolicTracker;
  }

  /**
   * Get system status including cross-system connectivity
   */
  getSystemStatus(): {
    arcsCount: number;
    connectionsCount: number;
    synergyPointsCount: number;
    connectedSystems: string[];
  } {
    const connectedSystems: string[] = [];
    if (this.arcModeling) connectedSystems.push('arcModeling');
    if (this.characterGenome) connectedSystems.push('characterGenome');
    if (this.symbolicTracker) connectedSystems.push('symbolicTracker');

    return {
      arcsCount: this.arcs.size,
      connectionsCount: this.connections.size,
      synergyPointsCount: this.synergyPoints.size,
      connectedSystems
    };
  }
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface PotentialSynergy {
  arc1: string;
  arc2: string;
  type: 'potential_connection' | 'potential_synergy_point' | 'weak_connection';
  reason: string;
  chapter: number;
  priority: number;
}

export interface ArcSynergyAnalysis {
  exists: boolean;
  connections: NarrativeArcConnection[];
  synergyPoints: SynergyPoint[];
  crossReferences: CrossReference[];
  metrics: {
    connectionCount: number;
    averageConnectionStrength: number;
    centralityScore: number;
    synergyPointCount: number;
  } | null;
  recommendations: string[];
}

export default CrossArcSynergyEngine;