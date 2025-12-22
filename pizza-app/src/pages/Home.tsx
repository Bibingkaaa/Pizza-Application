import React, { useState, useEffect } from "react";
import { LuPizza, LuHeart, LuSearch } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { Card } from "../components/Card";
import { Sidebar } from "../components/Sidebar";
import { Add } from "../components/Add";
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

export const Home = () => {
const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
const [recipes, setRecipes] = useState<Recipe[]>([]);
const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState('');
const [mealTypes, setMealTypes] = useState<string[]>([]);
const [selectedMeals, setSelectedMeals] = useState<Set<string>>(new Set());

const LS_KEY = 'recipes';
const loadLocalRecipes = (): Recipe[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveLocalRecipes = (list: Recipe[]) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
};

const computeMealTypes = (list: Recipe[]): string[] => {
  return Array.from(new Set(list.flatMap((r: Recipe) => {
    if (!r.mealType) return [] as string[];
    return Array.isArray(r.mealType) ? r.mealType : [r.mealType];
  })));
};

const mergeWithLocal = (apiList: Recipe[], query?: string): Recipe[] => {
  const normalized = (query || '').toLowerCase().trim();
  const local = loadLocalRecipes();

  const matchesQuery = (r: Recipe): boolean => {
    if (!normalized) return true;
    const inText = (v?: string) => (v || '').toLowerCase().includes(normalized);
    const inArray = (arr?: string[]) => Array.isArray(arr) && arr.some(s => inText(s));
    return (
      inText(r.name) ||
      inText(r.cuisine) ||
      inText(Array.isArray(r.mealType) ? r.mealType.join(', ') : r.mealType) ||
      inArray(r.tags) ||
      inArray(r.ingredients)
    );
  };

  const localFiltered = local.filter(matchesQuery);
  const byId = new Map<number, Recipe>();
  [...apiList, ...localFiltered].forEach(r => {
    if (!byId.has(r.id)) {
      byId.set(r.id, r);
    } else {
      byId.set(r.id, { ...byId.get(r.id)!, ...r });
    }
  });
  return Array.from(byId.values());
};

const [isAddOpen, setIsAddOpen] = useState(false);
const handleAddRecipe = async (newRecipe: any) => {
  setLoading(true);
  try {
    const res = await fetch('https://dummyjson.com/recipes/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipe),
    });
    const created = await res.json();
    const existing = [...allRecipes, ...loadLocalRecipes()];
    const maxId = existing.reduce((max, r) => Math.max(max, r.id || 0), 0);
    const recipeWithId: Recipe = { ...newRecipe, id: created?.id ?? maxId + 1 };
    const nextLocal = [recipeWithId, ...loadLocalRecipes()];
    saveLocalRecipes(nextLocal);
    setMealTypes(computeMealTypes([...allRecipes, ...nextLocal]));
    setIsAddOpen(false);
  } catch (error) {
    const existing = [...allRecipes, ...loadLocalRecipes()];
    const maxId = existing.reduce((max, r) => Math.max(max, r.id || 0), 0);
    const fallback: Recipe = { ...newRecipe, id: maxId + 1 };
    const nextLocal = [fallback, ...loadLocalRecipes()];
    saveLocalRecipes(nextLocal);
    setMealTypes(computeMealTypes([...allRecipes, ...nextLocal]));
    setIsAddOpen(false);
  } finally {
    setLoading(false);
  }
};

