import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on refresh
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (user_id && role) {
      setUser({
        user_id,
        role,
        name,
      });
    }
  }, []);

  // Login using backend response
  const login = (data) => {
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);

    setUser({
      user_id: data.user_id,
      role: data.role,
      name: data.name,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;