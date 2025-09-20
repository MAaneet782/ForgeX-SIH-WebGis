import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, Session, User, SupabaseClient } from '@supabase/supabase-js'; // Import createClient and SupabaseClient type

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  supabase: SupabaseClient; // Add session-aware supabase client to context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create a local, session-aware Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided in .env file");
  }

  // Initialize a client that will be updated with the session
  const [sessionSupabase, setSessionSupabase] = useState<SupabaseClient>(
    createClient(supabaseUrl, supabaseAnonKey)
  );

  useEffect(() => {
    const { data: { subscription } } = sessionSupabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      // Re-create or update the session-aware client
      if (currentSession) {
        setSessionSupabase(createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${currentSession.access_token}`,
            },
          },
          auth: {
            persistSession: true, // Ensure session persists
          }
        }));
      } else {
        // If no session, revert to an unauthenticated client
        setSessionSupabase(createClient(supabaseUrl, supabaseAnonKey));
      }
    });

    // Fetch initial session
    sessionSupabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
      if (initialSession) {
        setSessionSupabase(createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${initialSession.access_token}`,
            },
          },
          auth: {
            persistSession: true,
          }
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseUrl, supabaseAnonKey]); // Depend on URL/Key to re-create client if they change (unlikely but good practice)

  const signOut = async () => {
    await sessionSupabase.auth.signOut();
  };

  const value = {
    session,
    user,
    signOut,
    supabase: sessionSupabase, // Provide the session-aware client
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};