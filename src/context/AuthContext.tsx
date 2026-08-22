import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import type { 
  User, 
  DemoPersona, 
  LoginCredentials, 
  SignupPayload, 
  TravelPreferences 
} from '@/types/user.types';
import { useToast } from '@/context/ToastContext';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  demoPersonas: DemoPersona[];
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (payload: SignupPayload) => Promise<User>;
  logout: () => Promise<void>;
  switchDemoPersona: (personaId: string) => Promise<User>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  updatePreferences: (newPrefs: Partial<TravelPreferences>) => Promise<User>;
  toggleSavedDestination: (cityName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, info } = useToast();

  const demoPersonas = authService.getDemoPersonas();

  // Load active session on initial mount
  useEffect(() => {
    let isMounted = true;
    const initializeAuth = async () => {
      try {
        const activeUser = await authService.getCurrentUser();
        if (isMounted) setUser(activeUser);
      } catch (err) {
        console.error('Failed to initialize session:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(credentials);
      setUser(loggedUser);
      success(`Welcome back, ${loggedUser.name}!`, 'Your travel itineraries are synchronized.');
      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  }, [success]);

  const signup = useCallback(async (payload: SignupPayload) => {
    setIsLoading(true);
    try {
      const newUser = await authService.signup(payload);
      setUser(newUser);
      success(`Account created!`, `Welcome to GlobeTrotter, ${newUser.name}!`);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  }, [success]);

  const switchDemoPersona = useCallback(async (personaId: string) => {
    setIsLoading(true);
    try {
      const switchedUser = await authService.loginAsDemoUser(personaId);
      setUser(switchedUser);
      info(`Switched Persona`, `Logged in as ${switchedUser.name} (${switchedUser.preferences.budgetStyle} style)`);
      return switchedUser;
    } finally {
      setIsLoading(false);
    }
  }, [info]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    success('Profile Updated', 'Your profile details have been saved.');
    return updated;
  }, [success]);

  const updatePreferences = useCallback(async (newPrefs: Partial<TravelPreferences>) => {
    const updated = await authService.updatePreferences(newPrefs);
    setUser(updated);
    success('Preferences Saved', 'Your travel preferences are updated.');
    return updated;
  }, [success]);

  const toggleSavedDestination = useCallback(async (cityName: string) => {
    const updated = await authService.toggleSavedDestination(cityName);
    setUser(updated);
    const isSaved = updated.savedDestinations.includes(cityName);
    info(
      isSaved ? 'Destination Saved' : 'Removed from Saved',
      isSaved ? `${cityName} added to your wishlist.` : `${cityName} removed from your wishlist.`
    );
  }, [info]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      info('Signed Out', 'You have been logged out of GlobeTrotter.');
    } finally {
      setIsLoading(false);
    }
  }, [info]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        demoPersonas,
        login,
        signup,
        logout,
        switchDemoPersona,
        updateProfile,
        updatePreferences,
        toggleSavedDestination,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
