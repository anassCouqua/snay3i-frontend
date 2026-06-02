import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LandingPage from './LandingPage';
import reportWebVitals from './reportWebVitals';

function Router() {
  const path = window.location.pathname;
  const match = path.match(/^\/artisan\/([^/]+)\/([^/]+)\/?$/);
  if (match) {
    return <LandingPage serviceSlug={match[1]} citySlug={match[2]} />;
  }
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><Router /></React.StrictMode>);
reportWebVitals();
