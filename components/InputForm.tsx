import React from 'react';
import { PromptRequest, GenerationStatus } from '../types';
import { Camera, Package, MapPin, Loader2, Sparkles, Upload, X, Dices } from 'lucide-react';

interface InputFormProps {
  formData: PromptRequest;
  setFormData: React.Dispatch<React.SetStateAction<PromptRequest>>;
  onSubmit: () => void;
  status: GenerationStatus;
}

export const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onSubmit, status }) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'modelImage' | 'productImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, sceneContext: e.target.value }));
  };

  const clearImage = (field: 'modelImage' | 'productImage') => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const isLoading = status === GenerationStatus.LOADING;

  return (
    <div className="bg-studio-800 rounded-2xl p-6 shadow-xl border border-studio-700">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
        <Sparkles className="w-5 h-5 text-studio-accent" />
        Studio Configuration
      </h2>
      
      <div className="space-y-5">
        
        {/* Model Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Model Reference
          </label>
          {formData.modelImage ? (
            <div className="relative w-full h-48 bg-studio-900 rounded-lg overflow-hidden border border-studio-600 group">
              <img src={formData.modelImage} alt="Model" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <button onClick={() => clearImage('modelImage')} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-red-500/80 transition-colors text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-studio-600 rounded-lg cursor-pointer hover:border-studio-accent hover:bg-studio-700/30 transition-all">
              <Upload className="w-6 h-6 text-slate-500 mb-2" />
              <span className="text-sm text-slate-400">Upload Model Photo</span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'modelImage')} className="hidden" />
            </label>
          )}
        </div>

        {/* Product Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Package className="w-4 h-4" /> Product Reference
          </label>
          {formData.productImage ? (
            <div className="relative w-full h-48 bg-studio-900 rounded-lg overflow-hidden border border-studio-600 group">
              <img src={formData.productImage} alt="Product" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <button onClick={() => clearImage('productImage')} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-red-500/80 transition-colors text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-studio-600 rounded-lg cursor-pointer hover:border-studio-accent hover:bg-studio-700/30 transition-all">
              <Upload className="w-6 h-6 text-slate-500 mb-2" />
              <span className="text-sm text-slate-400">Upload Product Photo</span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'productImage')} className="hidden" />
            </label>
          )}
        </div>

        {/* Scene Context - Now Optional/Creative */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Studio Concept / Setting</span>
            <span className="text-xs text-studio-accent flex items-center gap-1"><Dices className="w-3 h-3"/> AI Auto-Detects Product</span>
          </label>
          <textarea
            name="sceneContext"
            value={formData.sceneContext}
            onChange={handleTextChange}
            rows={3}
            placeholder="E.g., Neon Cyberpunk Street, Minimalist White Loft, Golden Hour Beach... (Leave empty for AI Surprise)"
            className="w-full bg-studio-900 border border-studio-700 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-studio-accent focus:border-transparent outline-none transition-all placeholder:text-slate-600 resize-none"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading || !formData.modelImage || !formData.productImage}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold transition-all duration-200 
            ${isLoading || !formData.modelImage || !formData.productImage
              ? 'bg-studio-700 text-slate-500 cursor-not-allowed' 
              : 'bg-studio-accent text-studio-900 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20 active:transform active:scale-[0.98]'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Visualizing Concept...
            </>
          ) : (
            <>
              Initialize Studio
            </>
          )}
        </button>
      </div>
    </div>
  );
};