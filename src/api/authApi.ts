import axiosInstance from "./axiosInstance";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axiosInstance.post("/register", data);
  return res.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axiosInstance.post("/login", data);
  
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/logout");
  return res.data;
};

export const updateUserInfo = async (data: {
  name?: string;
  email?: string;
  password?: string;
}) => {
  const res = await axiosInstance.put("/user/update", data);
  return res.data;
};