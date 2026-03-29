// @ts-nocheck
import React, { lazy, Suspense } from 'react';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LanguageProvider } from '@/lib/LanguageContext';

// רכיבים שצריכים להיטען מיד (Layout, הודעות שגיאה וכו')
import AppLayout from './components/layout/AppLayout';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import CookieConsent from './components/CookieConsent';
import PageNotFound from './lib/PageNotFound';

// --- כאן מתחיל הקסם של טעינה עצלה (Code Splitting) ---
// העמודים האלו יירדו למחשב של המשתמש רק כשהוא באמת ילחץ עליהם!
const Home = lazy(() => import('./pages/Home'));
const TherapistSearch = lazy(() => import('./pages/TherapistSearch'));
const TherapistProfile = lazy(() => import('./pages/TherapistProfile'));
const MatchQuizPage = lazy(() => import('./pages/MatchQuizPage'));
const RegisterTherapist = lazy(() => import('./pages/RegisterTherapist'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TherapistPortal = lazy(() => import('./pages/TherapistPortal'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const SupportDeclarationPage = lazy(() => import('./pages/SupportDeclarationPage'));
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage')); 
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));

// Loader פשוט ויפה שיוצג בזמן שקוד העמוד יורד
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
  </div>
);

/**
 * קומפוננטה להגנה על נתיבים פרטיים.
 * אם המשתמש לא מחובר, היא מפעילה את תהליך הלוגין.
 */
const ProtectedRoute = ({ children }) => {
  const { user, isLoadingAuth, navigateToLogin } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    navigateToLogin();
    return null;
  }

  return children;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  // מסך טעינה ראשוני של הגדרות המערכת
  if (isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // טיפול בשגיאת רישום (משתמש שהתחבר עם גוגל אבל לא קיים בטבלת המטפלים)
  if (authError && authError.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    // ה-Suspense דואג להציג את ה-PageLoader בזמן שה-lazy מחכה לקובץ שיירד
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          {/* --- נתיבים ציבוריים (זמינים לכולם) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/therapists" element={<TherapistSearch />} />
          <Route path="/therapist/:id" element={<TherapistProfile />} />
          <Route path="/quiz" element={<MatchQuizPage />} />
          <Route path="/register-therapist" element={<RegisterTherapist />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/support-declaration" element={<SupportDeclarationPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />

          {/* --- נתיבים מוגנים (דורשים התחברות) --- */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/therapist-portal/*" 
            element={<ProtectedRoute><TherapistPortal /></ProtectedRoute>} 
          />
          
          {/* דף 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <HelmetProvider>
    <AuthProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
            <CookieConsent />
          </Router>
          
          {/* הנה שני ה-Toasters שלנו יושבים יחד בשלום! */}
          <ShadcnToaster />
          <SonnerToaster position="bottom-right" richColors />
          
        </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
    </HelmetProvider>
    
  )
}

export default App;