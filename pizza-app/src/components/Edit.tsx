import { useState, useEffect } from "react";
import { LuX, LuPlus, LuTrash2, LuImage } from "react-icons/lu";

interface EditProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any;
}

export const Edit = ({ isOpen, onClose, onSave, initialData }: EditProps) => {
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData, isOpen]);

  if (!isOpen || !formData) return null;

  const handleArrayChange = (index: number, value: string, field: string) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addField = (field: string) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeField = (index: number, field: string) => {
    const newArr = [...formData[field]];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Recipe</h2>
            <p className="text-sm text-slate-500 font-medium">Modify details for <span className="text-green-600">{initialData.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <LuX size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-50 p-6 rounded-[2rem]">
            <img 
              src={formData.image} 
              className="w-32 h-32 rounded-2xl object-cover shadow-md border-4 border-white" 
              alt="Recipe Preview" 
            />
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase flex items-center gap-1">
                <LuImage size={14}/> Image URL
              </label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none text-sm focus:ring-2 focus:ring-green-500/20" 
                value={formData.image} 
                onChange={(e) => setFormData({...formData, image: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Recipe Name</label>
              <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-green-500/20" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Cuisine</label>
              <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" value={formData.cuisine} onChange={(e) => setFormData({...formData, cuisine: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Difficulty</label>
              <select className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-2xl">
            {[
              { label: 'Prep Time', field: 'prepTimeMinutes' },
              { label: 'Cook Time', field: 'cookTimeMinutes' },
              { label: 'Calories', field: 'caloriesPerServing' },
              { label: 'Servings', field: 'servings' }
            ].map((item) => (
              <div key={item.field}>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 ml-1 uppercase">{item.label}</label>
                <input 
                  type="number" 
                  className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 outline-none" 
                  value={formData[item.field]} 
                  onChange={(e) => setFormData({...formData, [item.field]: parseInt(e.target.value) || 0})} 
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-900">Ingredients</label>
                <button onClick={() => addField("ingredients")} className="text-green-600 hover:bg-green-50 p-1 rounded-md transition-colors"><LuPlus size={20}/></button>
              </div>
              <div className="space-y-2">
                {formData.ingredients.map((ing: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" className="flex-1 bg-slate-50 border-none rounded-xl py-2 px-4 outline-none text-sm" value={ing} onChange={(e) => handleArrayChange(idx, e.target.value, "ingredients")} />
                    <button onClick={() => removeField(idx, "ingredients")} className="text-slate-300 hover:text-red-500 transition-colors"><LuTrash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-900">Instructions</label>
                <button onClick={() => addField("instructions")} className="text-green-600 hover:bg-green-50 p-1 rounded-md transition-colors"><LuPlus size={20}/></button>
              </div>
              <div className="space-y-2">
                {formData.instructions.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <textarea className="flex-1 bg-slate-50 border-none rounded-xl py-2 px-4 outline-none text-sm min-h-[44px]" value={step} onChange={(e) => handleArrayChange(idx, e.target.value, "instructions")} />
                    <button onClick={() => removeField(idx, "instructions")} className="text-slate-300 hover:text-red-500 transition-colors"><LuTrash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 flex gap-4 bg-white sticky bottom-0">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">Discard Changes</button>
          <button onClick={() => onSave(formData)} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black shadow-lg transition-all">Update Recipe</button>
        </div>
      </div>
    </div>
  );
};