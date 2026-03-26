import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import TherapistSearch from './pages/TherapistSearch';
import TherapistProfile from './pages/TherapistProfile';
import MatchQuizPage from './pages/MatchQuizPage';
import RegisterTherapist from './pages/RegisterTherapist';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import AdminDashboard from './pages/AdminDashboard';
import TherapistPortal from './pages/TherapistPortal';
import HowItWorksPage from './pages/HowItWorksPage';
import ArticlesPage from './pages/ArticlesPage';
import SupportDeclarationPage from './pages/SupportDeclarationPage';
import AccessibilityPage from './pages/AccessibilityPage'; // וודא שהנתיב מדויק אצלך
import ArticleDetailPage from './pages/ArticleDetailPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import CookieConsent from './components/CookieConsent';

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
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
            <CookieConsent />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App;