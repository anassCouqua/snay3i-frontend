import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './adsenseTrustGuard';
import App, { RegisterPage } from './App';
import LandingPage from './LandingPage';
import Blog from './Blog';
import { AboutPage, ContactPage, PrivacyPage, TermsPage } from './Pages';
import reportWebVitals from './reportWebVitals';

function Router() {
  const path = window.location.pathname;

  // /artisan/:service/:city
  const landingMatch = path.match(/^\/artisan\/([^/]+)\/([^/]+)\/?$/);
  if (landingMatch) {
    return <LandingPage serviceSlug={landingMatch[1]} citySlug={landingMatch[2]} />;
  }

  // Dedicated artisan acquisition route
  if (path === '/rejoindre' || path === '/rejoindre/') {
    return <RegisterPage onBack={() => { window.location.href = '/'; }} lang="fr" />;
  }

  // /blog/:slug
  const articleMatch = path.match(/^\/blog\/([^/]+)\/?$/);
  if (articleMatch) {
    return <Blog articleSlug={articleMatch[1]} />;
  }

  // Static pages
  if (path === '/blog' || path === '/blog/') return <Blog />;
  if (path === '/about' || path === '/about/') return <AboutPage />;
  if (path === '/contact' || path === '/contact/') return <ContactPage />;
  if (path === '/privacy' || path === '/privacy/') return <PrivacyPage />;
  if (path === '/terms' || path === '/terms/') return <TermsPage />;

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><Router /></React.StrictMode>);
reportWebVitals();
