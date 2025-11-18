import axiosInstance from "./axiosInstance";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  referral_code?: string;
}) => {
  try {
    const res = await axiosInstance.post("/register", data);
    return res.data;
  } catch (error: any) {
    console.log("registerUser Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axiosInstance.post("/login", data);
    return res.data;
  } catch (error: any) {
    console.log("loginUser Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};

export const logoutUser = async () => {
  try {
    const res = await axiosInstance.post("/logout");
    return res.data;
  } catch (error: any) {
    console.log("logoutUser Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};

export const updateUserInfo = async (data: {
  name?: string;
  email?: string;
  password?: string;
}) => {
  try {
    const res = await axiosInstance.put("/user/update", data);
    return res.data;
  } catch (error: any) {
    console.log("updateUserInfo Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await axiosInstance.get("/me");
    return res.data;
  } catch (error: any) {
    console.log("getCurrentUser Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};


export const deleteUser = async () => {
  try {
    const res = await axiosInstance.delete("/user/delete");
    return res.data;
  } catch (error: any) {
    console.log("deleteUser Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};

export const changePassword = async (data: {
  email: string;
  new_password: string;
}) => {
  try {
    const res = await axiosInstance.post("/user/change-password", data);
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    console.log("changePassword Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};


export const validateIAP = async (data: {
  productId: string;
  platform: "ios" | "android";
  receipt: string;
}) => {
  try {
    const res = await axiosInstance.post("/iap/validate", data);
    return res.data;
  } catch (error: any) {
    console.log("validateIAP Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};