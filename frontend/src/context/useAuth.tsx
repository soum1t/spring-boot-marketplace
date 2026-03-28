import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

type UserProfile = {
  name: string;
  email: string;
};

type UserContextType = {
  user: UserProfile | null;
  registerUser: (email: string, name: string, password: string) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  const registerUser = (email: string, name: string, password: string) => {};
  const loginUser = (email: string, password: string) => {};
  const logout = () => {};
  const isLoggedIn = () => !!user;

  useEffect(() => {
    const someMethod = async () => {
      try {
        const response = await axios.get("/user/me");
        setUser(response.data);
      } catch (error) {}
      setIsReady(true);
    };

    someMethod();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        registerUser,
        loginUser,
        logout,
        isLoggedIn,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