// Handlers required by Sidebar to edit or delete a recipe
const handleEditRecipe = async (updatedRecipe: Recipe) => {
  setLoading(true);
  const isRemote = allRecipes.some(r => r.id === updatedRecipe.id);
  if (isRemote) {
    try {
      const res = await fetch(`https://dummyjson.com/recipes/${updatedRecipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe),
      });
      const serverRecipe = await res.json();
      const merged = { ...updatedRecipe, ...serverRecipe } as Recipe;
      const nextAll = allRecipes.map(r => r.id === merged.id ? { ...r, ...merged } : r);
      setAllRecipes(nextAll);
      setRecipes(applyFilters(nextAll));
      setMealTypes(computeMealTypes([...nextAll, ...loadLocalRecipes()]));
      setSelectedRecipe(merged);
    } catch (error) {
      const nextAll = allRecipes.map(r => r.id === updatedRecipe.id ? { ...r, ...updatedRecipe } : r);
      setAllRecipes(nextAll);
      setRecipes(applyFilters(nextAll));
      setMealTypes(computeMealTypes([...nextAll, ...loadLocalRecipes()]));
      setSelectedRecipe(updatedRecipe);
    } finally {
      setLoading(false);
    }
  } else {
    // Update local recipe
    const local = loadLocalRecipes();
    const updatedLocal = local.map(r => r.id === updatedRecipe.id ? { ...r, ...updatedRecipe } : r);
    saveLocalRecipes(updatedLocal);
    setMealTypes(computeMealTypes([...allRecipes, ...updatedLocal]));
    setSelectedRecipe(updatedRecipe);
    setLoading(false);
  }
};

const handleDeleteRecipe = async (id: number) => {
  setLoading(true);
  const isRemote = allRecipes.some(r => r.id === id);
  if (isRemote) {
    try {
      await fetch(`https://dummyjson.com/recipes/${id}`, { method: 'DELETE' });
    } catch (error) {
      // ignore network errors, proceed with local delete of remote list
    }
    const nextAll = allRecipes.filter(r => r.id !== id);
    setAllRecipes(nextAll);
    setRecipes(applyFilters(nextAll));
    setMealTypes(computeMealTypes([...nextAll, ...loadLocalRecipes()]));
    setSelectedRecipe(null);
    setLoading(false);
  } else {
    const local = loadLocalRecipes();
    const nextLocal = local.filter(r => r.id !== id);
    saveLocalRecipes(nextLocal);
    setMealTypes(computeMealTypes([...allRecipes, ...nextLocal]));
    setSelectedRecipe(null);
    setLoading(false);
  }
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

const getAllRecipes = async () => {
  try {
    const response = await fetch('https://dummyjson.com/recipes');
    const data = await response.json();
    setAllRecipes(data.recipes || []);
    setMealTypes(computeMealTypes([...(data.recipes || []), ...loadLocalRecipes()]));
    setLoading(false);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    const local = loadLocalRecipes();
    setAllRecipes([]);
    setMealTypes(computeMealTypes(local));
    setLoading(false);
  }
};

//Search
const searchRecipes = async (query: string) => {
  if (!query.trim()) {
    getAllRecipes();
    return;
  }
  
  try {
    setLoading(true);
    const response = await fetch(`https://dummyjson.com/recipes/search?q=${query}`);
    const data = await response.json();
    const merged = mergeWithLocal(data.recipes || [], query);
    setAllRecipes(merged);
    setRecipes(applyFilters(merged));
    setMealTypes(computeMealTypes(merged));
    setLoading(false);
  } catch (error) {
    console.error('Error searching recipes:', error);
    setLoading(false);
  }
};

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const query = e.target.value;
  setSearchQuery(query);
  searchRecipes(query);
};

const loadMealTypes = async () => {
  try {
    const response = await fetch('https://dummyjson.com/recipes/meal-type/snack');
    const data = await response.json();
    const fromEndpoint = data.recipes?.flatMap((r: any) => r.mealType ? (Array.isArray(r.mealType) ? r.mealType : [r.mealType]) : []) || [];
    const local = loadLocalRecipes();
    const fromLocal = computeMealTypes(local);
    setMealTypes(prev => Array.from(new Set([...prev, ...fromEndpoint, ...fromLocal])));
  } catch (error) {
    console.error('Error fetching meal types:', error);
    const local = loadLocalRecipes();
    setMealTypes(prev => Array.from(new Set([...prev, ...computeMealTypes(local)])));
  }
};


const toggleMeal = (meal: string) => {
  const next = new Set(selectedMeals);
  next.has(meal) ? next.delete(meal) : next.add(meal);
  setSelectedMeals(next);
};


useEffect(() => {
  setRecipes(applyFilters(allRecipes));
}, [selectedMeals, allRecipes]);

useEffect(() => {
  getAllRecipes();
  loadMealTypes();
}, []);

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
        
        <div className="flex-1 max-w-xl mx-12 relative">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search recipes..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-green-500/20 transition-all outline-none text-sm" 
          />
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
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">List of Recipes</h2>
                  <p className="text-slate-500 text-sm">recipe names, ingredients, instructions, and images, </p>
                </div>
                <button onClick={() => setIsAddOpen(true)} className="flex justify-center items-center gap-2 w-27 h-12 cursor-pointer rounded-lg shadow-2xl text-white font-semibold bg-gradient-to-r from-[#14b8a6] via-[#059669] to-[#047857] hover:shadow-xl hover:shadow-green-500 hover:scale-105 duration-300 hover:from-[#047857] hover:to-[#14b8a6]">
                  <svg 
                    className="w-6 h-6" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                      strokeLinejoin="round" 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <span className="text-sm tracking-wide">Add</span>
                </button>
              </div>
              <Add 
                isOpen={isAddOpen} 
                onClose={() => setIsAddOpen(false)} 
                onSave={handleAddRecipe} 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  <p className="text-slate-500">Loading recipes...</p>
                ) : (
                  recipes.map((recipe, index) => {
                    const colors = ['bg-green-100', 'bg-orange-100', 'bg-blue-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100'];
                    return (
                      <Card 
                        key={recipe.id}
                        recipe={recipe}
                        bgColor={colors[index % colors.length]}
                        onClick={() => setSelectedRecipe(recipe)}
                        isSelected={selectedRecipe?.id === recipe.id}
                      />
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </main>

        <Sidebar selectedRecipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} onEdit={handleEditRecipe} onDelete={handleDeleteRecipe} />
      </div>
    </div>
  );
};

