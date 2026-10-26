import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { StreakProvider } from './contexts/StreakContext';
import { ContentProgressProvider } from './contexts/ContentProgressContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { FloatingAiGuide } from './components/FloatingAiGuide';
import { AuthModal } from './components/AuthModal';
import { RazorpayModalFallback } from './components/RazorpayModalFallback';
import { RequireAuth } from './components/RequireAuth';
import { StreakCard } from './components/StreakCard';

// Core Pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const MoodTracker = lazy(() => import('./pages/MoodTracker').then(module => ({ default: module.MoodTracker })));
const HabitTracker = lazy(() => import('./pages/HabitTracker').then(module => ({ default: module.HabitTracker })));
const GoalTracker = lazy(() => import('./pages/GoalTracker').then(module => ({ default: module.GoalTracker })));
const HealthTracker = lazy(() => import('./pages/HealthTracker').then(module => ({ default: module.HealthTracker })));

// Global Community Modules
const GlobalDashboard = lazy(() => import('./pages/GlobalDashboard').then(module => ({ default: module.GlobalDashboard })));
const CommunitySurvey = lazy(() => import('./pages/CommunitySurvey').then(module => ({ default: module.CommunitySurvey })));
const FacultyEvaluation = lazy(() => import('./pages/FacultyEvaluation').then(module => ({ default: module.FacultyEvaluation })));
const Architecture = lazy(() => import('./pages/Architecture').then(module => ({ default: module.Architecture })));

// Pillars
const MentalWellness = lazy(() => import('./pages/MentalWellness').then(module => ({ default: module.MentalWellness })));
const Productivity = lazy(() => import('./pages/Productivity').then(module => ({ default: module.Productivity })));
const PhysicalHealth = lazy(() => import('./pages/PhysicalHealth').then(module => ({ default: module.PhysicalHealth })));
const DigitalWellbeing = lazy(() => import('./pages/DigitalWellbeing').then(module => ({ default: module.DigitalWellbeing })));

// Content Libraries
const Articles = lazy(() => import('./pages/Articles').then(module => ({ default: module.Articles })));
const Podcasts = lazy(() => import('./pages/Podcasts').then(module => ({ default: module.Podcasts })));
const Videos = lazy(() => import('./pages/Videos').then(module => ({ default: module.Videos })));
const Events = lazy(() => import('./pages/Events').then(module => ({ default: module.Events })));
const WorkerRights = lazy(() => import('./pages/WorkerRights').then(module => ({ default: module.WorkerRights })));
const PersonalSchedule = lazy(() => import('./pages/PersonalSchedule').then(module => ({ default: module.PersonalSchedule })));
const Community = lazy(() => import('./pages/Community').then(module => ({ default: module.Community })));
const Challenges = lazy(() => import('./pages/Challenges').then(module => ({ default: module.Challenges })));

// User Account & Support
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));
const Accessibility = lazy(() => import('./pages/Accessibility').then(module => ({ default: module.Accessibility })));

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
        <ContentProgressProvider>
        <ScheduleProvider>
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
                  <Suspense fallback={<div className="px-6 py-24 text-center text-sm text-ink-700 dark:text-linen-200">Loading page…</div>}>
                  <Routes>
                    {/* Home & Global Dashboard */}
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                    <Route path="/streaks" element={<RequireAuth><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><StreakCard /></div></RequireAuth>} />
                    <Route path="/schedule" element={<PersonalSchedule />} />

                    {/* Global Community Modules */}
                    <Route path="/global-dashboard" element={<GlobalDashboard />} />
                    <Route path="/community-survey" element={<CommunitySurvey />} />
                    <Route path="/evaluation" element={<FacultyEvaluation />} />
                    <Route path="/architecture" element={<Architecture />} />

                    {/* Specialized Somatic Trackers */}
                    <Route path="/mood-tracker" element={<RequireAuth><MoodTracker /></RequireAuth>} />
                    <Route path="/habit-tracker" element={<RequireAuth><HabitTracker /></RequireAuth>} />
                    <Route path="/goal-tracker" element={<RequireAuth><GoalTracker /></RequireAuth>} />
                    <Route path="/health-tracker" element={<RequireAuth><HealthTracker /></RequireAuth>} />

                    {/* Wellness Pillars */}
                    <Route path="/mental-wellness" element={<RequireAuth><MentalWellness /></RequireAuth>} />
                    <Route path="/productivity" element={<Productivity />} />
                    <Route path="/physical-health" element={<RequireAuth><PhysicalHealth /></RequireAuth>} />
                    <Route path="/digital-wellbeing" element={<RequireAuth><DigitalWellbeing /></RequireAuth>} />

                    {/* Content Libraries */}
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/worker-rights" element={<WorkerRights />} />
                    <Route path="/podcasts" element={<Podcasts />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/challenges" element={<RequireAuth><Challenges /></RequireAuth>} />

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
                  </Suspense>
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
        </ScheduleProvider>
        </ContentProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
