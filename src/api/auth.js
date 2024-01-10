import axios from "./axios";
import Cookies from "js-cookie";

export const login = (data) => axios.post("/login", data);

export const logout = () => axios.post("/logout");

export const getUsers = () =>
  axios.get("/users", {
    headers: {
      Authorization: `Bearer ${Cookies.get("aToken")}`,
    },
  });

export const verify = () =>
  axios.get("/verify", {
    headers: {
      Authorization: `Bearer ${Cookies.get("aToken")}`,
    },
  });

export const refreshAT = () =>
  //Refrescar Token de acceso
  axios.get("/refresh", {
    headers: {
      Authorization: `Token ${Cookies.get("rToken")}`,
    },
  });

export const register = (data) => axios.post("/register", data);
