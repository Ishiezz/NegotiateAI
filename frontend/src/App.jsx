import React from 'react';
import { Package, Truck, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import './index.css';
import './App.css'; // Remove if App.css isn't needed, but keeping for safety

function App() {
  return (
    <div className="app-container">
      <div className="bg-glow"></div>
      
      {/* Navigation */}
      <nav className="glass navbar animate-fade-up">
        <div className="logo-container">
          <div className="logo-icon">
            <Package size={24} color="#8b5cf6" />
          </div>
          <span className="logo-text">RawMart</span>
        </div>
        <div className="nav-links">
          <a href="#suppliers">Suppliers</a>
          <a href="#buyers">Buyers</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-actions">
          <button className="btn btn-secondary">Sign In</button>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-content animate-fade-up delay-100">
          <div className="badge">
            <span className="pulse-dot"></span>
            B2B Marketplace Revolutionized
          </div>
          <h1>
            Source Raw Materials <br />
            <span className="text-gradient">with Intelligence.</span>
          </h1>
          <p className="subtitle">
            Connect directly with verified suppliers worldwide. Streamline your supply chain, negotiate better rates, and secure high-quality materials for your production seamlessly.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg">
              Find Materials <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg">
              Become a Supplier
            </button>
          </div>
        </div>

        {/* Feature Cards Grid (Glassmorphism + Hover fx) */}
        <div className="features-grid animate-fade-up delay-200">
          <div className="glass feature-card">
            <div className="feature-icon" style={{ background: 'rgba(20, 184, 166, 0.1)' }}>
              <ShieldCheck size={28} color="#14b8a6" />
            </div>
            <h3>Verified Suppliers</h3>
            <p>Every supplier undergoes a strict vetting process to ensure quality and reliability.</p>
          </div>
          
          <div className="glass feature-card">
            <div className="feature-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <TrendingUp size={28} color="#8b5cf6" />
            </div>
            <h3>Dynamic Pricing</h3>
            <p>Real-time market data and volume-based discounts directly from manufacturers.</p>
          </div>

          <div className="glass feature-card">
            <div className="feature-icon" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
              <Truck size={28} color="#ec4899" />
            </div>
            <h3>Optimized Logistics</h3>
            <p>End-to-end transparency in shipping with integrated freight capabilities.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
