'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export function ChatInterface({ messages, isLoading, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col bg-white relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 z-20"></div>
      
      <header className="h-20 border-b border-slate-100 flex items-center px-8 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800">SteelCorp Intelligence</h2>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <p className="text-xs text-slate-500 font-medium tracking-wide">AI AGENT ONLINE</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Connection</p>
          <p className="text-xs font-semibold text-slate-600">Secure AES-256</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth bg-gradient-to-b from-white to-slate-50/30">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                msg.role === 'user' ? 'bg-indigo-600 ml-4 shadow-indigo-600/20' : 'bg-slate-900 mr-4 shadow-slate-900/20'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={`p-5 rounded-2xl shadow-sm leading-relaxed text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-slate-200/50'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex flex-row items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-slate-900 mr-4 flex items-center justify-center shadow-lg shadow-slate-900/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex relative items-center max-w-4xl mx-auto group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Negotiate material, quantity, or price..."
            className="flex-1 border border-slate-200 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-sm placeholder:text-slate-400 bg-slate-50/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
