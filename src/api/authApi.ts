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
    const server = error.response?.data;
    console.log("registerUser Error:", server || error.message);

    // Return validation errors (e.g., email already exists)
    if (server?.errors) {
      return {
        status: false,
        errors: server.errors,
        message: server.message || "Validation error",
      };
    }

    // General API error
    return {
      status: false,
      message: server?.message || "Request failed",
    };
  }
};

export const loginUser = async (data: {
  email: string;
  password: string;
  device_id:string;
}) => {
  try {
    const res = await axiosInstance.post("/login", data);
    return res.data;
  } catch (error: any) {

    throw new Error(error?.message || "Request failed");
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

export const verifyEmail = async (data: {
  email: string;
  code: string;
}) => {
  try {
    const res = await axiosInstance.post("/verify-email", data);
    return res.data;
  } catch (error: any) {
    console.log("verifyEmail Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};

export const resendOtp = async (data: { email: string }) => {
  try {
    const res = await axiosInstance.post("/resend-otp", data);
    return res.data;
  } catch (error: any) {
    console.log("resendOtp Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const res = await axiosInstance.post("/forgot-password", data);
    return res.data;
  } catch (error: any) {
    const server = error.response?.data;
    console.log("forgotPassword Error:", server || error.message);

    // Return backend validation errors
    if (server?.errors) {
      return {
        status: false,
        errors: server.errors,
        message: server.message || "Validation error",
      };
    }

    // Return general error
    return {
      status: false,
      message: server?.message || "Request failed",
    };
  }
};

export const verifyResetOtp = async (data: { email: string; code: string }) => {
  try {
    const res = await axiosInstance.post("/verify-reset-otp", data);
    return res.data;
  } catch (error: any) {
    console.log("verifyResetOtp Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};

export const resetPassword = async (data: { email: string; code: string; new_password: string }) => {
  try {
    const res = await axiosInstance.post("/reset-password", data);
    return res.data;
  } catch (error: any) {
    console.log("resetPassword Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
};
