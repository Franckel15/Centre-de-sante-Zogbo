import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import { EditProvider } from './context/EditContext';
import { ThemeProvider } from './context/ThemeContext';
import EditToggle from './components/EditToggle';

// Lazy loading components
const Home = lazy(() => import('./components/Home'));
const Services = lazy(() => import('./components/Services'));
const Appointment = lazy(() => import('./components/Appointment'));
const About = lazy(() => import('./components/About'));
const Gallery = lazy(() => import('./components/Gallery'));
const Team = lazy(() => import('./components/Team'));
const Blog = lazy(() => import('./components/Blog'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const Contact = lazy(() => import('./components/Contact'));
const Admin = lazy(() => import('./components/Admin'));
const Audios = lazy(() => import('./components/Audios'));

// Component helper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Fallback loading component
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
    <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-xl">
      <Loader2 size={40} className="animate-spin text-teal-600 dark:text-teal-400" />
    </div>
    <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Chargement...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <EditProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-teal-100 selection:text-teal-900 flex flex-col transition-colors duration-300">
        <ScrollToTop />
        <Header />
        <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/audios" element={<Audios />} />
                <Route path="/team" element={<Team />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
            </Suspense>
        </main>
        <Footer />
        <EditToggle />
        </div>
      </ThemeProvider>
    </EditProvider>
  );
};

export default App;