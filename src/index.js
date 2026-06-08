import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LandingPage from './LandingPage';
import Blog from './Blog';
import reportWebVitals from './reportWebVitals';

function Router() {
  const path = window.location.pathname;

  // /artisan/:service/:city
  const landingMatch = path.match(/^\/artisan\/([^/]+)\/([^/]+)\/?$/);
  if (landingMatch) {
    return <LandingPage serviceSlug={landingMatch[1]} citySlug={landingMatch[2]} />;
  }

  // /blog/:slug
  const articleMatch = path.match(/^\/blog\/([^/]+)\/?$/);
  if (articleMatch) {
    return <Blog articleSlug={articleMatch[1]} />;
  }

  // /blog
  if (path === '/blog' || path === '/blog/') {
    return <Blog />;
  }

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><Router /></React.StrictMode>);
reportWebVitals();
