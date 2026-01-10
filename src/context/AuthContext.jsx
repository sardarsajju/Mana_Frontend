import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const org_id = localStorage.getItem("org_id");

    if (user_id && role) {
      setUser({
        user_id,
        role,
        name,
        org_id
      });
    }
  }, []);

  // Login using backend response
  const login = (data) => {
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);

    if (data.org_id) {
      localStorage.setItem("org_id", data.org_id);
    }

    setUser({
      user_id: data.user_id,
      role: data.role,
      name: data.name,
      org_id: data.org_id
    });
    console.log("User logged",data.org_id);
    
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