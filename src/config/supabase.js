// Supabase Configuration - Hardcoded Credentials
import { createClient } from '@supabase/supabase-js';

// Supabase project credentials - Direct configuration
const supabaseUrl = 'https://hwgwbnfxxgzoikxntyes.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z3dibmZ4eGd6b2lreG50eWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjQ3NTcsImV4cCI6MjA4MTYwMDc1N30.uv2-A5g5uXYCaHYtwBqkmIhYxEAm6kq-5gFN5iZI2Q0';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configuration is always true now
export const supabaseConfigured = true;

// Helper functions for authentication
export const auth = {
    // Google Sign In
    signInWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });
        return { data, error };
    },

    // Sign Out
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Get Current User
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    // Get Session
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        return { session, error };
    },

    // Listen to auth state changes
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback);
    },
};

// Database helper functions
export const db = {
    // Users
    users: {
        getById: async (id) => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();
            return { data, error };
        },

        upsert: async (user) => {
            const { data, error } = await supabase
                .from('users')
                .upsert(user)
                .select()
                .single();
            return { data, error };
        },
    },

    // Skills
    skills: {
        getAll: async () => {
            const { data, error } = await supabase
                .from('skills')
                .select(`
          *,
          provider:users(id, name, department, email)
        `)
                .order('created_at', { ascending: false });
            return { data, error };
        },

        getById: async (id) => {
            const { data, error } = await supabase
                .from('skills')
                .select(`
          *,
          provider:users(id, name, department, email, avatar_url),
          reviews(*, reviewer:users(name, avatar_url))
        `)
                .eq('id', id)
                .single();
            return { data, error };
        },

        create: async (skill) => {
            const { data, error } = await supabase
                .from('skills')
                .insert(skill)
                .select()
                .single();
            return { data, error };
        },

        update: async (id, updates) => {
            const { data, error } = await supabase
                .from('skills')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            return { data, error };
        },

        delete: async (id) => {
            const { error } = await supabase
                .from('skills')
                .delete()
                .eq('id', id);
            return { error };
        },

        search: async (query, category = null) => {
            let queryBuilder = supabase
                .from('skills')
                .select(`
          *,
          provider:users(id, name, department)
        `);

            if (query) {
                queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
            }

            if (category && category !== 'All') {
                queryBuilder = queryBuilder.eq('category', category);
            }

            const { data, error } = await queryBuilder.order('created_at', { ascending: false });
            return { data, error };
        },
    },

    // Reviews
    reviews: {
        create: async (review) => {
            const { data, error } = await supabase
                .from('reviews')
                .insert(review)
                .select()
                .single();
            return { data, error };
        },

        getBySkillId: async (skillId) => {
            const { data, error } = await supabase
                .from('reviews')
                .select(`
          *,
          reviewer:users(name, avatar_url)
        `)
                .eq('skill_id', skillId)
                .order('created_at', { ascending: false });
            return { data, error };
        },
    },

    // Chats
    chats: {
        getByUserId: async (userId) => {
            const { data, error } = await supabase
                .from('chats')
                .select(`
          *,
          user1:users!user1_id(id, name, avatar_url),
          user2:users!user2_id(id, name, avatar_url),
          messages(*)
        `)
                .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
                .order('updated_at', { ascending: false });
            return { data, error };
        },

        create: async (chat) => {
            const { data, error } = await supabase
                .from('chats')
                .insert(chat)
                .select()
                .single();
            return { data, error };
        },

        update: async (id, updates) => {
            const { data, error } = await supabase
                .from('chats')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            return { data, error };
        },
    },

    // Messages
    messages: {
        getByChatId: async (chatId) => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', chatId)
                .order('created_at', { ascending: true });
            return { data, error };
        },

        send: async (message) => {
            const { data, error } = await supabase
                .from('messages')
                .insert(message)
                .select()
                .single();
            return { data, error };
        },

        subscribe: (chatId, callback) => {
            return supabase
                .channel(`messages:${chatId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                        filter: `chat_id=eq.${chatId}`,
                    },
                    callback
                )
                .subscribe();
        },
    },
};
