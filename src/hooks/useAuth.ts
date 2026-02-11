import { useContext, createContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => Promise<void>;
  withdraw: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
