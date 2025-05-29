"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface User {
  name: string;
  email: string;
  pro: boolean;
  id: string;
}

interface UserContextType {
  user: User | null;
  updateUser: (newUser: User) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUser(null);
      }
    }
  }, []);

  // Update user in localStorage and state
  const updateUser = useCallback((newUser: User) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  // Clear user from localStorage and state
  const clearUser = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
