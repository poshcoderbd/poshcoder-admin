import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('poshcoder_admin'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('poshcoder_admin', token);
    } else {
      localStorage.removeItem('poshcoder_admin');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
