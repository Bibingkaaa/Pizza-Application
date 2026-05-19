import { useState, useEffect } from "react";
import { LuPizza, LuHeart } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { Card } from "../components/Card";
import { Sidebar } from "../components/Sidebar";
import { NavLink } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  image: string;
  prepTimeMinutes: number;
  rating: number;
  cuisine: string;
  caloriesPerServing?: number;
  difficulty?: string;
  ingredients?: string[];
  mealType?: string | string[];
  reviewCount?: number;
  tags?: string[];
  servings?: number;
}

export const Favorites = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<Set<string>>(new Set());

  const RECIPE_LS_KEY = 'recipes';
  const FAV_LS_KEY = 'favorites';

  const getFavoriteIds = (): number[] => {
    const raw = localStorage.getItem(FAV_LS_KEY);
    return raw ? JSON.parse(raw) : [];
  };


  const getLocalRecipes = (): Recipe[] => {
    const raw = localStorage.getItem(RECIPE_LS_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const setLocalRecipes = (recipes: Recipe[]) => {
    localStorage.setItem(RECIPE_LS_KEY, JSON.stringify(recipes));
  };

  const fetchAndFilterFavorites = async () => {
    setLoading(true);
    try {
      const favIds = getFavoriteIds();
      if (favIds.length === 0) {
        setFavoriteRecipes([]);
        setLoading(false);
        return;
      }


      const response = await fetch('https://dummyjson.com/recipes?limit=0'); 
      const data = await response.json();
      const apiRecipes: Recipe[] = data.recipes || [];
      const localRecipes = getLocalRecipes();

      const uniqueFavIds = Array.from(new Set(favIds));
      const byId = new Map<number, Recipe>();

      apiRecipes.forEach(r => {
        byId.set(r.id, r);
      });
   
      localRecipes.forEach(r => {
        const base = byId.get(r.id) || ({} as Recipe);
        byId.set(r.id, { ...base, ...r });
      });

      const filtered = uniqueFavIds
        .map(id => byId.get(id))
        .filter((r): r is Recipe => !!r);

      setFavoriteRecipes(filtered);
      setMealTypes(computeMealTypes(filtered));
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndFilterFavorites();
  }, []);

  const computeMealTypes = (list: Recipe[]): string[] => {
    return Array.from(new Set(list.flatMap((r: Recipe) => {
      if (!r.mealType) return [] as string[];
      return Array.isArray(r.mealType) ? r.mealType : [r.mealType];
    })));
  };

  const applyFilters = (data: Recipe[]) => {
    let filtered = data;
    if (selectedMeals.size) {
      filtered = filtered.filter(r => {
        if (Array.isArray(r.mealType)) return r.mealType.some(m => selectedMeals.has(m));
        return r.mealType ? selectedMeals.has(r.mealType) : false;
      });
    }
    return filtered;
  };

  const toggleMeal = (meal: string) => {
    const next = new Set(selectedMeals);
    next.has(meal) ? next.delete(meal) : next.add(meal);
    setSelectedMeals(next);
  };

  const handleDelete = (id: number) => {
    // Remove from local recipes if it exists there
    const local = getLocalRecipes();
    const existsLocally = local.some(r => r.id === id);
    if (existsLocally) {
      const updatedLocal = local.filter(r => r.id !== id);
      setLocalRecipes(updatedLocal);
    }

    // Always remove from favorites list
    const favIds = getFavoriteIds();
    const updatedFavIds = favIds.filter(fid => fid !== id);
    localStorage.setItem(FAV_LS_KEY, JSON.stringify(updatedFavIds));

    // Update in-memory state
    setFavoriteRecipes(prev => {
      const next = prev.filter(r => r.id !== id);
      setMealTypes(computeMealTypes(next));
      return next;
    });

    if (selectedRecipe?.id === id) setSelectedRecipe(null);
  };

  const NavItem = ({ icon, label, to }: { icon: any, label: string, to: string }) => (
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all ${
          isActive 
            ? 'bg-slate-900 text-white shadow-lg' 
            : 'text-slate-500 hover:bg-slate-50'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`text-xl ${isActive ? 'text-white' : ''}`}>{icon}</span>
          <span className={`font-bold text-sm ${isActive ? 'text-white' : ''}`}>{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <div className="h-screen flex flex-col bg-[#f3f4f6] font-sans text-slate-800 overflow-hidden">
     
      <nav className="h-16 flex-shrink-0 z-30 flex items-center justify-between px-8 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <LuPizza size={18} />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">My Recipe Finder App</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">Profile User</p>
            <p className="text-xs text-slate-500">User</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white">
            <img src="/woman.png" alt="avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-64 bg-white p-6 hidden lg:flex flex-col gap-6 border-r border-gray-100 overflow-y-auto">
          <div className="space-y-2">
            <NavItem icon={<FaHome />} label="Home" to="/" />
            <NavItem icon={<LuHeart />} label="Favorites" to="/favorites" />
          </div>

          <hr className="border-gray-100" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Filters</h3>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Meal</p>
              <div className="flex flex-wrap gap-2">
                {(mealTypes.length ? mealTypes : ['snack']).map(meal => (
                  <button
                    key={meal}
                    onClick={() => toggleMeal(meal)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${selectedMeals.has(meal) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative">
          <div className={`transition-all duration-300 ${selectedRecipe ? 'xl:mr-[400px]' : ''}`}>
            <section className="mb-10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Your Favorites</h2>
                <p className="text-slate-500 text-sm">Recipes you've saved for later</p>
              </div>

              {loading ? (
                <p className="text-slate-500">Loading your favorites...</p>
              ) : applyFilters(favoriteRecipes).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {applyFilters(favoriteRecipes).map((recipe) => (
                    <Card 
                      key={recipe.id}
                      recipe={recipe}
                      bgColor="bg-white"
                      onClick={() => setSelectedRecipe(recipe)}
                      isSelected={selectedRecipe?.id === recipe.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <LuHeart size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-lg font-bold text-slate-400">No favorites yet</h3>
                  <p className="text-slate-400 text-sm">Start hearting recipes to see them here!</p>
                </div>
              )}
            </section>
          </div>
        </main>

        <Sidebar 
          selectedRecipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          onEdit={(updated) => {
            const local = getLocalRecipes();
            const idx = local.findIndex(r => r.id === updated.id);
            if (idx !== -1) {
              const updatedLocal = [...local];
              updatedLocal[idx] = { ...updatedLocal[idx], ...updated };
              setLocalRecipes(updatedLocal);
            }
            setFavoriteRecipes(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
            setSelectedRecipe(prev => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
          }} 
          onDelete={handleDelete} 
          onFavoriteChange={(id, isFav, recipe) => {
            setFavoriteRecipes(prev => {
              if (!isFav) {
                const next = prev.filter(r => r.id !== id);
                if (selectedRecipe?.id === id) setSelectedRecipe(null);
                setMealTypes(computeMealTypes(next));
                return next;
              }
              if (!recipe) {
                return prev;
              }
              const existingIndex = prev.findIndex(r => r.id === id);
              const next = existingIndex >= 0
                ? prev.map(r => r.id === id ? { ...r, ...recipe } : r)
                : [recipe, ...prev];
              setMealTypes(computeMealTypes(next));
              return next;
            });
          }} 
        />
      </div>
    </div>
  );
};