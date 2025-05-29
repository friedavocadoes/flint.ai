import { useState, useEffect, useCallback } from "react";

interface User {
  name: string;
  email: string;
  pro: boolean;
  _id: string;
}

export function useUser() {
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
    // Optionally, you can dispatch a custom event here if needed
  }, []);

  // Clear user from localStorage and state
  const clearUser = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return { user, updateUser, clearUser };
}