export type UserTier = 'free' | 'pro' | 'studio';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: UserTier;
  isLoggedIn: boolean;
}

export type InputType = 'screenplay_excerpt' | 'pitch_concept' | 'outline' | 'treatment' | 'logline';

export type Genre = 
  | 'Sci-Fi' 
  | 'Psychological Thriller' 
  | 'Drama' 
  | 'Action / Adventure' 
  | 'Dark Comedy' 
  | 'Horror' 
  | 'Crime / Noir' 
  | 'Fantasy' 
  | 'Romance' 
  | 'Mystery';

export type TargetMedium = 'Feature Film' | 'TV Series (Pilot)' | 'Limited Series' | 'Short Film';

export interface ImageAttachment {
  mimeType: string;
  base64: string;
  fileName?: string;
}

export interface AnalysisRequest {
  title?: string;
  inputType: InputType;
  genre: Genre;
  targetMedium: TargetMedium;
  scriptText: string;
  imageAttachment?: ImageAttachment;
  focusAreas?: string[];
}

export interface LoglineAnalysis {
  originalLogline: string;
  refinedLogline: string;
  hookScore: number; // 0-100
  hookCritique: string;
  protagonistAnalysis: string;
  coreConflict: string;
  stakes: {
    internal: string;
    external: string;
  };
  engineVerdict: string;
}

export type BeatStatus = 'strong' | 'needs_punch' | 'missing' | 'misplaced';

export interface BeatInfo {
  act: 'Act 1' | 'Act 2A' | 'Act 2B' | 'Act 3';
  beatName: string;
  description: string;
  pageOrPercentage: string;
  status: BeatStatus;
  doctorNote: string;
}

export interface TensionPoint {
  positionPct: number; // 0 to 100
  label: string;
  tensionLevel: number; // 0 to 100
  isFlatSpot?: boolean;
  diagnosis?: string;
}

export interface CharacterRelationship {
  withCharacter: string;
  dynamic: string;
}

export interface CharacterAnalysis {
  name: string;
  role: 'Protagonist' | 'Antagonist' | 'Deuteragonist' | 'Catalyst' | 'Mentor' | 'Foil' | 'Supporting';
  flaw: string;
  want: string;
  need: string;
  arcType: 'Change Arc' | 'Growth Arc' | 'Tragic Fall' | 'Flat Arc' | 'Testing Arc';
  stakes: string;
  keyRelationships: CharacterRelationship[];
}

export interface FlatSpot {
  sceneOrBeat: string;
  issue: string;
  doctorFix: string;
}

export interface PacingCheck {
  overallPacingScore: number; // 0-100
  rhythmAnalysis: string;
  flatSpots: FlatSpot[];
  actTensionBalance: {
    act1: number;
    act2a: number;
    act2b: number;
    act3: number;
  };
}

export interface PitchDeckComp {
  title: string;
  year?: string;
  comparisonReason: string;
}

export interface PitchDeckCharacter {
  name: string;
  tagline: string;
  role: string;
  arcSummary: string;
}

export interface PitchDeckData {
  projectTitle: string;
  tagline: string;
  refinedLogline: string;
  synopsis: string;
  genreAndFormat: string;
  toneAndMood: {
    summary: string;
    visualStyle: string;
    keywords: string[];
  };
  targetAudience: {
    primaryDemographic: string;
    audienceAppeal: string;
  };
  comps: PitchDeckComp[];
  highConceptHook: string;
  keyCharacters: PitchDeckCharacter[];
  thematicCore: string;
  pitchDeckJSON: string;
}

export interface ScriptDoctorVerdict {
  overallScore: number;
  commercialViability: number;
  craftExecution: number;
  executiveSummary: string;
  topStrengths: string[];
  topPriorityFixes: string[];
}

export interface DramaturgyReport {
  id: string;
  timestamp: number;
  projectTitle: string;
  inputSummary: {
    type: InputType;
    genre: Genre;
    targetMedium: TargetMedium;
    wordCount: number;
  };
  loglineAnalysis: LoglineAnalysis;
  beatSheet: BeatInfo[];
  tensionCurve: TensionPoint[];
  characterAnalysis: CharacterAnalysis[];
  pacingCheck: PacingCheck;
  pitchDeckData: PitchDeckData;
  scriptDoctorVerdict: ScriptDoctorVerdict;
  rawScriptSnippet: string;
}

export interface DoctorChatMessage {
  id: string;
  sender: 'user' | 'doctor';
  timestamp: number;
  text: string;
  suggestedRewrite?: string;
}
