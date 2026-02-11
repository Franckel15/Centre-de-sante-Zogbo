import React, { Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary component to catch crashes
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
          <h1 style={{ color: '#e53e3e' }}>Une erreur est survenue</h1>
          <p>Le site a rencontré un problème au démarrage.</p>
          <pre style={{ background: '#f7fafc', padding: '15px', borderRadius: '5px', textAlign: 'left', overflow: 'auto', maxWidth: '800px', margin: '20px auto' }}>
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#319795', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialisation sécurisée
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Impossible de trouver l'élément racine 'root' dans le DOM.");
  }

  console.log("Démarrage de l'application...");
  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <HashRouter>
          <App />
        </HashRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (e) {
  console.error("Erreur fatale lors du montage de l'application:", e);
  document.body.innerHTML = `<div style="padding: 20px; text-align: center; color: red;"><h1>Erreur Fatale</h1><p>Impossible de charger l'application.</p><pre>${String(e)}</pre></div>`;
}