import axios from "axios";

export default function axiosInstance() {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",

    withCredentials: true,

    headers: {
      "Content-Type": "application/json",
    },
  });
  return axiosInstance;
}
export const api = axiosInstance();
