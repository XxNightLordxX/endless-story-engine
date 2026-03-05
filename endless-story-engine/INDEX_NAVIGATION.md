# AI Story Engine - Quick Navigation & Location Index

## Table of Contents
1. [Line Number Quick Reference](#1-line-number-quick-reference)
2. [Method Location Index](#2-method-location-index)
3. [Interface & Type Location Index](#3-interface--type-location-index)
4. [Export Statement Location Index](#4-export-statement-location-index)
5. [Error & Exception Location Map](#5-error--exception-location-map)
6. [System Entry Points](#6-system-entry-points)
7. [Web Search Integration Points](#7-web-search-integration-points)
8. [Property & Field Location Index](#8-property--field-location-index)
9. [Cache Location Map](#9-cache-location-map)
10. [Import Statement Map](#10-import-statement-map)
11. [Constructor Parameter Index](#11-constructor-parameter-index)
12. [Private vs Public Method Index](#12-private-vs-public-method-index)
13. [Async Method Location Index](#13-async-method-location-index)
14. [Return Type Quick Reference](#14-return-type-quick-reference)
15. [Configuration Option Location](#15-configuration-option-location)
16. [Validation Rule Location Index](#16-validation-rule-location-index)
17. [Type Error Common Locations](#17-type-error-common-locations)
18. [Build Error Pattern Index](#18-build-error-pattern-index)
19. [Comment & Documentation Location](#19-comment--documentation-location)
20. [Test Location Placeholder](#20-test-location-placeholder)

---

## 1. Line Number Quick Reference

| System | Lines | Key Interfaces | Key Methods |
|--------|-------|----------------|-------------|
| CinematicChoreographyEngine | 1,738 | CinematicScene, LightingDesign | choreographScene, designLighting |
| ExperimentalNarrativeModes | 1,424 | NarrativeMode, ParallelTimeline | activateMode, manageTimelines |
| CharacterContinuityGenome | 1,423 | CharacterGenome, CoreTrait | initializeGenome, checkContinuity |
| NarrativeRepairSystem | 1,359 | NarrativeIssue, RepairResult | analyzeNarrative, applyAutoFixes |
| PredictiveArcModeling | 1,324 | NarrativeArc, ArcSimulation | simulateArcFuture, predictEngagement |
| DialogueIntelligenceSystem | 1,281 | CharacterVoiceProfile, DialogueAnalysis | analyzeDialogue, generateVoice |
| AdvancedStoryEngine | 1,278 | AdvancedStoryEngineConfig, NarrativeContext | generateCompleteChapter, validateNarrative |
| MetaCognitionSystem | 1,250 | NarrativeChoice, ValidationResult | validateNarrativeChoice, selfCorrect |
| MultiThreadNarrativeScheduler | 1,244 | NarrativeThread, ThreadWeave | scheduleThreads, weaveNarratives |
| CrossArcSynergyEngine | 1,209 | NarrativeArc, ArcConnection | manageArcs, analyzeSynergy |
| MoralEthicalDecisionEngine | 1,170 | MoralFramework, EthicalAnalysis | analyzeDilemmas, evaluateOptions |
| DynamicWorldSimulation | 1,147 | WorldState, FactionState | simulateWorld, handleFactions |
| SymbolicLogicTracker | 1,100 | SymbolicElement, Theme | trackSymbols, analyzeThemes |
| StructuralIntegrityLayer | 836 | NarrativeStructure, StructuralIssue | analyzeStructure, checkConsistency |
| CreativeContentGenerator | 831 | GenerationContext, GeneratedContent | generateContent, applyCreativity |
| RealityBreachLogicFramework | 825 | RealityBreach, BreachManifestation | detectBreaches, manifestBreaches |
| ItemSystem | 640 | ItemRarity, SkillCategory | generateItem, generateSkill |
| WorldBuilder | 602 | WorldState, VRWorldState | buildRealWorld, buildVRWorld |
| ThreatScalingSystem | 572 | ThreatProfile, ScaledEncounter | scaleThreat, createEncounter |
| MemorySystem | 563 | MemoryEntry, RelationshipState | addMemory, trackRelationships |
| ThemeManager | 547 | Theme, Symbol | establishTheme, manageSymbols |
| CinematicEnhancer | 542 | SpatialContext, CinematicShot | establishSpatialContext, composeShot |
| WebSearchIntegration | 493 | WebSearchResult, WebSearchConfig | search, clearCache |
| SystemScreenGenerator | 481 | SystemScreen, HUDOverlay | generateSystemMessage, createHUD |
| StatMerging | 474 | StatMergeConfig, SyncEvent | mergeStats, handleSync |
| QualityControl | 469 | QualityMetrics, RewriteSuggestion | validate, calculateMetrics |
| LoreManager | 466 | LoreEntry, PlotThread | addLore, manageThreads |
| ConflictManager | 453 | Conflict, SceneConflict | generateConflict, layerConflicts |
| CharacterIntelligence | 450 | CharacterMotivation, CharacterArc | generateCharacter, developArc |
| PacingSystem | 443 | PacingConfiguration, ToneOptions | calculatePacing, setAtmosphere |
| ChapterMemory | 340 | ChapterEvent, StoryArc | trackEvents, recordArcs |
| NarrativeLogic | 332 | NarrativeArc, ScenePurpose | determineScenePurpose, calculateSceneTension |
| AIStoryEngine | 238 | StoryGenerationOptions, NarrativeState | generate, validate |
| WorldFlowManager | 217 | FlowConfiguration, FlowState | configureFlow, manageTransitions |
| UnifiedStoryEngine | 1,143 | StoryEngineConfig, GenerationResult | generateChapter, exportState |

**Total Lines: 28,904**

---

## 2. Method Location Index (A-F)

Quick alphabetical reference for finding method implementations. Format: `methodName(file:line)` - Visibility

### A
| Method | Location | Visibility | Purpose |
|--------|----------|------------|---------|
| addBaseContent | CreativeContentGenerator.ts:273 | private | Add base content to pools |
| addChapterToArc | CrossArcSynergyEngine.ts:488 | public | Add chapter to narrative arc |
| addEvent | ChapterMemory.ts:159 | public | Record chapter event |
| addToThematicMap | CrossArcSynergyEngine.ts:451 | private | Map theme to arc |
| addCharacterMemory | ChapterMemory.ts:184 | public | Add character memory |
| analyzeAtmosphere | CinematicChoreographyEngine.ts:1505 | private | Analyze scene atmosphere |
| analyzeEmotionalArc | CinematicChoreographyEngine.ts:1272 | private | Analyze emotional beats |
| analyzePacing | CinematicChoreographyEngine.ts:1420 | private | Calculate pacing profile |
| analyzeScene | CinematicChoreographyEngine.ts:439 | public | Main scene analysis entry |
| analyzeSynergy | CrossArcSynergyEngine.ts:708 | public | Analyze arc synergy |
| applyEmotionalEvent | CharacterContinuityGenome.ts:1170 | private | Process emotional event |
| applyGrowthMilestone | CharacterContinuityGenome.ts:1201 | private | Apply character growth |
| applyMemoryFormation | CharacterContinuityGenome.ts:1180 | private | Form character memory |
| applyRelationshipChange | CharacterContinuityGenome.ts:1102 | private | Update relationships |
| applySkillGain | CharacterContinuityGenome.ts:1137 | private | Add character skill |
| applyTraitChange | CharacterContinuityGenome.ts:1087 | private | Modify character trait |
| applyWorldLogic | AIStoryEngine.ts:130 | private | Apply world-specific logic |

### B
| Method | Location | Visibility | Purpose |
|--------|----------|------------|---------|
| balanceArcs | CrossArcSynergyEngine.ts:801 | public | Balance multiple arcs |
| buildContentPools | CreativeContentGenerator.ts:192 | private | Build content pools |
| buildNameSearchQuery | AdvancedStoryEngine.ts:889 | private | Construct name search |
| buildSearchQuery | CreativeContentGenerator.ts:160 | private | Build web search query |

### C
| Method | Location | Visibility | Purpose |
|--------|----------|------------|---------|
| calculateAtmosphereIntensity | CinematicChoreographyEngine.ts:1545 | private | Measure atmosphere |
| calculateBalanceScore | CrossArcSynergyEngine.ts:772 | private | Score arc balance |
| calculateBreathingRoom | CinematicChoreographyEngine.ts:1449 | private | Calculate pacing breaks |
| calculateChapterImportance | CrossArcSynergyEngine.ts:517 | private | Weight chapter in arc |
| calculateDependencyHealth | CrossArcSynergyEngine.ts:746 | private | Check dependencies |
| calculateMomentum | CinematicChoreographyEngine.ts:1489 | private | Calculate story momentum |
| calculateOverallConsistency | CharacterContinuityGenome.ts:1012 | private | Score character consistency |
| calculateOverallQuality | CinematicChoreographyEngine.ts:1613 | private | Score scene quality |
| calculateOverallSynergy | CrossArcSynergyEngine.ts:732 | private | Score arc synergy |
| calculateQualityScore | AdvancedStoryEngine.ts:1007 | private | Score chapter quality |
| calculateStakes | ConflictManager.ts:284 | private | Determine conflict stakes |
| calculateTechnicalComplexity | CinematicChoreographyEngine.ts:1626 | private | Score technical level |
| calculateThematicCoherence | CrossArcSynergyEngine.ts:756 | private | Score theme coherence |
| calculateTensionCurve | CinematicChoreographyEngine.ts:1438 | private | Map tension over time |
| calculateUniquenessScore | AdvancedStoryEngine.ts:1028 | private | Score content uniqueness |
| calculateVisualBalance | CinematicChoreographyEngine.ts:574 | private | Score visual balance |
| checkBehavioralConsistency | CharacterContinuityGenome.ts:871 | private | Validate behaviors |
| checkEmotionalConsistency | CharacterContinuityGenome.ts:909 | private | Validate emotions |
| checkPatternManifested | CharacterContinuityGenome.ts:901 | private | Check pattern usage |
| checkSkillConsistency | CharacterContinuityGenome.ts:955 | private | Validate skills |
| checkTraitConsistency | CharacterContinuityGenome.ts:816 | private | Validate traits |
| choreographAction | CinematicChoreographyEngine.ts:1135 | private | Design action sequence |
| classifyActionType | CinematicChoreographyEngine.ts:1177 | private | Categorize action |
| classifyShotType | CinematicChoreographyEngine.ts:762 | private | Categorize camera shot |
| clearAllCaches | AdvancedStoryEngine.ts:1169 | public | Reset all caches |
| clearAllData | CinematicChoreographyEngine.ts:1734 | public | Clear scene data |
| countWords | AdvancedStoryEngine.ts:1003 | private | Count text words |
| createArc | CrossArcSynergyEngine.ts:408 | public | Create narrative arc |
| createConnection | CrossArcSynergyEngine.ts:532 | public | Link story elements |
| createConvergencePoint | CrossArcSynergyEngine.ts:654 | public | Create arc convergence |
| createDefaultConflict | ConflictManager.ts:312 | private | Generate default conflict |
| createDependency | CrossArcSynergyEngine.ts:590 | public | Create arc dependency |
| createDivergencePoint | CrossArcSynergyEngine.ts:684 | public | Create arc divergence |
| createUniqueOpening | CreativeContentGenerator.ts:546 | private | Generate unique opening |

### D
| Method | Location | Visibility | Purpose |
|--------|----------|------------|---------|
| designActionPacing | CinematicChoreographyEngine.ts:1233 | private | Time action beats |
| designActionSequence | CinematicChoreographyEngine.ts:1153 | private | Create action beats |
| designAmbientLight | CinematicChoreographyEngine.ts:889 | private | Design ambient lighting |
| designBackLight | CinematicChoreographyEngine.ts:869 | private | Design backlighting |
| designCameraWork | CinematicChoreographyEngine.ts:618 | private | Plan camera movement |
| designFillLight | CinematicChoreographyEngine.ts:849 | private | Design fill lighting |
| designKeyLight | CinematicChoreographyEngine.ts:827 | private | Design key lighting |
| designLighting | CinematicChoreographyEngine.ts:790 | private | Create lighting design |
| designMusicCues | CinematicChoreographyEngine.ts:1009 | private | Plan music moments |
| designShadows | CinematicChoreographyEngine.ts:933 | private | Design shadow patterns |
| designShotList | CinematicChoreographyEngine.ts:740 | private | Create shot list |
| designSound | CinematicChoreographyEngine.ts:946 | private | Design sound profile |
| designSoundscape | CinematicChoreographyEngine.ts:1119 | private | Create soundscape |
| designTransitions | CinematicChoreographyEngine.ts:1393 | private | Plan scene transitions |
| determineAtmosphereTexture | CinematicChoreographyEngine.ts:1554 | private | Classify atmosphere feel |
| determineCameraAngle | CinematicChoreographyEngine.ts:633 | private | Select camera angle |
| determineCameraMovement | CinematicChoreographyEngine.ts:647 | private | Select camera move |
| determineContrast | CinematicChoreographyEngine.ts:902 | private | Calculate contrast |
| determineDepth | CinematicChoreographyEngine.ts:509 | private | Calculate DOF |
| determineFraming | CinematicChoreographyEngine.ts:495 | private | Select frame type |
| determineLightingMood | CinematicChoreographyEngine.ts:815 | private | Set lighting mood |
| determineMovementSpeed | CinematicChoreographyEngine.ts:691 | private | Set move speed |
| determinePerspective | CinematicChoreographyEngine.ts:715 | private | Select POV |
| determinePrimaryAtmosphere | CinematicChoreographyEngine.ts:1518 | private | Main atmosphere type |
| determineSecondaryAtmospheres | CinematicChoreographyEngine.ts:1533 | private | Secondary atmospheres |
| determineStability | CinematicChoreographyEngine.ts:703 | private | Camera stability type |
| determineTransitionType | CinematicChoreographyEngine.ts:1410 | private | Select transition |
| determineWorldForChapter | AIStoryEngine.ts:155 | private | Select world (real/VR) |
| detectEmotion | CinematicChoreographyEngine.ts:1297 | private | Identify emotion |
| detectEmotionalResponse | CharacterContinuityGenome.ts:937 | private | Find emotional response |
| determineLens | CinematicChoreographyEngine.ts:726 | private | Select lens type |

### E
| Method | Location | Visibility | Purpose |
|--------|----------|------------|---------|
| enhanceMotivationsWithCulturalData | AdvancedStoryEngine.ts:957 | private | Add cultural context |
| enhanceSymbolicElementsWithMythology | AdvancedStoryEngine.ts:973 | private | Add myth context |
| enhanceWithSymbolicElement | AdvancedStoryEngine.ts:1108 | private | Add symbolism |
| enhanceWithVisualComposition | AdvancedStoryEngine.ts:1100 | private | Add visuals |
| enforceMinimumWordCount | CreativeContentGenerator.ts:750 | private | Ensure word minimum |
| estimateDuration | CinematicChoreographyEngine.ts:467 | private | Calculate scene length |
| estimateShotDuration | CinematicChoreographyEngine.ts:772 | private | Calculate shot length |
| extractAndAdd | CreativeContentGenerator.ts:232 | private | Extract content to pool |
| extractBackgroundElements | CinematicChoreographyEngine.ts:533 | private | Get background items |
| extractEvents | CreativeContentGenerator.ts:700 | private | Pull events from content |
| extractForegroundElements | CinematicChoreographyEngine.ts:554 | private | Get foreground items |
| extractNamesFromResults | AdvancedStoryEngine.ts:900 | private | Parse names from web |
| extractPhrases | CreativeContentGenerator.ts:251 | private | Extract key phrases |
| extractSummary | ChapterMemory.ts:231 | private | Generate summary |
| extractThemes | CreativeContentGenerator.ts:732 | private | Pull themes |
| extractVisualElements | CinematicChoreographyEngine.ts:1350 | private | Get visual items |

### F
| Method | Location | Visibility | Purpose |
|--------|----------|------------|---------|
| findOrCreateMotif | CinematicChoreographyEngine.ts:1373 | private | Get/create motif |
| generateAnalysis | CinematicChoreographyEngine.ts:1580 | public | Generate full analysis |
| generateBehaviorFromState | AdvancedStoryEngine.ts:1070 | private | Create behavior |
| generateChapter | AIStoryEngine.ts:50 | async | Main chapter generation |
| generateChapter | CreativeContentGenerator.ts:96 | async | Creative chapter gen |
| generateChapterMetadata | AdvancedStoryEngine.ts:1116 | private | Create metadata |
| generateCharacterBehavior | AdvancedStoryEngine.ts:672 | private | Generate behavior |
| generateCharacterDialogue | AdvancedStoryEngine.ts:1081 | private | Create dialogue |
| generateCompleteChapter | AdvancedStoryEngine.ts:269 | async | Full chapter generation |
| generateContinuityRecommendations | CharacterContinuityGenome.ts:1029 | private | Suggest fixes |
| generateFingerprint | AdvancedStoryEngine.ts:953 | private | Create unique ID |
| generateSceneStructure | AdvancedStoryEngine.ts:1035 | private | Build scene structure |
| generateShotList | CinematicChoreographyEngine.ts:740 | private | Create shot list |
| generateSuggestions | CinematicChoreographyEngine.ts:1640 | private | Create suggestions |
| generateTensionPoints | ConflictManager.ts:226 | private | Create tension |
| generateUniqueBodyParagraph | CreativeContentGenerator.ts:564 | private | Create body text |
| generateUniqueClosing | CreativeContentGenerator.ts:612 | private | Create ending |
| generateUniqueElement | AdvancedStoryEngine.ts:506 | async | Create unique element |
| generateUniqueName | AdvancedStoryEngine.ts:930 | private | Create unique name |
| generateUniqueOpening | CreativeContentGenerator.ts:504 | private | Create opening |
| generateUniqueTitle | CreativeContentGenerator.ts:665 | private | Create title |
| generateUniqueContent | CreativeContentGenerator.ts:471 | private | Create unique content |
| generateWorldElements | AdvancedStoryEngine.ts:1092 | private | Create world items |
| getAnalysisHistory | CinematicChoreographyEngine.ts:1727 | public | Get past analyses |
| getContinuityLedger | AdvancedStoryEngine.ts:1179 | public | Get continuity data |
| getDistanceDescription | CinematicEnhancer.ts:399 | private | Describe distance |
| getExpectedBehaviorForTrait | CharacterContinuityGenome.ts:840 | private | Get trait behaviors |
| getFlowManager | AIStoryEngine.ts:218 | public | Get world flow manager |
| getGenerationContext | ChapterMemory.ts:135 | public | Get context for gen |
| getGrowthSuggestions | CharacterContinuityGenome.ts:704 | async | Get growth ideas |
| getMemory | AIStoryEngine.ts:225 | public | Get chapter memory |
| getNarrativeState | AIStoryEngine.ts:169 | public | Get current state |
| getRecentSummaries | ChapterMemory.ts:217 | private | Get past summaries |
| getScene | CinematicChoreographyEngine.ts:1706 | public | Get scene by ID |
| getScenesByChapter | CinematicChoreographyEngine.ts:1720 | public | Get chapter scenes |
| getSystemsStatus | AdvancedStoryEngine.ts:1142 | public | Get all systems status |
| getUnresolvedElements | ConflictManager.ts:275 | private | Get unresolved items |
| getUniqueFromPool | CreativeContentGenerator.ts:630 | private | Get unique item |
| getVisualMotifs | CinematicChoreographyEngine.ts:1713 | public | Get all motifs |

### G-L
| Method | Location | Visibility | Purpose |
|--------|----------|------------|---------|
| getAllScenes | CinematicChoreographyEngine.ts:1699 | public | Get all scenes |
| generateExtensionParagraph | CreativeContentGenerator.ts:792 | private | Extend content |
| generateElementFingerprint | AdvancedStoryEngine.ts:938 | private | Create element ID |
| generateParagraphFingerprint | AdvancedStoryEngine.ts:942 | private | Create paragraph ID |
| generateSynergyRecommendations | CrossArcSynergyEngine.ts:780 | private | Suggest improvements |
| generateActionShot | CinematicChoreographyEngine.ts:1187 | private | Create action shot |
| hashParagraph | CreativeContentGenerator.ts:653 | private | Hash paragraph |
| identifyActionType | CinematicChoreographyEngine.ts:1177 | private | Identify action type |
| identifyAmbientSounds | CinematicChoreographyEngine.ts:960 | private | Get ambient audio |
| identifyEmotionalResponse | CharacterContinuityGenome.ts:937 | private | Find emotional response |
| identifyEnvironmentInteractions | CinematicChoreographyEngine.ts:1215 | private | Get env interactions |
| identifyFocalPoint | CinematicChoreographyEngine.ts:521 | private | Find focal point |
| identifyForegroundElements | CinematicChoreographyEngine.ts:554 | private | Get foreground items |
| identifyLeadingLines | CinematicChoreographyEngine.ts:590 | private | Find leading lines |
| identifyParticipants | CinematicChoreographyEngine.ts:1200 | private | Get action participants |
| identifyPeaks | CinematicChoreographyEngine.ts:1457 | private | Find tension peaks |
| identifyPracticalLights | CinematicChoreographyEngine.ts:912 | private | Get practical lights |
| identifyRequiredSkills | CharacterContinuityGenome.ts:993 | private | Find needed skills |
| identifySilenceCues | CinematicChoreographyEngine.ts:1102 | private | Find silence moments |
| identifySoundEffects | CinematicChoreographyEngine.ts:1073 | private | Get SFX list |
| identifyStrengths | CinematicChoreographyEngine.ts:1659 | private | Find scene strengths |
| identifyVFXRequirements | CinematicChoreographyEngine.ts:1245 | private | Get VFX needs |
| identifyValleys | CinematicChoreographyEngine.ts:1473 | private | Find tension valleys |
| identifyWeaknesses | CinematicChoreographyEngine.ts:1680 | private | Find scene weaknesses |
| initializeCharacterData | CharacterIntelligence.ts:63 | private | Setup character data |
| initializeCharacterGenomes | CharacterContinuityGenome.ts:283 | private | Setup genomes |
| initializeSpatialContexts | CinematicEnhancer.ts:158 | private | Setup spatial data |
| initializeUniqueElementTracker | AdvancedStoryEngine.ts:993 | private | Setup uniqueness |
| isUnique | AdvancedStoryEngine.ts:791 | private | Check uniqueness |
| measureEmotionalIntensity | CinematicChoreographyEngine.ts:1318 | private | Measure intensity |
| locateSceneInWorld | CinematicEnhancer.ts:234 | private | Find scene location |

### M-P
| Method | Location | Visibility | Purpose |
|--------|----------|------------|---------|
| makeArcActive | CrossArcSynergyEngine.ts:498 | public | Activate arc |
| updateArcStage | CharacterContinuityGenome.ts:1232 | private | Update arc stage |
| updateCharacter | ChapterMemory.ts:174 | public | Update character data |
| updateStoryArc | ChapterMemory.ts:240 | private | Update story arc |
| updateOptions | AIStoryEngine.ts:162 | public | Update config options |
| locateSceneInWorld | CinematicEnhancer.ts:234 | private | Find scene location |
| measureEmotionalIntensity | CinematicChoreographyEngine.ts:1318 | private | Measure intensity |
| parseSearchResults | CreativeContentGenerator.ts:176 | private | Parse web results |
| performUniqueContentGeneration | CreativeContentGenerator.ts:441 | private | Generate unique |
| placeSceneInWorld | CinematicEnhancer.ts:255 | private | Position scene |
| prepareSceneForWorld | CinematicEnhancer.ts:278 | private | Prep scene |
| processCharacterGrowth | CharacterContinuityGenome.ts:1054 | public | Handle growth |
| processCharacterEvents | CharacterContinuityGenome.ts:1005 | public | Handle events |
| recordChapter | ChapterMemory.ts:114 | public | Record chapter |
| recordVRDiscovery | ChapterMemory.ts:197 | public | Record VR discovery |

### R-Z
| Method | Location | Visibility | Purpose |
|--------|----------|------------|---------|
| recordChapter | ChapterMemory.ts:114 | public | Record chapter |
| recordVRDiscovery | ChapterMemory.ts:197 | public | Record VR discovery |
| reset | AIStoryEngine.ts:232 | public | Reset engine |
| searchArcConnections | CrossArcSynergyEngine.ts:339 | async | Search arc info |
| searchCharacterArchetype | CharacterContinuityGenome.ts:599 | async | Search archetypes |
| searchCinematicTechniques | CinematicChoreographyEngine.ts:370 | async | Search cinema |
| searchConvergenceStrategies | CrossArcSynergyEngine.ts:378 | async | Search convergence |
| searchCulturalPatterns | AdvancedStoryEngine.ts:355 | async | Search cultures |
| searchItemAbilityInspiration | AdvancedStoryEngine.ts:435 | async | Search abilities |
| searchLinguisticPatterns | AdvancedStoryEngine.ts:449 | async | Search language |
| searchMythologicalStructures | AdvancedStoryEngine.ts:377 | async | Search myths |
| searchNarrativeTechniques | AdvancedStoryEngine.ts:413 | async | Search narrative |
| searchPersonalityFrameworks | CharacterContinuityGenome.ts:619 | async | Search personalities |
| searchRelationshipPatterns | CharacterContinuityGenome.ts:637 | async | Search relationships |
| searchSceneComposition | CinematicChoreographyEngine.ts:409 | async | Search composition |
| searchSynergyTechniques | CrossArcSynergyEngine.ts:359 | async | Search synergy |
| searchUniqueNames | AdvancedStoryEngine.ts:331 | async | Search unique names |
| searchVisualStorytelling | CinematicChoreographyEngine.ts:390 | async | Search visual |
| searchWeb | CreativeContentGenerator.ts:142 | async | Perform web search |
| searchWebContent | CreativeContentGenerator.ts:198 | async | Search content |
| searchWorldBuildingInspiration | AdvancedStoryEngine.ts:399 | async | Search world build |
| setStoryArc | CrossArcSynergyEngine.ts:470 | public | Set arc type |
| startArc | CrossArcSynergyEngine.ts:477 | public | Start arc |
| synthesizeUniqueNameFromWeb | AdvancedStoryEngine.ts:919 | private | Create name from web |
| trackCharacterBehavior | CharacterContinuityGenome.ts:977 | public | Track behavior |
| trackCharacterRelationship | CharacterContinuityGenome.ts:987 | public | Track relationship |
| validateBehaviorWithWebResearch | CharacterContinuityGenome.ts:656 | async | Validate with web |
| validateChapterUniqueness | AdvancedStoryEngine.ts:548 | async | Check uniqueness |

---

## 3. Interface & Type Location Index

Quick reference for all interfaces and type definitions across the codebase.

### Core Interfaces

| Interface | Location | Purpose |
|-----------|----------|---------|
| **AIStoryEngine** | AIStoryEngine.ts | Main story engine class |
| **AdvancedStoryEngine** | AdvancedStoryEngine.ts | Advanced generation engine |
| **CinematicChoreographyEngine** | CinematicChoreographyEngine.ts | Scene choreography |
| **CinematicScene** | CinematicChoreographyEngine.ts:37 | Scene analysis result |
| **LightingDesign** | CinematicChoreographyEngine.ts:52 | Lighting configuration |
| **CameraWork** | CinematicChoreographyEngine.ts:64 | Camera specifications |
| **SoundDesign** | CinematicChoreographyEngine.ts:74 | Sound configuration |
| **ChapterMemory** | ChapterMemory.ts | Chapter storage and context |
| **CharacterGenome** | CharacterContinuityGenome.ts | Character data structure |
| **CharacterProgress** | ChapterMemory.ts:19 | Character development tracking |
| **ChapterEvent** | ChapterMemory.ts:35 | Chapter event tracking |
| **Conflict** | ConflictManager.ts:19 | Conflict data structure |
| **Connection** | CrossArcSynergyEngine.ts:30 | Arc connection |
| **CreativeContentGenerator** | CreativeContentGenerator.ts | Content generation |
| **CrossArcSynergyEngine** | CrossArcSynergyEngine.ts | Multi-arc management |
| **NarrativeArc** | CrossArcSynergyEngine.ts:18 | Story arc structure |
| **ExperimentalNarrativeModes** | ExperimentalNarrativeModes.ts | Narrative modes |
| **NexusEngine** | NexusEngine.ts | Integration hub |
| **UnifiedStoryEngine** | UnifiedStoryEngine.ts | Unified interface |

### Core Types

| Type | Location | Purpose |
|------|----------|---------|
| **Chapter** | types.ts | Complete chapter data |
| **StoryGenerationOptions** | types.ts | Generation configuration |
| **NarrativeState** | AIStoryEngine.ts:17 | Current story state |
| **GenerationContext** | CreativeContentGenerator.ts:30 | Context for generation |
| **GenerationParameters** | AdvancedStoryEngine.ts:64 | Parameter structure |
| **ValidationIssue** | types.ts | Validation error info |
| **SystemsStatus** | AdvancedStoryEngine.ts:1146 | System health status |
| **CinematicAnalysis** | CinematicChoreographyEngine.ts:1593 | Analysis result |
| **SynergyAnalysis** | CrossArcSynergyEngine.ts:693 | Arc synergy data |
| **ArcBalancing** | CrossArcSynergyEngine.ts:798 | Balance information |
| **ContinuityIssue** | CharacterContinuityGenome.ts:38 | Continuity problem |
| **CharacterEvent** | CharacterContinuityGenome.ts:45 | Character event |
| **WorldFlowManager** | types.ts | World state manager |
| **VisualComposition** | CinematicChoreographyEngine.ts:44 | Visual analysis |
| **CameraShot** | CinematicChoreographyEngine.ts:84 | Shot specification |
| **AtmosphereProfile** | CinematicChoreographyEngine.ts:1508 | Atmosphere data |
| **ActionChoreography** | CinematicChoreographyEngine.ts:1137 | Action sequence data |
| **SceneTransition** | CinematicChoreographyEngine.ts:1395 | Transition data |
| **PacingProfile** | CinematicChoreographyEngine.ts:1423 | Pacing data |
| **EmotionalBeat** | CinematicChoreographyEngine.ts:1275 | Emotional data |
| **VisualMotif** | CinematicChoreographyEngine.ts:1329 | Visual motif data |

### Configuration Types

| Type | Location | Purpose |
|------|----------|---------|
| **AdvancedStoryEngineConfig** | AdvancedStoryEngine.ts:40 | Engine configuration |
| **StoryEngineConfig** | UnifiedStoryEngine.ts | Unified config |
| **CreativeContentGeneratorConfig** | CreativeContentGenerator.ts | Generator config |
| **CinematicChoreographyConfig** | CinematicChoreographyEngine.ts:14 | Choreography config |
| **CharacterContinuityConfig** | CharacterContinuityGenome.ts:23 | Continuity config |
| **CrossArcSynergyConfig** | CrossArcSynergyEngine.ts:5 | Synergy config |

### Utility Types

| Type | Location | Purpose |
|------|----------|---------|
| **CameraAngle** | CinematicChoreographyEngine.ts:23 | Camera angle enum |
| **CameraMovement** | CinematicChoreographyEngine.ts:31 | Camera move enum |
| **FramingType** | CinematicChoreographyEngine.ts:12 | Frame type enum |
| **DepthLevel** | CinematicChoreographyEngine.ts:17 | Depth enum |
| **MovementSpeed** | CinematicChoreographyEngine.ts:38 | Speed enum |
| **StabilityType** | CinematicChoreographyEngine.ts:35 | Stability enum |
| **PerspectiveType** | CinematicChoreographyEngine.ts:43 | Perspective enum |
| **LensType** | CinematicChoreographyEngine.ts:47 | Lens enum |
| **LightingMood** | CinematicChoreographyEngine.ts:48 | Lighting mood enum |
| **ContrastType** | CinematicChoreographyEngine.ts:53 | Contrast enum |
| **AtmosphereType** | CinematicChoreographyEngine.ts:1510 | Atmosphere enum |
| **AtmosphereTexture** | CinematicChoreographyEngine.ts:1562 | Texture enum |
| **TransitionType** | CinematicChoreographyEngine.ts:1397 | Transition enum |
| **ActionBeat** | CinematicChoreographyEngine.ts:1141 | Action beat type |
| **ConnectionType** | CrossArcSynergyEngine.ts:24 | Connection enum |
| **ConflictType** | ConflictManager.ts:31 | Conflict enum |

---

**Section 3 Complete: Interface & Type Location Index**

---

## 4. Export Statement Location Index

Quick reference for all exports across the codebase (452 total exports).

### Class Exports (Main Entry Points)

| Class | File | Line | Description |
|-------|------|------|-------------|
| AIStoryEngine | AIStoryEngine.ts | 33, 239 | Main story engine |
| AdvancedStoryEngine | AdvancedStoryEngine.ts | 172, 1279 | Advanced generation |
| ChapterMemory | ChapterMemory.ts | 52, 341 | Chapter storage |
| CharacterContinuityGenome | CharacterContinuityGenome.ts | 260, 1424 | Character continuity |
| CharacterIntelligence | CharacterIntelligence.ts | 42, 451 | Character analysis |
| CinematicChoreographyEngine | CinematicChoreographyEngine.ts | 252, 1739 | Scene choreography |
| CinematicEnhancer | CinematicEnhancer.ts | 18 | Cinematic enhancement |
| ConflictManager | ConflictManager.ts | 12, 359 | Conflict handling |
| CreativeContentGenerator | CreativeContentGenerator.ts | 32, 820 | Content generation |
| CrossArcSynergyEngine | CrossArcSynergyEngine.ts | 294, 1024 | Multi-arc management |
| DialogueIntelligenceSystem | DialogueIntelligenceSystem.ts | 78, 1535 | Dialogue analysis |
| DynamicWorldSimulation | DynamicWorldSimulation.ts | 145, 878 | World simulation |
| ExperimentalNarrativeModes | ExperimentalNarrativeModes.ts | 212, 1481 | Narrative modes |
| MoralEthicalDecisionEngine | MoralEthicalDecisionEngine.ts | 228, 1088 | Moral decisions |
| NarrativeRepairSystem | NarrativeRepairSystem.ts | 114, 1325 | Story repair |
| NexusEngine | NexusEngine.ts | 100 | Integration hub |
| PredictiveArcModeling | PredictiveArcModeling.ts | 173, 1078 | Arc prediction |
| UnifiedStoryEngine | UnifiedStoryEngine.ts | 93, 1131 | Unified interface |
| WebSearchIntegration | WebSearchIntegration.ts | 22, 316 | Web search |

### Key Interface Exports by File

**AIStoryEngine.ts:**
- StoryGenerationOptions (11), NarrativeState (20)

**AdvancedStoryEngine.ts:**
- AdvancedStoryEngineConfig (38), NarrativeContext (47), EmotionalState (59)
- ThemeState (67), SymbolicElement (74), CharacterContext (81)
- WorldStateSnapshot (100), GenerationParameters (112)
- NarrativeValidation (125), ValidationIssue (134), UniqueElement (142)
- GlobalContinuityLedger (151), TimelineEvent (158)
- SceneStructure (1233), ChapterMetadata (1244), SystemsStatus (1257)

**ChapterMemory.ts:**
- ChapterEvent (6), CharacterProgress (15), WorldProgress (26), StoryArc (44)

**CharacterContinuityGenome.ts:**
- CharacterGenome (18), CoreTrait (34), TraitDevelopment (42)
- PersonalityMatrix (49), EmotionalBaseline (58), EmotionalTrigger (66)
- EmotionalMemory (73), RelationshipGene (81), RelationshipEvent (92)
- BehavioralPattern (100), GrowthVector (108), GrowthBlock (116)
- GrowthMilestone (123), MemoryGene (130), MemoryEntry (138)
- PhysicalGene (147), AppearanceProfile (154), PhysicalCapability (164)
- PhysicalLimitation (170), PhysicalChange (176), SkillGene (183)
- SkillDevelopment (195), BackstoryGene (202), FormativeEvent (210)
- CharacterSecret (217), ArcProgress (224), ArcMoment (232)
- ContinuityCheck (239), ContinuityIssue (247), CharacterEvent (1396)

**CinematicChoreographyEngine.ts:**
- CinematicScene (25), VisualComposition (42), CameraWork (60)
- CameraAngle (70), CameraMovement (76), CameraShot (88)
- LightingDesign (98), LightSource (110), AmbientLight (119)
- PracticalLight (129), ShadowDesign (136), SoundDesign (142)
- AmbientSound (151), DialogueProfile (160), MusicCue (168)
- SoundEffect (180), SilenceCue (188), SoundscapeProfile (194)
- SpatialProfile (201), ActionChoreography (209), ActionBeat (218)
- ActionParticipant (230), EnvironmentInteraction (238), ActionPacing (245)

### Type Exports by File

**CinematicChoreographyEngine.ts:**
- FramingType (54), DepthLevel (58), MovementSpeed (83)
- StabilityType (84), PerspectiveType (85), LensType (86)
- ColorTemperature (125), ContrastType (126), LightingMood (127)
- StereoPosition (207)

---

## 5. Error & Exception Location Map

Quick reference for all error handling and exception locations.

### Throw Statements

| Location | Error Message | When Thrown |
|----------|---------------|-------------|
| CreativeContentGenerator.ts:479 | `Content pool not found for world: ${context.world}` | Invalid world context |
| CrossArcSynergyEngine.ts:711 | `Arc not found` | Missing arc ID |
| ExperimentalNarrativeModes.ts:908 | `Choice or option not found` | Invalid choice |
| ExperimentalNarrativeModes.ts:1188 | `Mode not found` | Invalid mode ID |
| ExperimentalNarrativeModes.ts:1397 | `Mode not found` | Invalid mode ID |
| MoralEthicalDecisionEngine.ts:846 | `Dilemma or morality not found` | Missing dilemma |
| MoralEthicalDecisionEngine.ts:851 | `Option not found` | Invalid option |
| MoralEthicalDecisionEngine.ts:1030 | `Dilemma or morality not found` | Missing dilemma |
| NarrativeRepairSystem.ts:1192 | `Enhancement not found` | Invalid enhancement |
| PredictiveArcModeling.ts:1013 | `Arc ${arcId} not found` | Missing arc |

### Try-Catch Blocks

| Location | Purpose | Error Handling |
|----------|---------|----------------|
| CreativeContentGenerator.ts:148 | Web search error | Catch and fallback |
| WebSearchIntegration.ts:94 | Web request failure | Catch and log |

### Common Error Patterns

**NotFoundError Pattern:** Used in CrossArcSynergyEngine, ExperimentalNarrativeModes, MoralEthicalDecisionEngine, NarrativeRepairSystem, PredictiveArcModeling

**ValidationError Pattern:** Implicit in validation methods - check `isValid` properties

**WebSearchError Pattern:** Catch blocks in CreativeContentGenerator and WebSearchIntegration

### Error Prevention Tips

1. **Always check arc existence** before calling arc methods (CrossArcSynergyEngine, PredictiveArcModeling)
2. **Validate world context** before content generation (CreativeContentGenerator)
3. **Verify mode/choice existence** in ExperimentalNarrativeModes before operations
4. **Check dilemma/option validity** in MoralEthicalDecisionEngine
5. **Wrap web searches** in try-catch for graceful fallbacks

---

**Sections 4-5 Complete: Export Statement & Error Location Indexes**

---

## 6. System Entry Points

Quick reference for all system constructors and initialization points.

### Main Entry Points (Primary Systems)

| System | Constructor Line | Parameters | Initialization |
|--------|------------------|------------|----------------|
| **AIStoryEngine** | AIStoryEngine.ts:40 | `initialOptions: StoryGenerationOptions` | Sets up world logic and flow manager |
| **AdvancedStoryEngine** | AdvancedStoryEngine.ts:213 | `config: AdvancedStoryEngineConfig` | Enables web search, initializes caches |
| **UnifiedStoryEngine** | UnifiedStoryEngine.ts:93 | `config: StoryEngineConfig` | Main unified entry point |
| **NexusEngine** | NexusEngine.ts:100 | - | Integration hub for all systems |

### Supporting System Constructors

| System | Constructor Line | Parameters | Notes |
|--------|------------------|------------|-------|
| ChapterMemory | ChapterMemory.ts:60 | - | Initialize storage |
| CharacterContinuityGenome | CharacterContinuityGenome.ts:275 | - | Initialize genomes |
| CharacterIntelligence | CharacterIntelligence.ts:50 | - | Initialize character data |
| CinematicChoreographyEngine | CinematicChoreographyEngine.ts:363 | - | Initialize choreography |
| CinematicEnhancer | CinematicEnhancer.ts:151 | - | Initialize spatial contexts |
| ConflictManager | ConflictManager.ts:46 | - | Initialize conflicts |
| CreativeContentGenerator | CreativeContentGenerator.ts:71 | - | Initialize pools |
| CrossArcSynergyEngine | CrossArcSynergyEngine.ts:326 | - | Initialize arcs |
| DialogueIntelligenceSystem | DialogueIntelligenceSystem.ts:150 | - | Initialize patterns |
| DynamicWorldSimulation | DynamicWorldSimulation.ts:280 | - | Initialize world |
| ExperimentalNarrativeModes | ExperimentalNarrativeModes.ts:339 | - | Initialize modes |
| ItemSystem | ItemSystem.ts:41 | - | Initialize items |
| LoreManager | LoreManager.ts:52 | - | Initialize lore |
| MemorySystem | MemorySystem.ts:72 | - | Initialize memory |
| MetaCognitionSystem | MetaCognitionSystem.ts:131 | - | Initialize meta-cognition |
| MoralEthicalDecisionEngine | MoralEthicalDecisionEngine.ts:247 | - | Initialize dilemmas |
| MultiThreadNarrativeScheduler | MultiThreadNarrativeScheduler.ts:112 | - | Initialize scheduler |
| NarrativeLogic | NarrativeLogic.ts:31 | - | Initialize logic |
| NarrativeRepairSystem | NarrativeRepairSystem.ts:250 | - | Initialize repair |
| PacingSystem | PacingSystem.ts:42 | - | Initialize pacing |
| PredictiveArcModeling | PredictiveArcModeling.ts:144 | - | Initialize models |
| QualityControl | QualityControl.ts:39 | `threshold: number = 100` | Set quality threshold |
| RealityBreachLogicFramework | RealityBreachLogicFramework.ts:120 | - | Initialize breaches |
| StatMerging | StatMerging.ts:59 | `config?: Partial<StatMergeConfig>` | Configure stat merging |
| StructuralIntegrityLayer | StructuralIntegrityLayer.ts:137 | - | Initialize integrity |
| SymbolicLogicTracker | SymbolicLogicTracker.ts:192 | - | Initialize symbols |
| SystemScreenGenerator | SystemScreenGenerator.ts:141 | - | Initialize screens |
| ThemeManager | ThemeManager.ts:238 | - | Initialize themes |
| ThreatScalingSystem | ThreatScalingSystem.ts:53 | - | Initialize threats |
| WebSearchIntegration | WebSearchIntegration.ts:64 | `config: Partial<WebSearchConfig> = {}` | Configure web search |
| WorldBuilder | WorldBuilder.ts:80 | - | Initialize world |
| WorldFlowManager | WorldFlowManager.ts:27 | `config?: Partial<FlowConfiguration>` | Configure flow |

### Initialization Patterns

**Default Configuration:**
- Most systems use no-parameter constructors with internal defaults
- Optional config parameters in: AdvancedStoryEngine, QualityControl, StatMerging, WorldFlowManager, WebSearchIntegration

**Cache Initialization:**
- AdvancedStoryEngine: webSearchCache, nameGenerationCache, culturalPatternCache, mythologicalStructureCache
- CharacterContinuityGenome: personalityFrameworksCache, relationshipPatternsCache
- CinematicChoreographyEngine: cinematicTechniquesCache, sceneCompositionCache

---

## 7. Web Search Integration Points

Complete mapping of all web search integrations across the codebase.

### Web Search Integration System

**Main Module:** `WebSearchIntegration.ts`

### Integration Points by System

#### AdvancedStoryEngine
| Method | Line | Search Type | Purpose |
|--------|------|-------------|---------|
| searchUniqueNames | 331 | `webSearchIntegration.search` | Find unique character names |
| searchCulturalPatterns | 355 | `webSearchIntegration.search` | Research cultural patterns |
| searchMythologicalStructures | 377 | `webSearchIntegration.searchLiteraryExamples` | Find myth references |
| searchWorldBuildingInspiration | 399 | `webSearchIntegration.searchWritingBestPractices` | Get world-building ideas |
| searchNarrativeTechniques | 413 | `webSearchIntegration.searchNarrativeTechniques` | Find narrative techniques |
| searchItemAbilityInspiration | 435 | `webSearchIntegration.search` | Get item/ability ideas |
| searchLinguisticPatterns | 449 | `webSearchIntegration.search` | Find linguistic patterns |
| enhanceContextWithWebSearch | 463 | Multiple methods | Enhance generation context |
| validateBehaviorWithWebResearch | 862 | `webSearchIntegration.searchWritingBestPractices` | Validate behaviors |

**Configuration:**
- `enableWebSearch: boolean` (default: true) - Line 39, 214
- `webSearchCache: Map<string, WebSearchResult[]>` - Line 190

#### CharacterContinuityGenome
| Method | Line | Search Type | Purpose |
|--------|------|-------------|---------|
| searchDevelopmentBestPractices | 589 | `webSearchIntegration.searchWritingBestPractices` | Character development research |
| searchCharacterArchetype | 608 | `webSearchIntegration.searchLiteraryExamples` | Find archetypes |
| searchPersonalityFrameworks | 627 | `webSearchIntegration.search` | Personality research |
| searchRelationshipPatterns | 646 | `webSearchIntegration.search` | Relationship research |
| validateBehaviorWithWebResearch | 661 | `webSearchIntegration.search` | Validate behaviors |

**Configuration:**
- `personalityFrameworksCache: Map<string, WebSearchResult[]>` - Line 267
- `relationshipPatternsCache: Map<string, WebSearchResult[]>` - Line 268
- `clearWebSearchCache()` - Line 729

#### CinematicChoreographyEngine
| Method | Line | Search Type | Purpose |
|--------|------|-------------|---------|
| searchCinematicTechniques | 373 | `webSearchIntegration.searchCinematicTechniques` | Find cinema techniques |
| searchVisualStorytelling | 399 | `webSearchIntegration.searchWritingBestPractices` | Visual storytelling research |
| searchSceneComposition | 409 | `webSearchIntegration.searchWritingBestPractices` | Composition research |

**Configuration:**
- `cinematicTechniquesCache: Map<string, WebSearchResult[]>` - Line 359
- `sceneCompositionCache: Map<string, WebSearchResult[]>` - Line 361

### Web Search Methods Available

From `WebSearchIntegration.ts`:
- `search(query: string)` - General search
- `searchCinematicTechniques(technique: string)` - Cinema techniques
- `searchLiteraryExamples(example: string)` - Literary examples
- `searchWritingBestPractices(topic: string)` - Writing advice
- `searchNarrativeTechniques(technique: string, genre: string)` - Narrative techniques

### Cache Management

**Cache Locations:**
- AdvancedStoryEngine: `webSearchCache`, `nameGenerationCache`, `culturalPatternCache`, `mythologicalStructureCache`
- CharacterContinuityGenome: `personalityFrameworksCache`, `relationshipPatternsCache`
- CinematicChoreographyEngine: `cinematicTechniquesCache`, `sceneCompositionCache`

**Cache Clear Methods:**
- `AdvancedStoryEngine.clearAllCaches()` - Line 1169
- `CharacterContinuityGenome.clearWebSearchCache()` - Line 729

### Usage Patterns

**Conditional Searching:**
```typescript
if (this.config.enableWebSearch) {
  // Perform web search
}
```

**Cache Pattern:**
```typescript
const cacheKey = `${type}_${culture}_${language}`;
if (this.nameGenerationCache.has(cacheKey)) {
  return this.nameGenerationCache.get(cacheKey);
}
const results = await webSearchIntegration.search(query);
this.nameGenerationCache.set(cacheKey, results);
return results;
```

---

**Sections 6-7 Complete: System Entry Points & Web Search Integration**

---

## 8. Property & Field Location Index

Quick reference for all private properties and fields across systems.

### AIStoryEngine Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| hasGeneratedFirstChapter | 38 | boolean | Track first chapter |

### AdvancedStoryEngine Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| webSearchCache | 190 | Map<string, WebSearchResult[]> | Web search results cache |
| nameGenerationCache | 191 | Map<string, string[]> | Generated names cache |
| culturalPatternCache | 192 | Map<string, NarrativeSearchResult[]> | Cultural patterns cache |
| mythologicalStructureCache | 193 | Map<string, LiterarySearchResult[]> | Mythology cache |
| currentFingerprint | 197 | string | Current element fingerprint |
| uniqueElementTracker | 198 | Map<string, Set<string>> | Track unique elements |

### ChapterMemory Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| characters | 54 | Map<string, CharacterProgress> | Character tracking |
| chapterSummaries | 57 | Map<number, string> | Summary storage |
| totalChapters | 58 | number | Chapter count |

### CharacterContinuityGenome Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| genomes | 261 | Map<string, CharacterGenome> | Character genomes |
| continuityChecks | 262 | Map<string, ContinuityCheck[]> | Continuity checks |
| developmentBestPracticesCache | 265 | Map<string, TechnicalSearchResult[]> | Development practices |
| archetypeDatabaseCache | 266 | Map<string, LiterarySearchResult[]> | Archetype database |
| personalityFrameworksCache | 267 | Map<string, WebSearchResult[]> | Personality frameworks |
| relationshipPatternsCache | 268 | Map<string, WebSearchResult[]> | Relationship patterns |

### CharacterIntelligence Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| motivations | 43 | Map<string, CharacterMotivation> | Character motivations |
| relationships | 44 | Map<string, CharacterRelationship> | Character relationships |
| arcs | 45 | Map<string, CharacterArc> | Character arcs |
| behaviors | 46 | Map<string, CharacterBehavior> | Character behaviors |
| characterHistory | 47 | Map<string, string[]> | History tracking |
| consistencyScore | 48 | Map<string, number> | Consistency scores |

### CinematicChoreographyEngine Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| scenes | 352 | Map<string, CinematicScene> | Scene storage |
| visualMotifs | 353 | Map<string, VisualMotif> | Visual motifs |
| currentChapter | 355 | number | Current chapter |
| sceneCount | 356 | number | Scene counter |
| cinematicTechniquesCache | 359 | Map<string, WebSearchResult[]> | Techniques cache |
| visualStorytellingCache | 360 | Map<string, TechnicalSearchResult[]> | Visual storytelling |
| sceneCompositionCache | 361 | Map<string, WebSearchResult[]> | Composition cache |

### CreativeContentGenerator Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| searchCache | 67 | Map<string, any> | Search results cache |

### CrossArcSynergyEngine Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| arcConnectionCache | 322 | Map<string, NarrativeSearchResult[]> | Arc connections |
| synergyTechniquesCache | 323 | Map<string, TechnicalSearchResult[]> | Synergy techniques |
| convergenceStrategiesCache | 324 | Map<string, WebSearchResult[]> | Convergence strategies |

### DialogueIntelligenceSystem Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| dialoguePatternsCache | 139 | Map<string, WebSearchResult[]> | Dialogue patterns |
| speechPatternsCache | 140 | Map<string, TechnicalSearchResult[]> | Speech patterns |
| regionalDialectsCache | 141 | Map<string, WebSearchResult[]> | Regional dialects |
| conversationStructureCache | 142 | Map<string, WebSearchResult[]> | Conversation structures |

### DynamicWorldSimulation Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| worldBuildingCache | 270 | Map<string, TechnicalSearchResult[]> | World building |
| geographicalCache | 271 | Map<string, WebSearchResult[]> | Geographical data |
| historicalCache | 272 | Map<string, WebSearchResult[]> | Historical data |
| technologicalCache | 273 | Map<string, WebSearchResult[]> | Technology data |

### ExperimentalNarrativeModes Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| experimentalTechniquesCache | 335 | Map<string, WebSearchResult[]> | Experimental techniques |
| innovativeMethodsCache | 336 | Map<string, TechnicalSearchResult[]> | Innovative methods |
| innovationTrendsCache | 337 | Map<string, LiterarySearchResult[]> | Innovation trends |

### MetaCognitionSystem Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| bestPracticesCache | 123 | Map<string, TechnicalSearchResult[]> | Best practices |
| genreConventionsCache | 124 | Map<string, TechnicalSearchResult[]> | Genre conventions |

### MoralEthicalDecisionEngine Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| ethicalFrameworksCache | 243 | Map<string, WebSearchResult[]> | Ethical frameworks |
| moralPhilosophyCache | 244 | Map<string, WebSearchResult[]> | Moral philosophy |
| ethicalDilemmasCache | 245 | Map<string, LiterarySearchResult[]> | Ethical dilemmas |

### MultiThreadNarrativeScheduler Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| multiThreadExamplesCache | 97 | Map<string, NarrativeSearchResult[]> | Multi-thread examples |
| weavingTechniquesCache | 98 | Map<string, WebSearchResult[]> | Weaving techniques |
| subplotIntegrationCache | 99 | Map<string, NarrativeSearchResult[]> | Subplot integration |

### NarrativeRepairSystem Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| revisionTechniquesCache | 246 | Map<string, WebSearchResult[]> | Revision techniques |
| problemSolutionsCache | 247 | Map<string, TechnicalSearchResult[]> | Problem solutions |
| qualityImprovementCache | 248 | Map<string, WebSearchResult[]> | Quality improvements |

### PredictiveArcModeling Properties

| Property | Line | Type | Purpose |
|----------|------|------|---------|
| arcPatternsCache | 131 | Map<string, NarrativeSearchResult[]> | Arc patterns |
| pacingResearchCache | 132 | Map<string, WebSearchResult[]> | Pacing research |
| trendingStructuresCache | 133 | Map<string, LiterarySearchResult[]> | Trending structures |

---

## 9. Cache Location Map

Complete mapping of all caches across the codebase for cache management and debugging.

### Cache Summary by System

| System | Cache Count | Total Cache Lines |
|--------|-------------|-------------------|
| AdvancedStoryEngine | 4 | 190-198 |
| CharacterContinuityGenome | 4 | 265-268 |
| CinematicChoreographyEngine | 3 | 359-361 |
| CreativeContentGenerator | 1 | 67 |
| CrossArcSynergyEngine | 3 | 322-324 |
| DialogueIntelligenceSystem | 4 | 139-142 |
| DynamicWorldSimulation | 4 | 270-273 |
| ExperimentalNarrativeModes | 3 | 335-337 |
| MetaCognitionSystem | 2 | 123-124 |
| MoralEthicalDecisionEngine | 3 | 243-245 |
| MultiThreadNarrativeScheduler | 3 | 97-99 |
| NarrativeRepairSystem | 3 | 246-248 |
| PredictiveArcModeling | 3 | 131-133 |
| **TOTAL** | **40** | - |

### Cache Types Distribution

| Cache Type | Count | Systems Using |
|------------|-------|---------------|
| Map<string, WebSearchResult[]> | 16 | AdvancedStoryEngine, CharacterContinuityGenome, CinematicChoreographyEngine, CrossArcSynergyEngine, DialogueIntelligenceSystem, DynamicWorldSimulation, ExperimentalNarrativeModes, MoralEthicalDecisionEngine, MultiThreadNarrativeScheduler, NarrativeRepairSystem, PredictiveArcModeling |
| Map<string, TechnicalSearchResult[]> | 12 | CharacterContinuityGenome, CinematicChoreographyEngine, CrossArcSynergyEngine, DialogueIntelligenceSystem, DynamicWorldSimulation, ExperimentalNarrativeModes, MetaCognitionSystem, MultiThreadNarrativeScheduler, NarrativeRepairSystem, PredictiveArcModeling |
| Map<string, LiterarySearchResult[]> | 8 | AdvancedStoryEngine, CharacterContinuityGenome, ExperimentalNarrativeModes, MoralEthicalDecisionEngine, PredictiveArcModeling |
| Map<string, NarrativeSearchResult[]> | 6 | AdvancedStoryEngine, CrossArcSynergyEngine, MultiThreadNarrativeScheduler, PredictiveArcModeling |
| Map<string, string[]> | 1 | AdvancedStoryEngine |
| Map<string, Set<string>> | 1 | AdvancedStoryEngine |
| Map<string, any> | 1 | CreativeContentGenerator |

### Cache Clear Methods

| Method | Location | Caches Cleared |
|--------|----------|----------------|
| clearAllCaches() | AdvancedStoryEngine.ts:1169 | webSearchCache, nameGenerationCache, culturalPatternCache, mythologicalStructureCache, uniqueElementTracker |
| clearWebSearchCache() | CharacterContinuityGenome.ts:729 | personalityFrameworksCache, relationshipPatternsCache |

### Cache Access Patterns

**Read Pattern:**
```typescript
// Check cache first
if (this.cacheName.has(cacheKey)) {
  return this.cacheName.get(cacheKey);
}
// Perform search if not cached
const results = await webSearchIntegration.search(query);
this.cacheName.set(cacheKey, results);
return results;
```

**Write Pattern:**
```typescript
this.cacheName.set(cacheKey, results);
```

**Clear Pattern:**
```typescript
this.cacheName.clear();
```

### Cache Key Patterns

| Cache Type | Key Pattern | Example |
|------------|-------------|---------|
| Name Generation | `${type}_${culture}_${language}` | "character_japanese_modern" |
| Cultural Patterns | `${culture}_${theme}` | "japanese_honor" |
| Mythological Structures | `${mythology}_${element}` | "greek_hero" |
| Cinematic Techniques | `${technique}_${mood}` | "lighting_dramatic" |
| Arc Patterns | `${arcType}_${genre}` | "hero_journey_fantasy" |

---

**Sections 8-9 Complete: Property & Cache Location Indexes**

---

## 10. Import Statement Map

Complete mapping of all imports and dependencies across the codebase.

### External Dependencies

| Package | Import | Used By |
|---------|--------|---------|
| uuid | `v4 as uuidv4` | CinematicChoreographyEngine, CrossArcSynergyEngine, ExperimentalNarrativeModes, MoralEthicalDecisionEngine, NarrativeRepairSystem, SymbolicLogicTracker |

### Type Imports from `../../types`

| Type | Imported By |
|------|-------------|
| Chapter | AIStoryEngine, NarrativeLogic, QualityControl |
| Character | AIStoryEngine, CharacterIntelligence, NarrativeLogic, WorldBuilder |
| CharacterStat | CharacterIntelligence, ItemSystem, StatMerging, ThreatScalingSystem |
| Item | AIStoryEngine, ItemSystem |
| Skill | AIStoryEngine, ItemSystem |
| Ability | AIStoryEngine, ItemSystem |
| Location | AIStoryEngine, WorldBuilder |

### WebSearch Integration Imports

| File | Imports |
|------|---------|
| AdvancedStoryEngine | `webSearchIntegration`, `WebSearchResult`, `NarrativeSearchResult`, `LiterarySearchResult`, `TechnicalSearchResult` |
| CharacterContinuityGenome | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult`, `LiterarySearchResult` |
| CinematicChoreographyEngine | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult` |
| CrossArcSynergyEngine | `webSearchIntegration`, `WebSearchResult`, `NarrativeSearchResult`, `TechnicalSearchResult` |
| DialogueIntelligenceSystem | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult` |
| DynamicWorldSimulation | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult` |
| ExperimentalNarrativeModes | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult`, `LiterarySearchResult` |
| MetaCognitionSystem | `webSearchIntegration`, `WebSearchResult`, `NarrativeSearchResult`, `TechnicalSearchResult` |
| MoralEthicalDecisionEngine | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult`, `LiterarySearchResult` |
| MultiThreadNarrativeScheduler | `webSearchIntegration`, `WebSearchResult`, `NarrativeSearchResult` |
| NarrativeRepairSystem | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult` |
| PredictiveArcModeling | `webSearchIntegration`, `WebSearchResult`, `NarrativeSearchResult`, `LiterarySearchResult` |
| RealityBreachLogicFramework | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult`, `LiterarySearchResult` |
| StructuralIntegrityLayer | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult` |
| SymbolicLogicTracker | `webSearchIntegration`, `WebSearchResult`, `TechnicalSearchResult`, `LiterarySearchResult` |

### Internal Module Imports

**AdvancedStoryEngine.ts** (Central Hub - 15 imports):
- MetaCognitionSystem
- PredictiveArcModeling
- MultiThreadNarrativeScheduler
- DialogueIntelligenceSystem
- CharacterContinuityGenome
- DynamicWorldSimulation
- RealityBreachLogicFramework
- StructuralIntegrityLayer
- SymbolicLogicTracker
- CinematicChoreographyEngine
- MoralEthicalDecisionEngine
- ExperimentalNarrativeModes
- NarrativeRepairSystem
- CrossArcSynergyEngine
- webSearchIntegration

**index.ts** (Module Exports - 14 imports):
- AIStoryEngine
- NarrativeLogic
- CharacterIntelligence
- WorldBuilder
- ItemSystem
- PacingSystem
- QualityControl
- StatMerging
- ThreatScalingSystem
- MemorySystem
- LoreManager
- ConflictManager
- SystemScreenGenerator
- CinematicEnhancer

**AIStoryEngine.ts** (Core System):
- ChapterMemory
- WorldFlowManager
- CreativeContentGenerator

### Import Dependency Graph

```
index.ts (Entry Point)
├── AIStoryEngine
│   ├── ChapterMemory
│   ├── WorldFlowManager
│   └── CreativeContentGenerator
├── NarrativeLogic
├── CharacterIntelligence
├── WorldBuilder
├── ItemSystem
├── PacingSystem
├── QualityControl
├── StatMerging
├── ThreatScalingSystem
├── MemorySystem
├── LoreManager
├── ConflictManager
├── SystemScreenGenerator
└── CinematicEnhancer

AdvancedStoryEngine (Advanced Hub)
├── webSearchIntegration
├── MetaCognitionSystem → webSearchIntegration
├── PredictiveArcModeling → webSearchIntegration
├── MultiThreadNarrativeScheduler → webSearchIntegration
├── DialogueIntelligenceSystem → webSearchIntegration
├── CharacterContinuityGenome → webSearchIntegration
├── DynamicWorldSimulation → webSearchIntegration
├── RealityBreachLogicFramework → webSearchIntegration
├── StructuralIntegrityLayer → webSearchIntegration
├── SymbolicLogicTracker → webSearchIntegration
├── CinematicChoreographyEngine → webSearchIntegration
├── MoralEthicalDecisionEngine → webSearchIntegration
├── ExperimentalNarrativeModes → webSearchIntegration
├── NarrativeRepairSystem → webSearchIntegration
└── CrossArcSynergyEngine → webSearchIntegration
```

---

## 11. Constructor Parameter Index

Quick reference for all constructor parameters and configuration options.

### Constructors with Parameters

| System | Line | Parameter Type | Required | Default |
|--------|------|----------------|----------|---------|
| **AIStoryEngine** | 40 | `StoryGenerationOptions` | Yes | - |
| **AdvancedStoryEngine** | 213 | `AdvancedStoryEngineConfig` | No | `{ enableWebSearch: true, ... }` |
| **QualityControl** | 39 | `threshold: number` | No | `100` |
| **StatMerging** | 59 | `config?: Partial<StatMergeConfig>` | No | Default config |
| **WebSearchIntegration** | 64 | `config: Partial<WebSearchConfig>` | No | `{}` |
| **WorldFlowManager** | 27 | `config?: Partial<FlowConfiguration>` | No | Default config |
| **UnifiedStoryEngine** | 93 | `StoryEngineConfig` | Yes | - |

### Constructors Without Parameters (No-Arg)

| System | Line | Notes |
|--------|------|-------|
| ChapterMemory | 60 | Initialize storage maps |
| CharacterContinuityGenome | 275 | Initialize genomes |
| CharacterIntelligence | 50 | Initialize character maps |
| CinematicChoreographyEngine | 363 | Empty constructor |
| CinematicEnhancer | 151 | Initialize spatial contexts |
| ConflictManager | 46 | Initialize conflicts |
| CreativeContentGenerator | 71 | Initialize content pools |
| CrossArcSynergyEngine | 326 | Initialize arc structures |
| DialogueIntelligenceSystem | 150 | Initialize patterns |
| DynamicWorldSimulation | 280 | Initialize world simulation |
| ExperimentalNarrativeModes | 339 | Initialize modes |
| ItemSystem | 41 | Initialize items |
| LoreManager | 52 | Initialize lore |
| MemorySystem | 72 | Initialize memory |
| MetaCognitionSystem | 131 | Initialize meta-cognition |
| MoralEthicalDecisionEngine | 247 | Empty constructor |
| MultiThreadNarrativeScheduler | 112 | Initialize scheduler |
| NarrativeLogic | 31 | Initialize logic |
| NarrativeRepairSystem | 250 | Empty constructor |
| PacingSystem | 42 | Initialize pacing |
| PredictiveArcModeling | 144 | Initialize models |
| RealityBreachLogicFramework | 120 | Initialize breaches |
| StructuralIntegrityLayer | 137 | Initialize integrity |
| SymbolicLogicTracker | 192 | Initialize symbols |
| SystemScreenGenerator | 141 | Initialize screens |
| ThemeManager | 238 | Initialize themes |
| ThreatScalingSystem | 53 | Initialize threats |
| WorldBuilder | 80 | Initialize world |

### Configuration Interfaces

| Interface | File | Properties |
|-----------|------|------------|
| StoryGenerationOptions | AIStoryEngine.ts:11 | Generation options for story |
| AdvancedStoryEngineConfig | AdvancedStoryEngine.ts:38 | `enableWebSearch`, `qualityThreshold`, `minimumChapterLength`, `enableUniqueGeneration` |
| StatMergeConfig | StatMerging.ts | Stat merging configuration |
| WebSearchConfig | WebSearchIntegration.ts | Web search configuration |
| FlowConfiguration | WorldFlowManager.ts | World flow configuration |
| StoryEngineConfig | UnifiedStoryEngine.ts | Unified engine configuration |

### Default Configuration Values

**AdvancedStoryEngineConfig Defaults (Line 214):**
```typescript
{
  enableWebSearch: true,
  qualityThreshold: 0.8,
  minimumChapterLength: 500,
  enableUniqueGeneration: true
}
```

**QualityControl Default:**
```typescript
threshold: 100
```

**WebSearchIntegration Defaults:**
```typescript
{ ...DEFAULT_SEARCH_CONFIG, ...config }
```

---

**Sections 10-11 Complete: Import Statement & Constructor Parameter Indexes**

---

## 12. Private vs Public Method Index

Quick reference distinguishing between public API methods and private internal methods.

### Method Visibility Summary

| Visibility | Count | Percentage |
|------------|-------|------------|
| Private | ~850 | ~89% |
| Public | ~100 | ~11% |
| **Total** | **~950** | **100%** |

### Public API Methods (External Interface)

#### AIStoryEngine
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| generateChapter | 50 | `Promise<Chapter>` | Generate a chapter |
| updateOptions | 162 | `void` | Update configuration |
| getNarrativeState | 169 | `NarrativeState` | Get current state |
| calculateQualityScore | 187 | `number` | Score chapter quality |
| getFlowManager | 218 | `WorldFlowManager` | Get flow manager |
| getMemory | 225 | `ChapterMemory` | Get memory system |
| reset | 232 | `void` | Reset engine state |

#### AdvancedStoryEngine
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| generateCompleteChapter | 269 | `Promise<Chapter>` | Generate complete chapter |
| searchUniqueNames | 331 | `Promise<string[]>` | Search for unique names |
| searchCulturalPatterns | 355 | `Promise<NarrativeSearchResult[]>` | Search cultural patterns |
| searchMythologicalStructures | 377 | `Promise<LiterarySearchResult[]>` | Search mythology |
| searchWorldBuildingInspiration | 399 | `Promise<WebSearchResult[]>` | Search world-building |
| searchNarrativeTechniques | 413 | `Promise<WebSearchResult[]>` | Search narrative techniques |
| searchItemAbilityInspiration | 435 | `Promise<WebSearchResult[]>` | Search item/abilities |
| searchLinguisticPatterns | 449 | `Promise<WebSearchResult[]>` | Search linguistic patterns |
| generateUniqueElement | 506 | `Promise<UniqueElement>` | Generate unique element |
| validateChapterUniqueness | 548 | `Promise<ValidationResult>` | Validate uniqueness |
| getSystemsStatus | 1142 | `SystemsStatus` | Get all systems status |
| getContinuityLedger | 1179 | `GlobalContinuityLedger` | Get continuity ledger |
| clearAllCaches | 1169 | `void` | Clear all caches |

#### CharacterContinuityGenome
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| processCharacterEvents | 1005 | `void` | Process character events |
| processCharacterGrowth | 1054 | `void` | Process growth |
| trackCharacterBehavior | 977 | `void` | Track behavior |
| trackCharacterRelationship | 987 | `void` | Track relationships |
| searchDevelopmentBestPractices | 580 | `Promise<TechnicalSearchResult[]>` | Search development |
| searchCharacterArchetype | 599 | `Promise<LiterarySearchResult[]>` | Search archetypes |
| searchPersonalityFrameworks | 619 | `Promise<WebSearchResult[]>` | Search frameworks |
| searchRelationshipPatterns | 637 | `Promise<WebSearchResult[]>` | Search relationships |
| validateBehaviorWithWebResearch | 656 | `Promise<ContinuityCheck & { webInsights }>` | Validate behavior |
| getGrowthSuggestions | 704 | `Promise<string[]>` | Get growth ideas |
| clearWebSearchCache | 729 | `void` | Clear web cache |

#### CinematicChoreographyEngine
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| analyzeScene | 439 | `CinematicScene` | Analyze scene |
| generateAnalysis | 1580 | `CinematicAnalysis` | Generate analysis |
| getAllScenes | 1699 | `CinematicScene[]` | Get all scenes |
| getScene | 1706 | `CinematicScene | undefined` | Get scene by ID |
| getVisualMotifs | 1713 | `VisualMotif[]` | Get visual motifs |
| getScenesByChapter | 1720 | `CinematicScene[]` | Get chapter scenes |
| getAnalysisHistory | 1727 | `CinematicAnalysis[]` | Get analysis history |
| clearAllData | 1734 | `void` | Clear all data |
| searchCinematicTechniques | 370 | `Promise<WebSearchResult[]>` | Search techniques |
| searchVisualStorytelling | 390 | `Promise<TechnicalSearchResult[]>` | Search visual storytelling |
| searchSceneComposition | 409 | `Promise<WebSearchResult[]>` | Search composition |

#### CrossArcSynergyEngine
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| createArc | 408 | `NarrativeArc` | Create arc |
| startArc | 477 | `void` | Start arc |
| addChapterToArc | 488 | `void` | Add chapter |
| createConnection | 532 | `ArcConnection` | Create connection |
| createDependency | 590 | `ArcDependency` | Create dependency |
| createConflict | 621 | `ArcConflict` | Create conflict |
| createConvergencePoint | 654 | `ConvergencePoint` | Create convergence |
| createDivergencePoint | 684 | `DivergencePoint` | Create divergence |
| analyzeSynergy | 708 | `SynergyAnalysis` | Analyze synergy |
| balanceArcs | 801 | `ArcBalancing` | Balance arcs |
| synchronizeArcs | 918 | `ArcSynchronization` | Sync arcs |
| completeArc | 1024 | `void` | Complete arc |
| resolveConflict | 1042 | `void` | Resolve conflict |
| generateNarrativeReport | 1053 | `CrossArcNarrativeReport` | Generate report |
| getArc | 1138 | `NarrativeArc | undefined` | Get arc |
| getAllArcs | 1145 | `NarrativeArc[]` | Get all arcs |
| getArcsByStatus | 1152 | `NarrativeArc[]` | Get by status |
| getConnectionsForArc | 1159 | `ArcConnection[]` | Get connections |
| getThematicMap | 1168 | `CrossArcThematicMap` | Get thematic map |
| getConvergencePoints | 1175 | `ConvergencePoint[]` | Get convergences |
| getDivergencePoints | 1182 | `DivergencePoint[]` | Get divergences |
| getSynchronizationHistory | 1189 | `ArcSynchronization[]` | Get sync history |
| searchArcConnections | 339 | `Promise<NarrativeSearchResult[]>` | Search connections |
| searchSynergyTechniques | 359 | `Promise<TechnicalSearchResult[]>` | Search techniques |
| searchConvergenceStrategies | 378 | `Promise<WebSearchResult[]>` | Search convergence |

#### CreativeContentGenerator
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| generateChapter | 96 | `Promise<Chapter>` | Generate chapter |

#### DialogueIntelligenceSystem
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| searchDialoguePatterns | 320 | `Promise<WebSearchResult[]>` | Search patterns |
| searchRegionalDialects | 340 | `Promise<WebSearchResult[]>` | Search dialects |
| searchCharacterVoiceExamples | 359 | `Promise<WebSearchResult[]>` | Search voices |
| searchConversationStructures | 378 | `Promise<WebSearchResult[]>` | Search structures |
| analyzeDialogueWithWebResearch | 396 | `Promise<DialogueAnalysis>` | Analyze dialogue |
| getSpeechPatternSuggestions | 442 | `Promise<string[]>` | Get suggestions |

#### DynamicWorldSimulation
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| searchWorldBuildingTechniques | 499 | `Promise<TechnicalSearchResult[]>` | Search techniques |
| searchGeographicalDetails | 516 | `Promise<WebSearchResult[]>` | Search geography |
| searchHistoricalReferences | 535 | `Promise<WebSearchResult[]>` | Search history |
| searchTechDevelopments | 554 | `Promise<WebSearchResult[]>` | Search tech |
| simulateWithWebResearch | 573 | `Promise<SimulationResult>` | Simulate with research |
| getFactionInspiration | 606 | `Promise<WebSearchResult[]>` | Get faction ideas |

#### ExperimentalNarrativeModes
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| searchExperimentalTechniques | 357 | `Promise<WebSearchResult[]>` | Search experimental |
| searchInnovativeMethods | 376 | `Promise<TechnicalSearchResult[]>` | Search innovative |
| searchInnovationTrends | 395 | `Promise<LiterarySearchResult[]>` | Search trends |

#### MetaCognitionSystem
| Method | Line | Return Type | Purpose |
|--------|------|-------------|---------|
| searchBestPractices | 208 | `Promise<TechnicalSearchResult[]>` | Search best practices |
| searchSimilarNarrativeStructures | 224 | `Promise<NarrativeSearchResult[]>` | Search structures |

### Private Internal Methods

**AdvancedStoryEngine Private Methods:**
- enhanceContextWithWebSearch (463)
- updateContinuityLedger (575)
- generateNarrativeContent (597)
- generateScene (645)
- generateCharacterBehavior (672)
- generateDialogue (696)
- applyCinematicEnhancements (722)
- applySymbolicDepth (748)
- validateCompleteChapter (770)
- applyRepairs (1186)
- buildNameSearchQuery (889)
- extractNamesFromResults (900)
- synthesizeUniqueNameFromWeb (919)
- generateUniqueName (930)
- generateElementFingerprint (938)
- generateParagraphFingerprint (942)
- generateFingerprint (953)
- enhanceMotivationsWithCulturalData (957)
- enhanceSymbolicElementsWithMythology (973)
- initializeUniqueElementTracker (993)
- countWords (1003)
- calculateQualityScore (1007)
- calculateUniquenessScore (1028)
- generateSceneStructure (1035)
- calculateSceneCount (1060)
- generateBehaviorFromState (1070)
- generateCharacterDialogue (1081)
- generateWorldElements (1092)
- enhanceWithVisualComposition (1100)
- enhanceWithSymbolicElement (1108)
- generateChapterMetadata (1116)

**Other Systems Private Methods:**
- 800+ additional private methods across all systems
- Used internally for specific processing tasks
- Not exposed to external API

---

## 13. Async Method Location Index

Complete mapping of all async methods for understanding asynchronous operations and potential performance bottlenecks.

### Async Method Summary

| Category | Count | Notes |
|----------|-------|-------|
| Web Search Methods | ~40 | All search operations |
| Generation Methods | ~20 | Chapter/content generation |
| Validation Methods | ~10 | Async validation |
| Total | ~70 | - |

### Async Web Search Methods

#### AdvancedStoryEngine
| Method | Line | Search Type | Caches To |
|--------|------|-------------|----------|
| searchUniqueNames | 331 | General | nameGenerationCache |
| searchCulturalPatterns | 355 | General | culturalPatternCache |
| searchMythologicalStructures | 377 | Literary | mythologicalStructureCache |
| searchWorldBuildingInspiration | 399 | Best Practices | webSearchCache |
| searchNarrativeTechniques | 413 | Narrative Techniques | webSearchCache |
| searchItemAbilityInspiration | 435 | General | webSearchCache |
| searchLinguisticPatterns | 449 | General | webSearchCache |

#### CharacterContinuityGenome
| Method | Line | Search Type | Caches To |
|--------|------|-------------|----------|
| searchDevelopmentBestPractices | 580 | Best Practices | developmentBestPracticesCache |
| searchCharacterArchetype | 599 | Literary | archetypeDatabaseCache |
| searchPersonalityFrameworks | 619 | General | personalityFrameworksCache |
| searchRelationshipPatterns | 637 | General | relationshipPatternsCache |
| validateBehaviorWithWebResearch | 656 | General | - |
| getGrowthSuggestions | 704 | Multiple | - |

#### CinematicChoreographyEngine
| Method | Line | Search Type | Caches To |
|--------|------|-------------|----------|
| searchCinematicTechniques | 370 | Cinematic Techniques | cinematicTechniquesCache |
| searchVisualStorytelling | 390 | Best Practices | visualStorytellingCache |
| searchSceneComposition | 409 | Best Practices | sceneCompositionCache |

#### CrossArcSynergyEngine
| Method | Line | Search Type | Caches To |
|--------|------|-------------|----------|
| searchArcConnections | 339 | Narrative | arcConnectionCache |
| searchSynergyTechniques | 359 | Technical | synergyTechniquesCache |
| searchConvergenceStrategies | 378 | General | convergenceStrategiesCache |

#### DialogueIntelligenceSystem
| Method | Line | Search Type | Caches To |
|--------|------|-------------|----------|
| searchDialoguePatterns | 320 | General | dialoguePatternsCache |
| searchRegionalDialects | 340 | General | regionalDialectsCache |
| searchCharacterVoiceExamples | 359 | General | speechPatternsCache |
| searchConversationStructures | 378 | General | conversationStructureCache |
| analyzeDialogueWithWebResearch | 396 | Multiple | - |
| getSpeechPatternSuggestions | 442 | Multiple | - |

#### DynamicWorldSimulation
| Method | Line | Search Type | Caches To |
|--------|------|-------------|----------|
| searchWorldBuildingTechniques | 499 | Technical | worldBuildingCache |
| searchGeographicalDetails | 516 | General | geographicalCache |
| searchHistoricalReferences | 535 | General | historicalCache |
| searchTechDevelopments | 554 | General | technologicalCache |
| simulateWithWebResearch | 573 | Multiple | - |
| getFactionInspiration | 606 | General | - |

#### ExperimentalNarrativeModes
| Method | Line | Search Type | Caches To |
|--------|------|-------------|----------|
| searchExperimentalTechniques | 357 | General | experimentalTechniquesCache |
| searchInnovativeMethods | 376 | Technical | innovativeMethodsCache |
| searchInnovationTrends | 395 | Literary | innovationTrendsCache |

#### MetaCognitionSystem
| Method | Line | Search Type | Caches To |
|--------|------|-------------|----------|
| searchBestPractices | 208 | Technical | bestPracticesCache |
| searchSimilarNarrativeStructures | 224 | Narrative | genreConventionsCache |

### Async Generation Methods

| Method | Line | System | Purpose |
|--------|------|--------|---------|
| generateChapter | 50 | AIStoryEngine | Generate chapter |
| generateChapter | 96 | CreativeContentGenerator | Generate creative chapter |
| generateCompleteChapter | 269 | AdvancedStoryEngine | Generate complete chapter |
| generateUniqueElement | 506 | AdvancedStoryEngine | Generate unique element |
| validateChapterUniqueness | 548 | AdvancedStoryEngine | Validate uniqueness |
| searchForContent | 133 | CreativeContentGenerator | Search for content |

### Async Processing Methods

| Method | Line | System | Purpose |
|--------|------|--------|---------|
| enhanceContextWithWebSearch | 463 | AdvancedStoryEngine | Enhance generation context |
| generateNarrativeContent | 597 | AdvancedStoryEngine | Generate narrative |
| generateScene | 645 | AdvancedStoryEngine | Generate scene |
| generateDialogue | 696 | AdvancedStoryEngine | Generate dialogue |
| applyCinematicEnhancements | 722 | AdvancedStoryEngine | Apply enhancements |
| applySymbolicDepth | 748 | AdvancedStoryEngine | Apply symbolism |
| validateCompleteChapter | 770 | AdvancedStoryEngine | Validate chapter |
| applyRepairs | 1186 | AdvancedStoryEngine | Apply repairs |

### Async Performance Considerations

**Cache-First Pattern:**
- All web search methods check cache before making network requests
- Reduces async overhead and improves performance

**Parallelization Opportunities:**
- Multiple search methods can be called in parallel
- Scene generation can parallelize multiple scenes

**Sequential Dependencies:**
- generateChapter → enhanceContextWithWebSearch → generateNarrativeContent
- generateNarrativeContent → generateScene → generateDialogue

---

**Sections 12-13 Complete: Private/Public & Async Method Indexes**

---

## 14. Return Type Quick Reference

Quick reference for return types across the codebase.

### Return Type Summary

| Return Type | Count | Common Methods |
|-------------|-------|----------------|
| `void` | ~200 | Setters, processors, clear methods |
| `Promise<Chapter>` | 3 | Main generation methods |
| `Promise<WebSearchResult[]>` | ~20 | Web search methods |
| `Promise<TechnicalSearchResult[]>` | ~12 | Technical searches |
| `Promise<LiterarySearchResult[]>` | ~8 | Literary searches |
| `Promise<NarrativeSearchResult[]>` | ~6 | Narrative searches |
| `Promise<string[]>` | 5 | Name/pattern results |
| `CinematicScene` | 1 | Scene analysis |
| `CinematicAnalysis` | 1 | Analysis result |
| `NarrativeState` | 1 | State retrieval |
| `SystemsStatus` | 1 | System health |
| `number` | ~15 | Score calculations |
| `string` | ~10 | ID/name generation |
| `boolean` | ~8 | Validation checks |

### Generation Return Types

| Method | System | Return Type |
|--------|--------|-------------|
| generateChapter | AIStoryEngine | `Promise<Chapter>` |
| generateChapter | CreativeContentGenerator | `Promise<Chapter>` |
| generateCompleteChapter | AdvancedStoryEngine | `Promise<Chapter>` |
| generateUniqueElement | AdvancedStoryEngine | `Promise<UniqueElement>` |
| generateAnalysis | CinematicChoreographyEngine | `CinematicAnalysis` |
| analyzeScene | CinematicChoreographyEngine | `CinematicScene` |
| analyzeSynergy | CrossArcSynergyEngine | `SynergyAnalysis` |
| balanceArcs | CrossArcSynergyEngine | `ArcBalancing` |
| synchronizeArcs | CrossArcSynergyEngine | `ArcSynchronization` |
| generateNarrativeReport | CrossArcSynergyEngine | `CrossArcNarrativeReport` |

### Search Return Types

| Method Pattern | Return Type | Example Methods |
|----------------|-------------|-----------------|
| searchUniqueNames | `Promise<string[]>` | AdvancedStoryEngine |
| searchCulturalPatterns | `Promise<NarrativeSearchResult[]>` | AdvancedStoryEngine |
| searchMythologicalStructures | `Promise<LiterarySearchResult[]>` | AdvancedStoryEngine |
| searchCinematicTechniques | `Promise<WebSearchResult[]>` | CinematicChoreographyEngine |
| searchArcConnections | `Promise<NarrativeSearchResult[]>` | CrossArcSynergyEngine |
| searchDialoguePatterns | `Promise<WebSearchResult[]>` | DialogueIntelligenceSystem |
| searchBestPractices | `Promise<TechnicalSearchResult[]>` | MetaCognitionSystem |

### State/Retrieval Return Types

| Method | Return Type | System |
|--------|-------------|--------|
| getNarrativeState | `NarrativeState` | AIStoryEngine |
| getSystemsStatus | `SystemsStatus` | AdvancedStoryEngine |
| getContinuityLedger | `GlobalContinuityLedger` | AdvancedStoryEngine |
| getMemory | `ChapterMemory` | AIStoryEngine |
| getFlowManager | `WorldFlowManager` | AIStoryEngine |
| getAllScenes | `CinematicScene[]` | CinematicChoreographyEngine |
| getScene | `CinematicScene \| undefined` | CinematicChoreographyEngine |
| getVisualMotifs | `VisualMotif[]` | CinematicChoreographyEngine |
| getAnalysisHistory | `CinematicAnalysis[]` | CinematicChoreographyEngine |
| getAllArcs | `NarrativeArc[]` | CrossArcSynergyEngine |
| getArc | `NarrativeArc \| undefined` | CrossArcSynergyEngine |
| getArcsByStatus | `NarrativeArc[]` | CrossArcSynergyEngine |
| getConnectionsForArc | `ArcConnection[]` | CrossArcSynergyEngine |
| getThematicMap | `CrossArcThematicMap` | CrossArcSynergyEngine |
| getConvergencePoints | `ConvergencePoint[]` | CrossArcSynergyEngine |
| getDivergencePoints | `DivergencePoint[]` | CrossArcSynergyEngine |
| getSynchronizationHistory | `ArcSynchronization[]` | CrossArcSynergyEngine |

### Validation Return Types

| Method | Return Type | System |
|--------|-------------|--------|
| validateChapterUniqueness | `Promise<ValidationResult>` | AdvancedStoryEngine |
| calculateQualityScore | `number` | AIStoryEngine |
| validateBehaviorWithWebResearch | `Promise<ContinuityCheck & { webInsights }>` | CharacterContinuityGenome |
| analyzeDialogueWithWebResearch | `Promise<DialogueAnalysis>` | DialogueIntelligenceSystem |
| simulateWithWebResearch | `Promise<SimulationResult>` | DynamicWorldSimulation |

### Creation Return Types

| Method | Return Type | System |
|--------|-------------|--------|
| createArc | `NarrativeArc` | CrossArcSynergyEngine |
| createConnection | `ArcConnection` | CrossArcSynergyEngine |
| createDependency | `ArcDependency` | CrossArcSynergyEngine |
| createConflict | `ArcConflict` | CrossArcSynergyEngine |
| createConvergencePoint | `ConvergencePoint` | CrossArcSynergyEngine |
| createDivergencePoint | `DivergencePoint` | CrossArcSynergyEngine |

---

## 15. Configuration Option Location

Complete mapping of all configuration interfaces and options.

### Configuration Interfaces

| Interface | File | Line | Purpose |
|-----------|------|------|---------|
| StoryGenerationOptions | AIStoryEngine.ts | 11 | Main story generation options |
| AdvancedStoryEngineConfig | AdvancedStoryEngine.ts | 38 | Advanced engine configuration |
| CreativeOptions | CreativeContentGenerator.ts | 21 | Content generation options |
| PacingConfiguration | PacingSystem.ts | 8 | Pacing system configuration |
| ToneOptions | PacingSystem.ts | 26 | Tone configuration |
| StatMergeConfig | StatMerging.ts | 8 | Stat merging configuration |
| WebSearchConfig | WebSearchIntegration.ts | 34 | Web search configuration |
| FlowConfiguration | WorldFlowManager.ts | 7 | World flow configuration |
| StoryEngineConfig | index.ts | 45 | Unified engine configuration |

### StoryGenerationOptions (AIStoryEngine.ts:11)

Main options for story generation:
- World logic settings
- VR/Real world parameters
- Generation preferences

### AdvancedStoryEngineConfig (AdvancedStoryEngine.ts:38)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enableWebSearch | boolean | true | Enable web search integration |
| qualityThreshold | number | 0.8 | Minimum quality score threshold |
| minimumChapterLength | number | 500 | Minimum words per chapter |
| enableUniqueGeneration | boolean | true | Enable unique element generation |

### WebSearchConfig (WebSearchIntegration.ts:34)

| Option | Type | Description |
|--------|------|-------------|
| Base URL | string | API endpoint for searches |
| Timeout | number | Request timeout |
| Max results | number | Maximum results per search |
| Retry attempts | number | Retry configuration |

### FlowConfiguration (WorldFlowManager.ts:7)

| Option | Type | Description |
|--------|------|-------------|
| Real world weight | number | Weight for real world events |
| VR world weight | number | Weight for VR world events |
| Transition threshold | number | When to transition worlds |
| Sync requirements | object | Sync level requirements |

### PacingConfiguration (PacingSystem.ts:8)

| Option | Type | Description |
|--------|------|-------------|
| Base pacing | string | Default pacing mode |
| Tension curve | number[] | Tension progression |
| Breathing room | number | Pause between intense scenes |
| Peak frequency | number | How often peaks occur |

### ToneOptions (PacingSystem.ts:26)

| Option | Type | Description |
|--------|------|-------------|
| Primary tone | string | Main narrative tone |
| Secondary tones | string[] | Additional tones |
| Tone weight | number | Tone influence level |
| Transition speed | number | How fast tones shift |

### StatMergeConfig (StatMerging.ts:8)

| Option | Type | Description |
|--------|------|-------------|
| Merge strategy | string | How to combine stats |
| Conflict resolution | string | How to handle conflicts |
| Priority weights | object | Stat priority levels |

### CreativeOptions (CreativeContentGenerator.ts:21)

| Option | Type | Description |
|--------|------|-------------|
| Content style | string | Writing style preference |
| Uniqueness level | number | How unique content should be |
| Web search enabled | boolean | Enable web search for content |
| Pool sizes | object | Content pool configurations |

### StoryEngineConfig (index.ts:45)

Unified configuration that combines:
- pacing: PacingConfiguration
- tone: ToneOptions
- tension: TensionConfiguration
- worldLogic: WorldLogicConfiguration

### Configuration Patterns

**Default Configuration:**
```typescript
const defaultConfig: AdvancedStoryEngineConfig = {
  enableWebSearch: true,
  qualityThreshold: 0.8,
  minimumChapterLength: 500,
  enableUniqueGeneration: true
};
```

**Partial Configuration:**
```typescript
// Only override specific options
constructor(config: Partial<WebSearchConfig> = {}) {
  this.config = { ...DEFAULT_SEARCH_CONFIG, ...config };
}
```

**Configuration Update:**
```typescript
updateOptions(newOptions: Partial<StoryGenerationOptions>): void {
  this.options = { ...this.options, ...newOptions };
}
```

---

**Sections 14-15 Complete: Return Type & Configuration Option Indexes**

---

## 16. Validation Rule Location Index

Complete mapping of all validation methods and rules across the codebase.

### Validation Methods by System

#### AdvancedStoryEngine
| Method | Line | Purpose | Return Type |
|--------|------|---------|-------------|
| validateChapterUniqueness | 548 | Check chapter uniqueness | `Promise<ValidationResult>` |
| validateCompleteChapter | 770 | Validate entire chapter | `Promise<ValidationResult>` |
| calculateQualityScore | 1007 | Score chapter quality | `number` |
| calculateUniquenessScore | 1028 | Score content uniqueness | `number` |

#### CharacterContinuityGenome
| Method | Line | Purpose | Return Type |
|--------|------|---------|-------------|
| validateBehaviorWithWebResearch | 656 | Validate with web research | `Promise<ContinuityCheck>` |
| checkContinuity | 762 | Check character continuity | `ContinuityCheck` |
| checkTraitConsistency | 816 | Validate trait consistency | `ContinuityIssue[]` |
| checkBehavioralConsistency | 871 | Validate behavior consistency | `ContinuityIssue[]` |
| checkPatternManifested | 901 | Check if pattern appeared | `boolean` |
| checkEmotionalConsistency | 909 | Validate emotional consistency | `ContinuityIssue[]` |
| checkSkillConsistency | 955 | Validate skill consistency | `ContinuityIssue[]` |
| checkRelationshipContinuity | 1275 | Check relationship continuity | `RelationshipContinuity` |

#### CharacterIntelligence
| Method | Line | Purpose | Return Type |
|--------|------|---------|-------------|
| checkConsistency | 339 | Check character consistency | `{ consistent: boolean; reason: string }` |

#### DialogueIntelligenceSystem
| Method | Line | Purpose | Return Type |
|--------|------|---------|-------------|
| checkIdiosyncrasy | 1119 | Check character idiosyncrasy | `boolean` |

#### ExperimentalNarrativeModes
| Method | Line | Purpose | Return Type |
|--------|------|---------|-------------|
| checkAchievements | 1064 | Check experimental achievements | `Achievement[]` |

#### MetaCognitionSystem
| Method | Line | Purpose | Return Type |
|--------|------|---------|-------------|
| validateNarrativeChoice | 280 | Validate narrative choice | `ValidationResult` |
| validateWithWebSearch | 261 | Validate with web search | `Promise<ValidationResult>` |

### Validation Types

| Type | Location | Properties |
|------|----------|------------|
| ValidationResult | AdvancedStoryEngine.ts:125 | `isValid: boolean`, `issues: ValidationIssue[]`, `qualityScore: number` |
| ContinuityCheck | CharacterContinuityGenome.ts:239 | `characterId: string`, `chapter: number`, `checks: ContinuityIssue[]` |
| ContinuityIssue | CharacterContinuityGenome.ts:247 | `type: string`, `severity: 'critical' | 'warning' | 'info'`, `description: string`, `suggestion: string` |
| ValidationIssue | AdvancedStoryEngine.ts:134 | `type: string`, `severity: string`, `description: string` |

### Validation Rules

**Quality Validation:**
- Minimum chapter length check (AdvancedStoryEngine.ts:780)
- Quality threshold check (AdvancedStoryEngine.ts:299)
- Quality score calculation (AdvancedStoryEngine.ts:1007)

**Uniqueness Validation:**
- Paragraph fingerprint comparison (AdvancedStoryEngine.ts:559)
- Duplicate detection (AdvancedStoryEngine.ts:528)
- Uniqueness score calculation (AdvancedStoryEngine.ts:1028)

**Character Continuity Validation:**
- Trait consistency checks (CharacterContinuityGenome.ts:816)
- Behavioral consistency checks (CharacterContinuityGenome.ts:871)
- Emotional consistency checks (CharacterContinuityGenome.ts:909)
- Skill consistency checks (CharacterContinuityGenome.ts:955)
- Relationship continuity checks (CharacterContinativeGenome.ts:1275)

**Content Validation:**
- Minimum word count enforcement (CreativeContentGenerator.ts:110)
- Dialogue idiosyncrasy checking (DialogueIntelligenceSystem.ts:1119)

### Validation Patterns

**Basic Validation Pattern:**
```typescript
const validation = await this.validateCompleteChapter(chapter, context);
if (!validation.isValid || validation.qualityScore < this.config.qualityThreshold) {
  // Handle validation failure
}
```

**Continuity Check Pattern:**
```typescript
const continuity = this.characterContinuity.checkContinuity(characterId, action, chapter, context);
if (continuity.checks.length > 0) {
  // Handle continuity issues
}
```

**Multiple Validation Pattern:**
```typescript
const issues = [];
issues.push(...this.checkTraitConsistency(genome, action, chapter));
issues.push(...this.checkBehavioralConsistency(genome, action, chapter));
issues.push(...this.checkEmotionalConsistency(genome, action, chapter));
return issues;
```

---

## 17. Type Error Common Locations

Quick reference for common type-related errors and their locations.

### Common Type Error Patterns

#### Interface Mismatch
| Location | Common Issue | Fix |
|----------|--------------|-----|
| Chapter usage | Missing properties | Ensure all required properties |
| Character types | Stat type mismatches | Check CharacterStat types |
| CinematicScene types | Optional properties | Handle undefined cases |

#### Generic Type Errors
| Pattern | Location | Fix |
|---------|----------|-----|
| `Promise<T>` misuse | All async methods | Ensure correct return type |
| Map key types | All cache properties | Use consistent key types |
| Array element types | All arrays | Ensure consistent element types |

#### Web Search Type Errors
| Location | Issue | Fix |
|----------|-------|-----|
| WebSearchResult | Missing properties | Check result structure |
| TechnicalSearchResult | Type casting issues | Verify type assertions |
| LiterarySearchResult | Array vs single | Check return type |

### Type Definition Locations

| Type | File | Line | Common Issues |
|------|------|------|---------------|
| Chapter | types.ts | - | Missing properties |
| Character | types.ts | - | Stat type mismatches |
| CinematicScene | CinematicChoreographyEngine.ts:25 | Optional fields not handled |
| ValidationIssue | AdvancedStoryEngine.ts:134 | Severity type errors |
| ContinuityIssue | CharacterContinuityGenome.ts:247 | Type property errors |
| WebSearchResult | WebSearchIntegration.ts | Result structure changes |

### Type Checking Best Practices

**Optional Properties:**
```typescript
// Always check optional properties
if (cinematicScene.visualComposition) {
  // Safe to use visualComposition
}
```

**Type Guards:**
```typescript
// Use type guards for narrowing
if (issue.severity === 'critical') {
  // TypeScript knows severity is 'critical'
}
```

**Type Assertions:**
```typescript
// Use type assertions carefully
const results = await webSearchIntegration.search(query) as WebSearchResult[];
```

**Generic Constraints:**
```typescript
// Use proper generic constraints
function process<T extends BaseObject>(items: T[]): T[] {
  return items.filter(item => item.isValid);
}
```

---

## 18. Build Error Pattern Index

Common build errors and their locations for quick debugging.

### TypeScript Compilation Errors

#### Module Import Errors
| Error Pattern | Location | Fix |
|---------------|----------|-----|
| Cannot find module | Import statements | Check import path |
| Module has no default export | Import statements | Use named import |
| Duplicate identifier | Export statements | Remove duplicate exports |

#### Type Errors
| Error Pattern | Location | Fix |
|---------------|----------|-----|
| Property does not exist | Interface usage | Add property to interface |
| Type is not assignable | Variable assignment | Check type compatibility |
| Argument not assignable | Function calls | Match parameter types |

#### Async/Await Errors
| Error Pattern | Location | Fix |
|---------------|----------|-----|
| Only async functions | Method without async | Add async keyword |
| Promise return type | Non-async method | Change return type or add async |
| Await must be in async | Top-level await | Wrap in async function |

### Common Build Locations

| File Type | Common Errors | Frequency |
|-----------|---------------|-----------|
| Interface definitions | Missing properties | High |
| Type exports | Circular dependencies | Medium |
| Async methods | Return type mismatches | High |
| Configuration | Type errors in config | Medium |

### Build Error Prevention

**Type Definitions:**
- Always define interfaces before use
- Use exported interfaces consistently
- Avoid circular dependencies

**Async Methods:**
- Always add `async` keyword
- Return correct `Promise<T>` type
- Use `await` properly

**Configuration:**
- Use `Partial<T>` for optional config
- Provide default values
- Type-check configuration objects

**Common Build Fixes:**

```typescript
// Fix 1: Missing import
import { Chapter } from '../../types';

// Fix 2: Type mismatch
const scene: CinematicScene = analyzeScene(content, chapter, num);

// Fix 3: Async return type
async generateChapter(): Promise<Chapter> {
  return { ... };
}

// Fix 4: Optional property check
if (scene.visualComposition) {
  processComposition(scene.visualComposition);
}
```

---

**Sections 16-18 Complete: Validation & Error Pattern Indexes**

---

## 19. Comment & Documentation Location

Quick reference for documentation patterns and comment locations across the codebase.

### Documentation Statistics

| Type | Count | Coverage |
|------|-------|----------|
| Total comments | 3,974 | ~14% of lines |
| JSDoc comments | ~500 | Method documentation |
| Inline comments | ~3,400 | Code explanations |
| TODO/FIXME | ~20 | Future work markers |

### Documentation Patterns

#### JSDoc Comments
Used for class and method documentation:

**Class Documentation Pattern:**
```typescript
/**
 * Main story generation engine with AI integration
 * Handles chapter generation, character management, and world building
 */
export class AIStoryEngine { ... }
```

**Method Documentation Pattern:**
```typescript
/**
 * Generate a new chapter based on previous chapter content
 * @param previousChapter - Optional previous chapter for continuity
 * @returns Promise resolving to the generated chapter
 */
async generateChapter(previousChapter?: Chapter): Promise<Chapter>
```

#### Inline Comments
Used for code explanations and clarifications:

**Logic Explanation:**
```typescript
// If this is the first chapter, initialize the story
if (chapterNumber === 1) { ... }

// Apply VR-specific logic for events
if (world === 'vr') { ... }
```

**Complex Calculation:**
```typescript
// Calculate quality score based on word count and content analysis
const score = this.calculateQualityScore(chapter);
```

### Documentation by File Type

| System | JSDoc | Inline | Total |
|--------|-------|--------|-------|
| AIStoryEngine | ~15 | ~50 | ~65 |
| AdvancedStoryEngine | ~30 | ~200 | ~230 |
| CharacterContinuityGenome | ~25 | ~180 | ~205 |
| CinematicChoreographyEngine | ~40 | ~250 | ~290 |
| CrossArcSynergyEngine | ~25 | ~150 | ~175 |
| Other systems | ~50 | ~500 | ~550 |

### Key Documentation Locations

**Interface Documentation:**
- AdvancedStoryEngine.ts:38-150 - Configuration interfaces
- CharacterContinuityGenome.ts:18-260 - Character genome interfaces
- CinematicChoreographyEngine.ts:25-250 - Cinematic interfaces

**Method Documentation:**
- Generation methods - Main entry point docs
- Search methods - Web search documentation
- Validation methods - Validation rule docs

**Configuration Documentation:**
- StoryGenerationOptions (AIStoryEngine.ts:11)
- AdvancedStoryEngineConfig (AdvancedStoryEngine.ts:38)
- WebSearchConfig (WebSearchIntegration.ts:34)

### Comment Search Patterns

**Find all TODOs:**
```bash
grep -rn "TODO\|FIXME" src/services/storyEngine/
```

**Find all JSDoc:**
```bash
grep -rn "^\s*\*\*\|^\s*\*\s*@" src/services/storyEngine/
```

**Find inline comments:**
```bash
grep -rn "^\s*//" src/services/storyEngine/
```

### Documentation Best Practices

1. **Document all public methods** with JSDoc
2. **Explain complex logic** with inline comments
3. **Document interfaces** with property descriptions
4. **Use TODO/FIXME** for future work markers
5. **Keep documentation updated** with code changes

---

## 20. Test Location Placeholder

This section provides a template for test coverage when tests are implemented.

### Current Test Status

| Category | Status | Coverage |
|----------|--------|----------|
| Unit Tests | Not Implemented | 0% |
| Integration Tests | Not Implemented | 0% |
| E2E Tests | Not Implemented | 0% |

### Recommended Test Structure

```
src/services/storyEngine/
├── __tests__/
│   ├── AIStoryEngine.test.ts
│   ├── AdvancedStoryEngine.test.ts
│   ├── ChapterMemory.test.ts
│   ├── CharacterContinuityGenome.test.ts
│   ├── CharacterIntelligence.test.ts
│   ├── CinematicChoreographyEngine.test.ts
│   ├── ConflictManager.test.ts
│   ├── CreativeContentGenerator.test.ts
│   ├── CrossArcSynergyEngine.test.ts
│   ├── DialogueIntelligenceSystem.test.ts
│   ├── DynamicWorldSimulation.test.ts
│   ├── ExperimentalNarrativeModes.test.ts
│   ├── ItemSystem.test.ts
│   ├── LoreManager.test.ts
│   ├── MemorySystem.test.ts
│   ├── MetaCognitionSystem.test.ts
│   ├── MoralEthicalDecisionEngine.test.ts
│   ├── MultiThreadNarrativeScheduler.test.ts
│   ├── NarrativeLogic.test.ts
│   ├── NarrativeRepairSystem.test.ts
│   ├── PacingSystem.test.ts
│   ├── PredictiveArcModeling.test.ts
│   ├── QualityControl.test.ts
│   ├── RealityBreachLogicFramework.test.ts
│   ├── StatMerging.test.ts
│   ├── StructuralIntegrityLayer.test.ts
│   ├── SymbolicLogicTracker.test.ts
│   ├── SystemScreenGenerator.test.ts
│   ├── ThemeManager.test.ts
│   ├── ThreatScalingSystem.test.ts
│   ├── WebSearchIntegration.test.ts
│   ├── WorldBuilder.test.ts
│   ├── WorldFlowManager.test.ts
│   └── index.test.ts
```

### Priority Test Areas

| Priority | System | Reason |
|----------|--------|--------|
| High | AIStoryEngine | Main entry point |
| High | AdvancedStoryEngine | Core generation logic |
| High | ChapterMemory | State management |
| High | CharacterContinuityGenome | Character consistency |
| High | Validation methods | Quality assurance |
| Medium | CinematicChoreographyEngine | Scene analysis |
| Medium | CrossArcSynergyEngine | Arc management |
| Medium | WebSearchIntegration | External dependency |
| Low | Supporting systems | Utility functions |

### Test Template

```typescript
import { SystemName } from '../SystemName';

describe('SystemName', () => {
  let system: SystemName;

  beforeEach(() => {
    system = new SystemName();
  });

  describe('methodName', () => {
    it('should return expected result for valid input', () => {
      // Arrange
      const input = 'valid input';

      // Act
      const result = system.methodName(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.property).toBe('expected');
    });

    it('should handle edge case: empty input', () => {
      // Test edge case
    });

    it('should throw error for invalid input', () => {
      // Test error case
    });
  });
});
```

### Test Coverage Goals

| Coverage Type | Target | Current |
|---------------|--------|---------|
| Line Coverage | 80% | 0% |
| Branch Coverage | 75% | 0% |
| Function Coverage | 85% | 0% |
| Statement Coverage | 80% | 0% |

### Test Implementation Checklist

- [ ] Create `__tests__` directory structure
- [ ] Implement AIStoryEngine tests
- [ ] Implement AdvancedStoryEngine tests
- [ ] Implement ChapterMemory tests
- [ ] Implement CharacterContinuityGenome tests
- [ ] Implement validation method tests
- [ ] Implement web search mock tests
- [ ] Add integration tests for system interactions
- [ ] Set up CI/CD test automation
- [ ] Configure coverage reporting

---

## Summary

**INDEX_NAVIGATION.md Complete**

### Sections Implemented: 20/20

| # | Section | Status |
|---|---------|--------|
| 1 | Line Number Quick Reference | ✅ Complete |
| 2 | Method Location Index (A-F) | ✅ Complete |
| 3 | Interface & Type Location Index | ✅ Complete |
| 4 | Export Statement Location Index | ✅ Complete |
| 5 | Error & Exception Location Map | ✅ Complete |
| 6 | System Entry Points | ✅ Complete |
| 7 | Web Search Integration Points | ✅ Complete |
| 8 | Property & Field Location Index | ✅ Complete |
| 9 | Cache Location Map | ✅ Complete |
| 10 | Import Statement Map | ✅ Complete |
| 11 | Constructor Parameter Index | ✅ Complete |
| 12 | Private vs Public Method Index | ✅ Complete |
| 13 | Async Method Location Index | ✅ Complete |
| 14 | Return Type Quick Reference | ✅ Complete |
| 15 | Configuration Option Location | ✅ Complete |
| 16 | Validation Rule Location Index | ✅ Complete |
| 17 | Type Error Common Locations | ✅ Complete |
| 18 | Build Error Pattern Index | ✅ Complete |
| 19 | Comment & Documentation Location | ✅ Complete |
| 20 | Test Location Placeholder | ✅ Complete |

### Quick Reference Links

- **Main Entry Points:** Section 6 (Constructors)
- **Web Search:** Section 7 (Integration Points)
- **Validation:** Section 16 (Validation Rules)
- **Caching:** Section 9 (Cache Map)
- **Configuration:** Section 15 (Config Options)
- **Methods by Name:** Section 2 (Method Index)
- **Async Operations:** Section 13 (Async Methods)
- **Public API:** Section 12 (Public Methods)

---

**INDEX_NAVIGATION.md - Quick Location & Implementation Guide**
**Generated for: endless-story-engine**
**Total Systems: 35 | Total Lines: 28,904 | Total Methods: ~950 | Total Caches: 40**
