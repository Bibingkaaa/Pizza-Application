import { LuTriangle } from "react-icons/lu";

export const Delete = ({ isOpen, onClose, onConfirm, recipeName }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
            <LuTriangle size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Recipe?</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-slate-800">"{recipeName}"</span>? This action cannot be undone.
          </p>

          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};