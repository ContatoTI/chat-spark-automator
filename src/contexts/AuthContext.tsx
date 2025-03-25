
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getUserPermissions, getUserProfile, UserPermissions, UserProfile } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  permissions: UserPermissions | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        if (session?.user) {
          setUser(session.user);
          await refreshUserData();
        } else {
          setUser(null);
          setProfile(null);
          setPermissions(null);
        }
        setIsLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        refreshUserData().finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserData = async () => {
    if (!user) return;

    try {
      const [profileData, permissionsData] = await Promise.all([
        getUserProfile(user.id),
        getUserPermissions(user.id)
      ]);

      setProfile(profileData);
      setPermissions(permissionsData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados do usuário",
        description: "Tente novamente ou contate o suporte."
      });
      console.error("Error fetching user data:", error);
    }
  };

  const signOutHandler = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setPermissions(null);
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso."
    });
  };

  const isAdmin = profile?.role === "admin";

  const value = {
    user,
    profile,
    permissions,
    isLoading,
    isAdmin,
    signOut: signOutHandler,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
