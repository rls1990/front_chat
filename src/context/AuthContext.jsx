/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { login, refreshAT, register, verify } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    verifyTokens();
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    let idint = 0;
    // Verificar tokens antes que se cumplan los 5 minutos.
    if (isAuthenticated) {
      idint = setInterval(() => {
        verifyTokens();
      }, 1000 * 50 * 5);
    }

    return () => {
      console.log("stop interval");
      clearInterval(idint); // Limpia el intervalo cuando el componente se desmonte
    };
  }, [isAuthenticated]);

  const signin = async (user) => {
    try {
      console.log(user);
      const res = await login(user);
      console.log(res);
      if (res && res.data) {
        setIsAuthenticated(true);
        setUser(res.data.user);

        Cookies.set("aToken", res.data.accessToken, {
          secure: true,
          expires: new Date(Date.now() + 5 * 60 * 1000), //dura 5m
          sameSite: "none",
        });

        Cookies.set("rToken", res.data.refreshToken, {
          secure: true,
          expires: 1, //dura 1 día
          sameSite: "none",
        });
      }
    } catch (error) {
      //console.log(error.response.data.message);
      if (error.response.data.message) setErrors([error.response.data.message]);
    }
  };

  const logout = () => {
    Cookies.remove("aToken");
    Cookies.remove("rToken");
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

  const verifyTokens = () => {
    const cookies = Cookies.get();
    if (!cookies.rToken) {
      //Si no hay token de actualización, cierro la sesión
      logout();
    } else if (cookies.rToken && !cookies.aToken) {
      //Si existe el token de acctualización pero no existe el token de acceso se genera un nuevo token de acceso, si da error cierro sesión
      generateAT();
    } else {
      //Si existe el token de actualización y el token de acceso verifico el token de acceso, si da error cierro sesión
      verifyAT();
    }
  };

  const verifyAT = async () => {
    const res = await verify().catch((err) => {
      console.log(err);
      logout();
      return;
    });

    if (res && res.data) {
      setIsAuthenticated(true);
      setLoading(false);
      setUser(res.data.user);
      console.log("Token de acceso verificado.");
    }
  };

  const generateAT = async () => {
    const res = await refreshAT().catch((err) => {
      console.log(err);
      logout();
      return;
    });

    if (res && res.data) {
      Cookies.set("aToken", res.data.accessToken, {
        secure: true,
        expires: new Date(Date.now() + 5 * 60 * 1000), //5m
        sameSite: "none",
      });

      setIsAuthenticated(true);
      setLoading(false);
      setUser(res.data.user);
    }
  };

  const signup = async (data) => {
    try {
      data.roll = "user";
      const res = await register(data);

      console.log(res);
      if (res.data) {
        setIsAuthenticated(true);
        setUser(res.data.user);

        Cookies.set("aToken", res.data.accessToken, {
          secure: true,
          expires: new Date(Date.now() + 5 * 60 * 1000), //dura 5m
          sameSite: "none",
        });

        Cookies.set("rToken", res.data.refreshToken, {
          secure: true,
          expires: 1, //dura 1 día
          sameSite: "none",
        });
      }
    } catch (error) {
      if (error.response.data.message) setErrors([error.response.data.message]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signin,
        logout,
        signup,
        loading,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
