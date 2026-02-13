import { ReactNode, useState, useEffect } from "react";

import { apiClient } from "@src/utils/apiClient";
import { APIEndpoint } from "@src/types/APIEndpoint";

import { AuthContext } from "@src/hooks/useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await apiClient.post<null>(APIEndpoint.OAUTH2_CHECK);
      if (response.status === 204) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await apiClient.post(APIEndpoint.USER_LOGOUT);
    } finally {
      setIsLoggedIn(false);
      sessionStorage.removeItem("redirectUrl");
    }
  };

  const withdraw = async () => {
    try {
      await apiClient.delete(APIEndpoint.USER_WITHDRAW);
    } finally {
      setIsLoggedIn(false);
      sessionStorage.removeItem("redirectUrl");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, withdraw }}>
      {children}
    </AuthContext.Provider>
  );
};
