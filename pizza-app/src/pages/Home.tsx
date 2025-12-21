import { LuPizza, LuHeart, LuSearch } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Sidebar } from "../components/Sidebar";

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
  mealType?: string;
  reviewCount?: number;
  tags?: string[];
  servings?: number;
}

export const Home = () => {
const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
const [recipes, setRecipes] = useState<Recipe[]>([]);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState('');

const getAllRecipes = async () => {
  try {
    const response = await fetch('https://dummyjson.com/recipes');
    const data = await response.json();
    console.log(data);
    setRecipes(data.recipes);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching recipes:', error);
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
    console.log(data);
    setRecipes(data.recipes);
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

useEffect(() => {
  getAllRecipes();
}, []);

  const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
      <span className="text-xl">{icon}</span>
      <span className="font-bold text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
    </div>
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
        
     
        <aside className="w-64 bg-white p-6 hidden lg:flex flex-col gap-8 border-r border-gray-100 overflow-y-auto">
          <div className="space-y-2">
            <NavItem icon={<FaHome />} label="Home" active />
            <NavItem icon={<LuHeart />} label="Favorites" />
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
                <button className="flex justify-center items-center gap-2 w-32 h-12 cursor-pointer rounded-md shadow-2xl text-white font-semibold bg-gradient-to-r from-[#14b8a6] via-[#059669] to-[#047857] hover:shadow-xl hover:shadow-green-500 hover:scale-105 duration-300 hover:from-[#047857] hover:to-[#14b8a6]">
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

        <Sidebar selectedRecipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      </div>
    </div>
  );
};

