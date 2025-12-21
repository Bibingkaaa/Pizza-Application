import { LuX, LuHeart, LuChevronDown, LuStar, LuPencil, LuTrash2 } from "react-icons/lu";
import { useState } from "react";

const NutritionStat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center justify-center py-2">
    <span className="text-sm font-bold text-slate-900">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{label}</span>
  </div>
);

const Accordion = ({ 
  title, 
  children, 
  subtext, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  children?: React.ReactNode; 
  subtext?: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={onToggle}
        className="w-full py-4 flex justify-between items-center group outline-none"
      >
        <div className="flex items-center gap-1">
          <span className="font-bold text-slate-900 text-sm tracking-tight">{title}</span>
          {subtext && <span className="text-xs text-slate-400 font-normal">{subtext}</span>}
        </div>
        <LuChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-slate-400`} />
      </button>
      {isOpen && (
        <div className="pt-0 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ selectedRecipe, onClose }: any) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("Ingredients");

  if (!selectedRecipe) return null;

  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <aside className="fixed right-0 top-16 w-100 bg-white p-6 hidden xl:flex flex-col gap-6 border-l border-gray-100 h-[calc(100vh-4rem)] overflow-y-auto z-10">
  
      <div className="relative -mx-6 -mt-6">
        
        <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-50 object-cover" />
        <button onClick={onClose} className="absolute top-7 right-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors">
          <LuX size={18} />
        </button>
      </div>
  
<div className="flex justify-between items-center">
  <h2 className="text-xl font-bold text-slate-900">{selectedRecipe.name}</h2>
  

  <div className="flex items-center gap-2">

    <button
      onClick={() => console.log("Edit clicked")}
      className="p-2 rounded-full shadow-sm bg-white/80 hover:bg-blue-50 transition-colors group"
      title="Edit Recipe"
    >
      <LuPencil size={18} className="text-slate-400 group-hover:text-green-500" />
    </button>

    <button
      onClick={() => console.log("Delete clicked")}
      className="p-2 rounded-full shadow-sm bg-white/80 hover:bg-red-50 transition-colors group"
      title="Delete Recipe"
    >
      <LuTrash2 size={18} className="text-slate-400 group-hover:text-red-500" />
    </button>


    <button
      onClick={() => setIsFavorite(!isFavorite)}
      className={`p-2 rounded-full shadow-sm transition-colors ${isFavorite ? 'bg-rose-100' : 'bg-white/80'} hover:bg-rose-100`}
      title="Favorite"
    >
      <LuHeart
        size={20}
        className={`${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`}
      />
    </button>
  </div>
</div>
  <hr className="border-slate-100" />
    <div className="flex flex-col gap-2 -mb-4 -mt-4"> 
    <div className="grid grid-cols-3 divide-x divide-slate-100">
        <NutritionStat 
        label="Calories" 
        value={selectedRecipe.caloriesPerServing ? `${selectedRecipe.caloriesPerServing} kcal` : 'N/A'} 
        />
        <NutritionStat 
        label="Prep Time" 
        value={`${selectedRecipe.prepTimeMinutes || 0} min`} 
        />
        <NutritionStat 
        label="Difficulty" 
        value={selectedRecipe.difficulty || 'N/A'} 
        />
    </div>
    <hr className="border-slate-100" />
    </div>

<Accordion 
  title="Tags"
  isOpen={openSection === "Tags"}
  onToggle={() => handleToggle("Tags")}
>
  <div className="flex flex-wrap gap-x-2 gap-y-2.5 px-1 mt-0 pt-0">
    {selectedRecipe.tags && selectedRecipe.tags.length > 0 ? (
      selectedRecipe.tags.map((tag: string, index: number) => (
        <span 
          key={index} 
          className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-default"
        >
          {tag}
        </span>
      ))
    ) : (
      <p className="text-sm text-slate-400 mt-0">No tags categorized for this recipe.</p>
    )}
  </div>
</Accordion>

      {/* Info Rows */}
      <div className="space-y-3">
        {[
          { label: "Meal Type", value: Array.isArray(selectedRecipe.mealType) ? selectedRecipe.mealType.join(', ') : selectedRecipe.mealType },
          { label: "Servings", value: selectedRecipe.servings },
          { label: "Rating", value: selectedRecipe.rating, icon: <LuStar size={14} className="text-orange-400 fill-orange-400" /> },
          { label: "Reviews", value: selectedRecipe.reviewCount }
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">{item.label}:</span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-600 font-medium">{item.value || 'N/A'}</span>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <hr className="border-slate-100" />

      {/* Ingredients & Instructions */}
      <div className="-mt-4"> {/* Pulls accordions closer to the HR line */}
        <Accordion 
          title="Ingredients" 
          subtext={`(${selectedRecipe.servings || 1} servings)`}
          isOpen={openSection === "Ingredients"}
          onToggle={() => handleToggle("Ingredients")}
        >
          {/* FIX: Added mt-0 to remove top space */}
          <ul className="text-sm text-slate-600 space-y-2 px-1 mt-0">
            {selectedRecipe.ingredients?.map((ingredient: string, index: number) => (
              <li key={index} className="flex gap-2">
                <span className="text-slate-300">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </Accordion>

        <Accordion 
          title="Cooking Instructions"
          isOpen={openSection === "Cooking"}
          onToggle={() => handleToggle("Cooking")}
        >
          {/* FIX: Map through instructions for proper linebreaks and added mt-0 */}
          <ol className="text-sm text-slate-600 space-y-3 px-1 mt-0 list-decimal ml-4">
            {selectedRecipe.instructions?.map((step: string, index: number) => (
              <li key={index} className="pl-1 leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </Accordion>
      </div>
    </aside>
  );
};