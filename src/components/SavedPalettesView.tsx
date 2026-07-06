import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { Loader2, Trash2 } from 'lucide-react';

interface SavedPalette {
  id: string;
  colors: string[];
  createdAt: number;
}

const SavedPalettesView: React.FC = () => {
  const { user } = useAuth();
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPalettes = async () => {
      if (!user) {
        setPalettes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const q = query(
          collection(db, 'palettes'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SavedPalette[];
        
        // Sort manually since we might not have a composite index right away
        fetched.sort((a, b) => b.createdAt - a.createdAt);
        
        setPalettes(fetched);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'palettes');
      } finally {
        setLoading(false);
      }
    };

    fetchPalettes();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this palette?')) return;
    
    try {
      await deleteDoc(doc(db, 'palettes', id));
      setPalettes(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `palettes/${id}`);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
         <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center max-w-md">
            <h3 className="text-xl font-bold text-slate-800 mb-2 font-sans">Login Required</h3>
            <p className="text-slate-500 mb-6 font-sans">You need to sign in to view and save your color palettes.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-[clamp(1rem,4vw,2rem)] h-full">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 font-sans">Saved Palettes</h2>
        <p className="text-slate-500 mb-8 font-sans">View and manage your saved color combinations.</p>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
          </div>
        ) : palettes.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] text-center border border-slate-100">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
             </div>
             <h3 className="text-lg font-bold text-slate-700 mb-1 font-sans">No saved palettes yet</h3>
             <p className="text-slate-500 font-sans">Generate some beautiful colors and hit save!</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,17.5rem),1fr))] gap-[clamp(1rem,4vw,2rem)]">
            {palettes.map(palette => (
              <div key={palette.id} className="bg-white rounded-[24px] p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-slate-100 group">
                <div className="flex h-32 rounded-xl overflow-hidden mb-4">
                  {palette.colors.map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                     {palette.colors.map((color, i) => (
                       <span key={i} className="text-[11px] font-mono font-medium bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                         {color}
                       </span>
                     ))}
                  </div>
                  <button 
                    onClick={() => handleDelete(palette.id)}
                    className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all shrink-0 ml-2"
                    title="Delete Palette"
                  >
                     <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 text-[11px] text-slate-400 font-medium pl-1">
                   Saved {new Date(palette.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPalettesView;
