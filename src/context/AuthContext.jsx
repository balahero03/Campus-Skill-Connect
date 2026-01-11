// AuthContext - Stable version to prevent flickering
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let mounted = true;

        // 1. Try to load from localStorage first (Instant load)
        const cachedProfile = localStorage.getItem('userProfile');
        if (cachedProfile) {
            try {
                setUserProfile(JSON.parse(cachedProfile));
            } catch (e) {
                console.error('Error parsing cached profile', e);
                localStorage.removeItem('userProfile');
            }
        }

        const initAuth = async () => {
            try {
                // Get initial session
                const { session } = await auth.getSession();

                if (mounted) {
                    if (session?.user) {
                        console.log('Initial session found:', session.user.email);
                        setUser(session.user);
                        setIsAuthenticated(true);

                        // 2. Fetch fresh profile from DB (Non-blocking if cached)
                        if (!cachedProfile) {
                            const profile = await loadUserProfile(session.user.id);
                            if (!profile) await ensureUserProfile(session.user);
                        } else {
                            // Background refresh
                            loadUserProfile(session.user.id).then(p => {
                                if (!p && mounted) ensureUserProfile(session.user);
                            });
                        }
                    } else {
                        console.log('No initial session');
                        setUser(null);
                        setIsAuthenticated(false);
                        localStorage.removeItem('userProfile');
                    }
                }
            } catch (error) {
                console.error('Auth init error:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        // Safety Timeout: Force stop loading after 3 seconds
        const timer = setTimeout(() => {
            if (mounted && loading) {
                console.warn('Auth loading timed out - forcing render');
                setLoading(false);
            }
        }, 3000);

        // Listen for auth changes
        const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            console.log('Auth state change:', event);

            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);

                if (event === 'SIGNED_IN') {
                    await ensureUserProfile(session.user);
                }
            } else {
                setUser(null);
                setUserProfile(null);
                localStorage.removeItem('userProfile');
                setIsAuthenticated(false);
            }

            setLoading(false);
        });

        return () => {
            mounted = false;
            clearTimeout(timer);
            subscription.unsubscribe();
        };
    }, []);

    const loadUserProfile = async (userId) => {
        try {
            const { data } = await db.users.getById(userId);
            if (data) {
                setUserProfile(data);
                // Cache it
                localStorage.setItem('userProfile', JSON.stringify(data));
                return data;
            }
            return null;
        } catch (error) {
            console.error('Error loading profile:', error);
            return null;
        }
    };

    const ensureUserProfile = async (authUser) => {
        try {
            const { data: existing } = await db.users.getById(authUser.id);

            if (!existing) {
                const newProfile = {
                    id: authUser.id,
                    email: authUser.email,
                    name: authUser.user_metadata?.full_name ||
                        authUser.user_metadata?.name ||
                        authUser.email.split('@')[0],
                    avatar_url: authUser.user_metadata?.avatar_url ||
                        authUser.user_metadata?.picture || null,
                    department: null,
                    year: null,
                    bio: null,
                    phone: null,
                };

                const { data } = await db.users.upsert(newProfile);
                const finalProfile = data || newProfile;
                setUserProfile(finalProfile);
                localStorage.setItem('userProfile', JSON.stringify(finalProfile));
            } else {
                setUserProfile(existing);
                localStorage.setItem('userProfile', JSON.stringify(existing));
            }
        } catch (error) {
            console.error('Error ensuring profile:', error);
        }
    };

    const login = async () => {
        const { error } = await auth.signInWithGoogle();
        return { error };
    };

    const logout = async () => {
        try {
            // Clear localStorage first
            localStorage.removeItem('userProfile');

            // Sign out from Supabase
            const { error } = await auth.signOut();

            if (error) {
                console.error('Logout error:', error);
                // Still clear local state even if signOut fails
            }

            // Clear all state
            setUser(null);
            setUserProfile(null);
            setIsAuthenticated(false);

            return { error };
        } catch (error) {
            console.error('Logout exception:', error);
            // Force clear state on error
            setUser(null);
            setUserProfile(null);
            setIsAuthenticated(false);
            localStorage.removeItem('userProfile');
            return { error };
        }
    };

    const updateProfile = async (updates) => {
        if (!user) {
            console.error('updateProfile: No user logged in');
            return { error: new Error('No user') };
        }

        console.log('updateProfile: Attempting to update', updates);

        try {
            const { data, error } = await db.users.upsert({
                id: user.id,
                email: user.email,
                ...updates,
            });

            if (error) {
                console.error('updateProfile: Supabase error', error);
                alert(`Error saving profile: ${error.message}`);
            } else {
                console.log('updateProfile: Success', data);
                if (data) {
                    setUserProfile(data);
                    localStorage.setItem('userProfile', JSON.stringify(data));
                }
            }
            return { data, error };
        } catch (error) {
            console.error('updateProfile: Catch error', error);
            return { error };
        }
    };

    const value = {
        user,
        userProfile,
        isAuthenticated,
        loading,
        login,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
