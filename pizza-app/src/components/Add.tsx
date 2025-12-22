import { useState } from "react";
import { LuX, LuPlus, LuTrash2 } from "react-icons/lu";

export const Add = ({ isOpen, onClose, onSave }: any) => {
const [formData, setFormData] = useState({
    name: "",
    cuisine: "Italian",
    difficulty: "Easy",
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    caloriesPerServing: 0,
    servings: 1,
    image: "",
    ingredients: [""],
    instructions: [""],
    mealType: ["Dinner"],
    tags: [""],
    rating: 0,
    reviewCount: 0,
    userId: 166 // Default as per your data
  });

  const isNonEmpty = (s: string) => typeof s === 'string' && s.trim().length > 0;
  const hasNonEmpty = (arr: string[]) => Array.isArray(arr) && arr.some(isNonEmpty);
  const isValid = (
    isNonEmpty(formData.name) &&
    isNonEmpty(formData.cuisine) &&
    isNonEmpty(formData.difficulty) &&
    isNonEmpty(formData.image) &&
    formData.servings > 0 &&
    formData.prepTimeMinutes >= 0 &&
    formData.cookTimeMinutes >= 0 &&
    formData.caloriesPerServing >= 0 &&
    hasNonEmpty(formData.ingredients) &&
    hasNonEmpty(formData.instructions)
  );

  if (!isOpen) return null;

  const handleArrayChange = (index: number, value: string, field: string) => {
    const newArr = [...(formData as any)[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addField = (field: string) => {
    setFormData({ ...formData, [field]: [...(formData as any)[field], ""] });
  };

  const removeField = (index: number, field: string) => {
    const newArr = [...(formData as any)[field]];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create Recipe</h2>
            <p className="text-sm text-slate-500">Fill in the details for your new dish</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <LuX size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Recipe Name</label>
                <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-green-500/20" placeholder="e.g. Classic Margherita Pizza" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Cuisine</label>
                <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" value={formData.cuisine} onChange={(e) => setFormData({...formData, cuisine: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Difficulty</label>
                <select required className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Metrics Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Time & Nutrition</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['prepTimeMinutes', 'cookTimeMinutes', 'caloriesPerServing', 'servings'].map((field) => (
                <div key={field}>
                  <label className="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input required type="number" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 outline-none" onChange={(e) => setFormData({...formData, [field]: parseInt(e.target.value)})} />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Lists (Ingredients & Instructions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-slate-700">Ingredients</label>
                <button onClick={() => addField("ingredients")} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <LuPlus size={16}/>
                </button>
              </div>
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input required type="text" className="flex-1 bg-slate-50 border-none rounded-xl py-2 px-4 outline-none text-sm" value={ing} onChange={(e) => handleArrayChange(idx, e.target.value, "ingredients")} />
                  {formData.ingredients.length > 1 && (
                    <button onClick={() => removeField(idx, "ingredients")} className="p-2 text-slate-300 hover:text-red-500"><LuTrash2 size={16}/></button>
                  )}
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-slate-700">Instructions</label>
                <button onClick={() => addField("instructions")} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <LuPlus size={16}/>
                </button>
              </div>
              {formData.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <textarea required className="flex-1 bg-slate-50 border-none rounded-xl py-2 px-4 outline-none text-sm min-h-[40px]" value={step} onChange={(e) => handleArrayChange(idx, e.target.value, "instructions")} />
                  {formData.instructions.length > 1 && (
                    <button onClick={() => removeField(idx, "instructions")} className="p-2 text-slate-300 hover:text-red-500"><LuTrash2 size={16}/></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
          <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button
            disabled={!isValid}
            onClick={() => isValid && onSave(formData)}
            className={`flex-1 py-4 text-white font-bold rounded-2xl shadow-lg transition-all ${isValid ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            Create Recipe
          </button>
        </div>
      </div>
    </div>
  );
};