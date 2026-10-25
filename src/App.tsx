import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { StreakProvider } from './contexts/StreakContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { FloatingAiGuide } from './components/FloatingAiGuide';
import { AuthModal } from './components/AuthModal';
import { RazorpayModalFallback } from './components/RazorpayModalFallback';

// Core Pages
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { MoodTracker } from './pages/MoodTracker';
import { HabitTracker } from './pages/HabitTracker';
import { GoalTracker } from './pages/GoalTracker';
import { HealthTracker } from './pages/HealthTracker';

// Global Community Modules
import { GlobalDashboard } from './pages/GlobalDashboard';
import { CommunitySurvey } from './pages/CommunitySurvey';
import { FacultyEvaluation } from './pages/FacultyEvaluation';
import { Architecture } from './pages/Architecture';

// Pillars
import { MentalWellness } from './pages/MentalWellness';
import { Productivity } from './pages/Productivity';
import { PhysicalHealth } from './pages/PhysicalHealth';
import { DigitalWellbeing } from './pages/DigitalWellbeing';

// Content Libraries
import { Articles } from './pages/Articles';
import { Podcasts } from './pages/Podcasts';
import { Videos } from './pages/Videos';
import { Events } from './pages/Events';
import { Community } from './pages/Community';
import { Challenges } from './pages/Challenges';

// User Account & Support
import { Profile } from './pages/Profile';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Accessibility } from './pages/Accessibility';

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  // Collapsible sidebar state with local storage persistence
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('balance_sidebar_open');
    if (saved !== null) {
      return saved === 'true';
    }
    // Default open on desktop, closed on mobile
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });

  useEffect(() => {
    localStorage.setItem('balance_sidebar_open', String(isSidebarOpen));
  }, [isSidebarOpen]);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <StreakProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-linen-100 dark:bg-ink-950 text-ink-800 dark:text-linen-100 transition-colors selection:bg-sage-200 selection:text-ink-900">
              {/* Collapsible Content Navigation Sidebar */}
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />

              {/* Main Content Layout: smoothly expands to full width when sidebar is collapsed */}
              <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
                  isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
                }`}
              >
                {/* Minimalist Topbar (Max 4 items) */}
                <TopBar 
                  onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} 
                  isSidebarOpen={isSidebarOpen}
                />

                {/* Main View with Active Route Rendering */}
                <main className="flex-1">
                  <Routes>
                    {/* Home & Global Dashboard */}
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Global Community Modules */}
                    <Route path="/global-dashboard" element={<GlobalDashboard />} />
                    <Route path="/community-survey" element={<CommunitySurvey />} />
                    <Route path="/evaluation" element={<FacultyEvaluation />} />
                    <Route path="/architecture" element={<Architecture />} />

                    {/* Specialized Somatic Trackers */}
                    <Route path="/mood-tracker" element={<MoodTracker />} />
                    <Route path="/habit-tracker" element={<HabitTracker />} />
                    <Route path="/goal-tracker" element={<GoalTracker />} />
                    <Route path="/health-tracker" element={<HealthTracker />} />

                    {/* Wellness Pillars */}
                    <Route path="/mental-wellness" element={<MentalWellness />} />
                    <Route path="/productivity" element={<Productivity />} />
                    <Route path="/physical-health" element={<PhysicalHealth />} />
                    <Route path="/digital-wellbeing" element={<DigitalWellbeing />} />

                    {/* Content Libraries */}
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/podcasts" element={<Podcasts />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/challenges" element={<Challenges />} />

                    {/* User Profile & Legal Support */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/accessibility" element={<Accessibility />} />

                    {/* Fallback to Home */}
                    <Route path="*" element={<Home />} />
                  </Routes>
                </main>

                {/* Global Botanical Calm Footer */}
                <Footer />
              </div>

              {/* Floating Empathetic AI Coach ("Balance Guide") */}
              <FloatingAiGuide />

              {/* Global Auth & Razorpay Modals */}
              <AuthModal />
              <RazorpayModalFallback />
            </div>
          </Router>
        </StreakProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
