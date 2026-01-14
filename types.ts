export interface ShotConfig {
  id: string;
  title: string;
  strategy: string;
  generatedPrompt?: string;
}

export interface PromptRequest {
  modelImage: string | null; // Base64 string
  productImage: string | null; // Base64 string
  sceneContext: string; // Renamed from productDescription. Now Optional (User vibe or AI Random)
}

export interface GeneratedShot {
  id: string;
  title: string;
  visualDescription: string;
  previewImage?: string; // Base64 string for the generated preview
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}