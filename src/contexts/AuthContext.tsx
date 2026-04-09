import { createContext, useContext, type ReactNode } from "react";

type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
} | null;

type AuthContextValue = {
  user: AuthUser;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
});

type AuthProviderProps = {
  children: ReactNode;
  value?: AuthContextValue;
};

export const AuthProvider = ({
  children,
  value = { user: null },
}: AuthProviderProps) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
