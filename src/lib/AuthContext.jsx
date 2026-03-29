import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(false);
      setAppPublicSettings(null);
      setAuthError(null);
      await checkUserAuth();
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const {
        data: { user: currentUser },
        error
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      setUser(currentUser ?? null);
      setIsAuthenticated(Boolean(currentUser));
      setIsLoadingAuth(false);
    } catch (error) {
      // הנה התיקון: מדפיסים את השגיאה רק אם זו לא שגיאת האורח הרגילה!
      if (error?.message !== 'Auth session missing!') {
        console.error('User auth check failed:', error);
      }
      
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthError({
        type: 'auth_required',
        message: 'Authentication required'
      });
    }
  };

  const logout = async (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }

    if (shouldRedirect && window.location.pathname !== '/') {
      window.location.href = '/';
    }
  };

  // הוספנו פה משתנה שמקבל נתיב, עם ברירת מחדל של הפורטל
  const navigateToLogin = async () => {
    // בודקים באיזה עמוד אנחנו נמצאים עכשיו
    let targetPath = window.location.pathname;
    
    // אם המשתמש לחץ על התחברות מדף הבית הרגיל, נשלח אותו לפורטל
    if (targetPath === '/') {
      targetPath = '/therapist-portal';
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // מחזירים את המשתמש בדיוק לעמוד שהוא ניסה לגשת אליו!
        redirectTo: `${window.location.origin}${targetPath}`
      }
    });

    if (error) {
      console.error('Google OAuth login failed:', error);
      setAuthError({
        type: 'auth_required',
        message: error.message || 'Authentication required'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};