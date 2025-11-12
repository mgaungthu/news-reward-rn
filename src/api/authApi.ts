import axiosInstance from "./axiosInstance";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  referral_code?: string;
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

export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/me");
  return res.data;
};


export const deleteUser = async () => {
  const res = await axiosInstance.delete("/user/delete");
  return res.data;
};

export const changePassword = async (data: {
  email: string;
  new_password: string;
}) => {
  const res = await axiosInstance.post("/user/change-password", data);
  console.log(res.data)
  return res.data;
};
