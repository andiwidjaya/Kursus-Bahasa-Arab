import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { LearningPlayerPage } from './pages/LearningPlayerPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';

const MainContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'courses':
        return <CoursesPage />;
      case 'course-detail':
        return <CourseDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'dashboard':
        return <StudentDashboardPage />;
      case 'learn':
        return <LearningPlayerPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'blog':
        return <BlogListPage />;
      case 'blog-detail':
        return <BlogDetailPage />;
      default:
        return <HomePage />;
    }
  };

  const isImmersivePlayer = currentRoute === 'learn';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {!isImmersivePlayer && <Navbar />}
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {!isImmersivePlayer && <Footer />}

      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
