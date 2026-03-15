import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "@/types";
import { mockUsers } from "@/data/mock";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("marketplace_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Mock: find user by email, accept any password
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem("marketplace_user", JSON.stringify(found));
      return true;
    }
    return false;
  }, []);

  const register = useCallback(
    async (name: string, email: string, _password: string): Promise<boolean> => {
      // Mock: check for duplicate email, create new user
      const exists = mockUsers.find((u) => u.email === email);
      if (exists) return false;

      const newUser: User = {
        id: Date.now(),
        name,
        email,
        role: "USER",
        createdAt: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem("marketplace_user", JSON.stringify(newUser));
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("marketplace_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
