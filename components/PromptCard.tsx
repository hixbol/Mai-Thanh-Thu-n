import React, { useState } from 'react';
import { Copy, Check, Aperture, Wand2, Loader2, Maximize2, RefreshCw } from 'lucide-react';

interface PromptCardProps {
  id: string;
  title: string;
  visualDescription: string;
  delayIndex: number;
  onGeneratePreview: (id: string, description: string) => Promise<void>;
  previewImage?: string;
}

export const PromptCard: React.FC<PromptCardProps> = ({ 
  id, 
  title, 
  visualDescription, 
  delayIndex,
  onGeneratePreview,
  previewImage
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Construct a Midjourney-style text prompt (using placeholders for URLs since we have local files)
  const promptText = `[MODEL_URL] [PRODUCT_URL] ${visualDescription} --iw 2 --v 6.0 --style raw --ar 3:4`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    try {
      await onGeneratePreview(id, visualDescription);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="bg-studio-800 rounded-xl overflow-hidden border border-studio-700 hover:border-studio-600 transition-all group animate-fade-in-up flex flex-col md:flex-row"
      style={{ animationDelay: `${delayIndex * 100}ms` }}
    >
      {/* Content Section */}
      <div className="flex-1 p-0 flex flex-col">
        <div className="bg-studio-900/50 px-4 py-3 border-b border-studio-700 flex justify-between items-center">
          <h3 className="font-medium text-slate-200 flex items-center gap-2 text-sm">
            <Aperture className="w-4 h-4 text-studio-accent" />
            {title}
          </h3>
          <button
            onClick={handleCopy}
            className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded bg-studio-700 hover:bg-studio-600 text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
        </div>
        
        <div className="p-4 flex-grow">
          <p className="font-mono text-xs text-slate-400 leading-relaxed mb-4">
            {visualDescription}
          </p>
        </div>

        <div className="p-4 border-t border-studio-700/50 bg-studio-900/30">
          <button 
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all
              ${previewImage 
                ? 'bg-studio-800 text-slate-200 hover:bg-studio-700 border border-studio-600' 
                : 'bg-studio-700 hover:bg-studio-600 text-white border border-studio-600 hover:border-studio-500'
              }
              ${isGenerating ? 'opacity-80 cursor-wait' : ''}
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {previewImage ? 'Retaking Shot...' : 'Rendering...'}
              </>
            ) : previewImage ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Retake Shot (Infinite)
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-studio-accent" />
                Generate Preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Preview Section - Only shows if generated */}
      {(previewImage || isGenerating) && (
        <div className="w-full md:w-48 bg-black relative min-h-[256px] border-l border-studio-700 flex-shrink-0">
          {previewImage ? (
            <div className="relative w-full h-full group/img">
              <img 
                src={previewImage} 
                alt="AI Generated Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <a href={previewImage} download={`shot-${id}.png`} className="p-2 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 text-white">
                  <Maximize2 className="w-5 h-5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-2 p-4 text-center">
               <div className="w-8 h-8 border-2 border-studio-accent border-t-transparent rounded-full animate-spin"></div>
               <span className="text-xs">Developing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};