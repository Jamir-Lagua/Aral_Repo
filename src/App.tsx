/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Toaster } from 'sonner';
import { DashboardContainer } from './components/dashboard/DashboardContainer';
import { NotebookContainer } from './components/notebook/NotebookContainer';
import { PlannerContainer } from './components/planner/PlannerContainer';
import { LibraryContainer } from './components/library/LibraryContainer';
import { CourseViewer } from './components/library/CourseViewer';
import { OnboardingFlow } from './components/auth/OnboardingFlow';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    return localStorage.getItem('aral_onboarding_complete') === 'true';
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem('aral_onboarding_complete', 'true');
    setOnboardingComplete(true);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-aral-cream gap-4 text-aral-gold">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Initializing A.R.A.L...</p>
      </div>
    );
  }

  if (!user) {
    if (showLogin) {
      return <LoginPage onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onLogin={() => setShowLogin(true)} />;
  }

  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (viewingCourseId) {
    return <CourseViewer onBack={() => setViewingCourseId(null)} />;
  }

  return (
    <div className="flex h-screen w-full bg-aral-cream font-sans text-aral-ink overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        <Header title={activeTab} />
        
        <main className="flex-1 overflow-y-auto bg-aral-cream/20">
          <div className="h-full">
            {activeTab === 'dashboard' && <div className="p-10 max-w-7xl mx-auto"><DashboardContainer /></div>}
            {activeTab === 'notebook' && <NotebookContainer />}
            {activeTab === 'planner' && <div className="p-10 max-w-7xl mx-auto"><PlannerContainer /></div>}
            {activeTab === 'library' && (
              <div className="p-10 max-w-7xl mx-auto">
                <LibraryContainer onSelectCourse={(id) => setViewingCourseId(id)} />
              </div>
            )}
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors theme="light" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
