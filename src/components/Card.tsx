import { LuClock, LuStar } from "react-icons/lu";

interface Recipe {
  id: number;
  name: string;
  image: string;
  prepTimeMinutes: number;
  rating: number;
  cuisine: string;
}

interface CardProps {
  recipe: Recipe;
  bgColor: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const Card = ({ recipe, bgColor, onClick, isSelected }: CardProps) => {
  const { name, image, prepTimeMinutes, rating, cuisine } = recipe;
  
return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-[2.5rem] ${bgColor} transition-all hover:scale-[1.02] cursor-pointer border-4 ${isSelected ? 'border-slate-900 shadow-xl' : 'border-transparent'}`}
    >
      <div className="relative h-48 mb-4">
        <img src={image} alt={name} className="w-full h-full object-cover shadow-md" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold">
          <LuClock size={12} /> {prepTimeMinutes} min
        </div>
      </div>
      <div className="px-2 pb-2">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-slate-900">{name}</h4>
          <div className="flex items-center gap-1 text-xs font-bold">
            <LuStar size={14} className="text-orange-400 fill-orange-400" /> {rating}
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{cuisine} Cuisine</p>
      </div>
    </div>
  );
};