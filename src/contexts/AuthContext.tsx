/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
  
export type AuthUser = { 
  id?: string; 
  name?: string; 
  email?: string; 
  role?: "patient" | "nutritionist"; 
} | null; 
  
type AuthContextValue = { 
  user: AuthUser; 
  token: string | null; 
  isAuthenticated: boolean; 
  signIn: (params: { token: string; user: NonNullable<AuthUser> }) => void; 
  signOut: () => void; 
}; 
  
const AuthContext = createContext<AuthContextValue | undefined>(undefined); 
  
type AuthProviderProps = { 
  children: ReactNode; 
}; 
  
export const AuthProvider = ({ children }: AuthProviderProps) => { 
  const [user, setUser] = useState<AuthUser>(() => {
    const storedUser = window.localStorage.getItem("vitacare:user");
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
  }); 
  const [token, setToken] = useState<string | null>(() => window.localStorage.getItem("vitacare:token")); 
  
  const signIn = ({ token: nextToken, user: nextUser }: { token: string; user: 
NonNullable<AuthUser> }) => { 
    setToken(nextToken); 
    setUser(nextUser); 
  }; 
  
  const signOut = () => { 
    setToken(null); 
    setUser(null); 
  }; 

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("vitacare:token", token);
    } else {
      window.localStorage.removeItem("vitacare:token");
    }

    if (user) {
      window.localStorage.setItem("vitacare:user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("vitacare:user");
    }
  }, [token, user]);
  
  const value = useMemo( 
    () => ({ 
      user, 
      token, 
      isAuthenticated: Boolean(token), 
      signIn, 
      signOut, 
    }), 
    [user, token], 
  ); 
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; 
}; 
  
export const useAuth = () => { 
  const context = useContext(AuthContext); 
  if (!context) { 
    throw new Error("useAuth deve ser usado dentro de AuthProvider."); 
  } 
  return context; 
};