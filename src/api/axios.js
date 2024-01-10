import axios from "axios";
//import Cookies from "js-cookie";

export const baseURLAPI = "http://localhost:3000/api";

const instance = axios.create({
  baseURL: baseURLAPI,
  withCredentials: true,
  // headers: {
  //   Authorization: `${Cookies.get("token")}`,
  // },
});

export default instance;
