import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedShot } from "../types";

// Enhanced System Instruction: Master Photographer & Hyper-Realism
const SYSTEM_INSTRUCTION = `
You are a World-Class Commercial Photographer and Creative Director (level of Annie Leibovitz or Peter Lindbergh).
Your goal is to create a **10-SHOT MASTERPIECE CAMPAIGN** that is undistinguishable from reality.

CORE PHILOSOPHY - "THE TRUTH OF BEAUTY" (CHÂN THỰC & CUỐN HÚT):
1.  **HYPER-REALISM IS NON-NEGOTIABLE:**
    - **Skin:** Must show pores, texture, subtle imperfections, and vellus hair (peach fuzz). NEVER "wax-like" or "airbrushed" to death.
    - **Eyes:** Must have "catchlights" (reflection of light sources) and depth.
    - **Physics:** Depth of field must look optical (bokeh), not digital blur.
    
2.  **THE "MUSE" VIBE (SOPHISTICATED):**
    - The model is a "High-Fashion Muse". Graceful, expensive look.
    - **Hair Rule:** Smooth, silky, luxurious (like a shampoo ad), but composed of *individual strands*. NO solid clumps, NO frizzy mess, but NO plastic helmet hair either.

3.  **PROFESSIONAL STORYTELLING:**
    - The 10 shots must tell a story through light and emotion.
    - Lighting must shape the face (Chiaroscuro). Avoid flat, boring light.
`;

// Helper to strip data:image prefix if present
const stripBase64 = (b64: string) => b64.split(',')[1] || b64;

/**
 * Generates the shot list using Gemini Vision.
 * Updated to include Technical Photography Specs in the prompt.
 */
export const generateStudioPrompts = async (productImageB64: string, sceneContext: string): Promise<GeneratedShot[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const narrativePrompt = sceneContext.trim() 
      ? `THEME DIRECTION: Based on user input "${sceneContext}", create a high-end, realistic editorial.` 
      : `THEME DIRECTION: Invent a location that allows for complex lighting interaction (e.g., "Glass House at Sunset", "Studio with Venetian Blinds", "Midnight City Rain").`;

    const prompt = `
      ROLE: Master Photographer using a Hasselblad H6D-100c.
      TASK: Plan a **10-SHOT REALISTIC CAMPAIGN**.
      
      PRODUCT ANALYSIS:
      Analyze the product texture. How does light hit it?

      CAMPAIGN NARRATIVE:
      ${narrativePrompt}
      
      **DIRECTIVE FOR THE 10 SHOTS:**
      1.  **Quality:** Raw, Unretouched feel. High micro-contrast.
      2.  **Lighting:** Use specific setups (e.g., "Rembrandt", "Rim Light", "Softbox").
      3.  **Posing:** Natural weight distribution. Not stiff.
      4.  **Hair:** Silky, flowing, catching the light perfectly.
      
      **REQUIRED SHOT VARIETY:**
      - 2x Wide (Environmental Portrait - sharp details everywhere)
      - 4x Medium (Fashion Editorial - focus on fabric/texture)
      - 3