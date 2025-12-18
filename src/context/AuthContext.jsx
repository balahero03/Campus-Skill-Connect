// AuthContext - Real Supabase Authentication with Auto-Redirect
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
        // Check active sessions and set the user
        checkSession();

        // Listen for auth changes (handles OAuth callback)
        const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);

            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);

                // Create or update user profile in database
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    await ensureUserProfile(session.user);
                }

                await loadUserProfile(session.user.id);
            } else {
                setUser(null);
                setUserProfile(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkSession = async () => {
        const { session } = await auth.getSession();
        if (session?.user) {
            setUser(session.user);
            setIsAuthenticated(true);
            await ensureUserProfile(session.user);
            await loadUserProfile(session.user.id);
        }
        setLoading(false);
    };

    const loadUserProfile = async (userId) => {
        const { data, error } = await db.users.getById(userId);
        if (data) {
            setUserProfile(data);
            console.log('Loaded user profile:', data);
        } else if (error) {
            console.error('Error loading user profile:', error);
        }
    };

    const ensureUserProfile = async (authUser) => {
        try {
            const { data: existing } = await db.users.getById(authUser.id);

            if (!existing) {
                // Extract name from email or metadata
                const emailName = authUser.email.split('@')[0];
                const displayName = authUser.user_metadata?.full_name ||
                    authUser.user_metadata?.name ||
                    emailName;

                // Create new user profile
                const newProfile = {
                    id: authUser.id,
                    email: authUser.email,
                    name: displayName,
                    avatar_url: authUser.user_metadata?.avatar_url ||
                        authUser.user_metadata?.picture || null,
                    department: null,
                    year: null,
                    bio: null,
                    phone: null,
                };

                console.log('Creating user profile:', newProfile);
                const { data, error } = await db.users.upsert(newProfile);

                if (error) {
                    console.error('Error creating user profile:', error);
                } else {
                    setUserProfile(data);
                    console.log('User profile created successfully:', data);
                }
            } else {
                setUserProfile(existing);
                console.log('User profile already exists:', existing);
            }
        } catch (error) {
            console.error('Error in ensureUserProfile:', error);
        }
    };

    const login = async () => {
        const { error } = await auth.signInWithGoogle();
        if (error) {
            console.error('Login error:', error);
            return { error };
        }
        // OAuth will redirect automatically to /dashboard
        return { error: null };
    };

    const logout = async () => {
        const { error } = await auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            return { error };
        }
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        return { error: null };
    };

    const updateProfile = async (updates) => {
        if (!user) return { error: new Error('No user logged in') };

        const { data, error } = await db.users.upsert({
            id: user.id,
            ...updates,
        });

        if (data) {
            setUserProfile(data);
        }

        return { data, error };
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
