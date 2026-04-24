'use client';

import React from 'react';
import { Briefcase, Plus, AlertCircle, Trash2 } from 'lucide-react';
import { Deal } from '../types';

interface SidebarProps {
  deals: Deal[];
  onNewNegotiation: () => void;
  onRefreshDeals: () => void;
}

export function Sidebar({ deals, onNewNegotiation, onRefreshDeals }: SidebarProps) {
  const handleDeleteDeal = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      const response = await fetch(`/api/deals/${id}`, { method: 'DELETE' });
      if (response.ok) {
        onRefreshDeals();
      }
    } catch (error) {
      console.error('Failed to delete deal:', error);
    }
  };

  return (
    <div className="w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-10">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">RawMart</h1>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <button 
          onClick={onNewNegotiation}
          className="w-full mb-6 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-95 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm font-semibold">New Negotiation</span>
        </button>

        <p className="text-[10px] uppercase text-slate-500 font-bold mb-4 tracking-[0.2em] px-2">Active Deals</p>
        <div className="space-y-3">
          {deals.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <AlertCircle className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-600">No active deals found.</p>
            </div>
          ) : (
            deals.map((deal) => (
              <div key={deal.id} className="bg-white/5 hover:bg-white/10 rounded-xl p-4 cursor-pointer border border-white/5 transition-all duration-200 group relative">
                <div className="flex justify-between items-start mb-1 pr-6">
                  <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors truncate">{deal.material}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${deal.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {deal.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{deal.quantity} • {deal.targetPrice}</p>
                <button 
                  onClick={(e) => handleDeleteDeal(e, deal.id)}
                  className="absolute right-2 bottom-2 p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 border-t border-white/10 bg-black/20">
        <div className="flex items-center space-x-3 opacity-60">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">System v1.2 Active</p>
        </div>
      </div>
    </div>
  );
}
