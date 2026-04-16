'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Briefcase, TrendingDown, Clock, Package } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am the automated procurement agent for SteelCorp. How can I help you with your material needs today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [terms, setTerms] = useState({
    material: 'Not specified',
    quantity: 'Not specified',
    targetPrice: 'Not specified',
    delivery: 'Not specified',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      
      if (data.extractedTerms) {
        setTerms(prev => ({ ...prev, ...data.extractedTerms }));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered a system error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <Briefcase className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold tracking-tight">NegotiateAI</h1>
        </div>
        <div className="p-4 flex-1">
          <p className="text-xs uppercase text-slate-500 font-semibold mb-4 tracking-wider">Active Deals</p>
          <div className="bg-slate-800 rounded-lg p-3 cursor-pointer border border-indigo-500/30">
            <h3 className="font-medium text-sm">SteelCorp Cop...</h3>
            <p className="text-xs text-slate-400 mt-1">Status: Negotiating</p>
          </div>
        </div>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          Powered by NegotiateAI Engine
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between bg-white">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Negotiation with SteelCorp</h2>
            <p className="text-sm text-slate-500">AI Procurement Agent</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-slate-600 font-medium">Agent Online</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600 ml-3' : 'bg-slate-800 mr-3'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' : 'bg-gray-100 text-slate-800 rounded-tl-none border border-gray-200'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-800 mr-3 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none border border-gray-200 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex relative items-center max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. I need 2 tonnes of copper wire by Friday. What's your best price?"
              className="flex-1 border border-gray-300 rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-slate-50">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Current Terms</h2>
          <p className="text-xs text-slate-500 mt-1">Live deal parameters</p>
        </div>
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-2 text-indigo-600">
              <Package className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Material & Quantity</h3>
            </div>
            <p className="text-sm text-slate-700 font-medium">{terms.quantity} of {terms.material}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-2 text-emerald-600">
              <TrendingDown className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Target Price</h3>
            </div>
            <p className="text-sm text-slate-700 font-medium">{terms.targetPrice}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-2 text-amber-600">
              <Clock className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Delivery</h3>
            </div>
            <p className="text-sm text-slate-700 font-medium">{terms.delivery}</p>
          </div>

        </div>
        <div className="p-6 border-t border-gray-200">
           <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-md flex items-center justify-center space-x-2">
             <span>Accept Terms</span>
           </button>
        </div>
      </div>

    </div>
  );
}
