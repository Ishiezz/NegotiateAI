'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { TermsPanel } from '@/components/TermsPanel';
import { Deal, Message, NegotiatedTerms } from '@/types';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am the automated procurement agent for SteelCorp. How can I help you with your material needs today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isAccepting, setIsAccepting] = useState(false);

  const [terms, setTerms] = useState<NegotiatedTerms>({
    material: 'Not specified',
    quantity: 'Not specified',
    targetPrice: 'Not specified',
    delivery: 'Not specified',
  });

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
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

  const handleAccept = async () => {
    if (terms.material === 'Not specified') return;
    
    setIsAccepting(true);
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material: terms.material,
          quantity: terms.quantity,
          targetPrice: terms.targetPrice,
          deliveryDate: terms.delivery,
          status: 'ACCEPTED'
        }),
      });

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Terms accepted! I've logged the deal in our system. You can see it in your active deals list." }]);
        fetchDeals();
      }
    } catch (error) {
      console.error('Failed to accept deal:', error);
    } finally {
      setIsAccepting(false);
    }
  };

  const startNewNegotiation = () => {
    setMessages([
      { role: 'assistant', content: 'Hello! I am ready for a new negotiation. What material do you need today?' }
    ]);
    setTerms({
      material: 'Not specified',
      quantity: 'Not specified',
      targetPrice: 'Not specified',
      delivery: 'Not specified',
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar deals={deals} onNewNegotiation={startNewNegotiation} />
      <ChatInterface 
        messages={messages} 
        isLoading={isLoading} 
        onSendMessage={handleSendMessage} 
      />
      <TermsPanel 
        terms={terms} 
        onAccept={handleAccept} 
        isAccepting={isAccepting} 
      />
    </div>
  );
}
