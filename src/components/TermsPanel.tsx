'use client';

import React from 'react';
import { Package, TrendingDown, Clock, CheckCircle2 } from 'lucide-react';
import { NegotiatedTerms } from '../types';

interface TermsPanelProps {
  terms: NegotiatedTerms;
  onAccept: () => void;
  isAccepting: boolean;
}

export function TermsPanel({ terms, onAccept, isAccepting }: TermsPanelProps) {
  const isAwaiting = terms.material === 'Not specified';

  return (
    <div className="w-80 bg-white border-l border-slate-100 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-1">Extracted Terms</h2>
        <p className="text-xs text-slate-500 font-medium">Real-time parameters</p>
      </div>
      
      <div className="p-8 space-y-8 flex-1 overflow-y-auto">
        <TermCard 
          icon={<Package className="w-5 h-5" />} 
          label="Material & Quantity" 
          value={isAwaiting ? 'Awaiting info...' : `${terms.quantity} of ${terms.material}`} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50" 
        />
        <TermCard 
          icon={<TrendingDown className="w-5 h-5" />} 
          label="Target Price" 
          value={terms.targetPrice === 'Not specified' ? 'Negotiating...' : terms.targetPrice} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50" 
        />
        <TermCard 
          icon={<Clock className="w-5 h-5" />} 
          label="Delivery Schedule" 
          value={terms.delivery === 'Not specified' ? 'Flexible' : terms.delivery} 
          color="text-amber-600" 
          bgColor="bg-amber-50" 
        />
      </div>

      <div className="p-8 border-t border-slate-100 bg-slate-50/30">
         <button 
           onClick={onAccept}
           disabled={isAccepting || isAwaiting}
           className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center space-x-3 group"
         >
           {isAccepting ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
           ) : (
             <>
               <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
               <span>Accept & Sign</span>
             </>
           )}
         </button>
         <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-wider">Legally Binding Agreement</p>
      </div>
    </div>
  );
}

function TermCard({ icon, label, value, color, bgColor }: { icon: React.ReactNode, label: string, value: string, color: string, bgColor: string }) {
  const isPlaceholder = value.includes('info') || value.includes('Negotiating');

  return (
    <div className="group">
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${bgColor} ${color} transition-transform group-hover:scale-110 shadow-sm`}>
          {icon}
        </div>
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">{label}</h3>
      </div>
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:border-slate-200 transition-colors">
        <p className={`text-sm font-bold ${isPlaceholder ? 'text-slate-400 italic font-medium' : 'text-slate-700'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
