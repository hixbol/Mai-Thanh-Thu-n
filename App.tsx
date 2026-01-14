import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { PromptCard } from './components/PromptCard';
import { generateStudioPrompts, generateImagePreview } from './services/geminiService';
import { PromptRequest, GenerationStatus, GeneratedShot } from './types';
import { Camera, Zap, Crown, Key, Infinity as InfinityIcon } from 'lucide-react';

// Extend window interface for aistudio with the correct AIStudio type to avoid conflicts
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<PromptRequest>({
    modelImage: null,
    productImage: null,
    sceneContext: '',
  });

  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [results, setResults] = useState<GeneratedShot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    }
  };

  const handleConnectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Per guidelines: Assume the key selection was successful after triggering openSelectKey()
      // to mitigate race condition where hasSelectedApiKey() might not immediately return true.
      setHasApiKey(true);
    }
  };

  const handleGeneratePlan = async () => {
    if (!hasApiKey) {
      await handleConnectKey();
      // Proceed assuming key is selected to avoid race condition blocking
    }

    if (!formData.productImage || !formData.modelImage) return;

    setStatus(GenerationStatus.LOADING);
    setError(null);
    setResults([]);

    try {
      const shots = await generateStudioPrompts(formData.productImage, formData.sceneContext);
      setResults(shots);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Requested entity was not found') || err.message?.includes('403')) {
        setHasApiKey(false); // Reset key state if invalid
        setError("API Key invalid or expired. Please reconnect.");
      } else {
        setError("Failed to generate shot list. Please check your internet connection.");
      }
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handlePreviewGeneration = async (shotId: string, visualDescription: string) => {
    if (!hasApiKey) {
      await handleConnectKey();
      // Proceed assuming key is selected
    }

    if (!formData.modelImage || !formData.productImage) return;

    try {
      const generatedImageBase64 = await generateImagePreview(
        formData.modelImage,
        formData.productImage,
        visualDescription
      );

      setResults(prevResults => 
        prevResults.map(shot => 
          shot.id === shotId 
            ? { ...shot, previewImage: generatedImageBase64 }
            : shot
        )
      );
    } catch (err: any) {
      console.error("Failed to generate preview for shot", shotId, err);
      if (err.message?.includes('Requested entity was not found')) {
        setHasApiKey(false);
        alert("API Key invalid. Please reconnect.");
      } else {
        alert("Generation failed. Retrying usually works!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-studio-900 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-studio-700 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Camera className="w-8 h-8 text-studio-accent" />
              Virtual Studio Lens <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1"><InfinityIcon className="w-3 h-3" /> Infinite</span>
            </h1>
            <p className="text-slate-400 mt-2 max-w-lg">
              Create a coherent <span className="text-white font-medium">10-Shot Editorial Campaign</span>. 
              High-end storytelling with consistent atmospheric depth.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {!hasApiKey ? (
               <button 
                 onClick={handleConnectKey}
                 className="flex items-center gap-2 text-sm font-semibold bg-studio-700 hover:bg-studio-600 text-white px-4 py-2 rounded-lg transition-colors border border-studio-600"
               >
                 <Key className="w-4 h-4 text-studio-accent" />
                 Connect Access Key
               </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                <Zap className="w-3 h-3" />
                <span>Ready to Create</span>
              </div>
            )}
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-slate-400 underline">
              About Billing (Free Tier Available)
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-6">
            <InputForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleGeneratePlan} 
              status={status} 
            />
            
            <div className="bg-studio-800/50 p-6 rounded-2xl border border-studio-700/50 text-sm text-slate-400">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-studio-accent" />
                Director Mode Active
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Format:</strong> 10-Shot Cohesive Narrative.</li>
                <li><strong>Engine:</strong> Gemini 3.0 Flash Preview.</li>
                <li><strong>Style:</strong> High-End Editorial & Charisma.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8">
            {status === GenerationStatus.IDLE && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-studio-800 rounded-2xl">
                <Camera className="w-16 h-16 mb-4 opacity-20" />
                <p>Upload images & connect key to start.</p>
              </div>
            )}

            {status === GenerationStatus.LOADING && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-studio-accent border-t-transparent rounded-full animate-spin"></div>
                <div className="text-studio-accent font-mono animate-pulse">Designing Campaign (Flash Speed)...</div>
              </div>
            )}

            {status === GenerationStatus.ERROR && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-6 rounded-2xl">
                {error}
              </div>
            )}

            {status === GenerationStatus.SUCCESS && results.length > 0 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Production Album Shot List</h2>
                  <span className="text-sm text-slate-400 bg-studio-800 px-3 py-1 rounded-full">
                    {results.length} Shots Planned
                  </span>
                </div>
                
                <div className="space-y-4">
                  {results.map((shot, index) => (
                    <PromptCard 
                      key={shot.id}
                      id={shot.id}
                      title={shot.title}
                      visualDescription={shot.visualDescription}
                      delayIndex={index}
                      onGeneratePreview={handlePreviewGeneration}
                      previewImage={shot.previewImage}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;