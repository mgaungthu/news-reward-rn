import axiosInstance from "./axiosInstance";

// Fetch all posts
export const getPosts = async () => {
  try {
    const response = await axiosInstance.get("/posts");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    throw error;
  }
};

// Fetch a single post by ID or slug
export const getPostById = async (id: number | string) => {
  try {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  } catch (error: any) {
    console.log(error, "w");
    throw error;
  }
};

// Claim post reward
export const claimPostReward = async (postId: number | string) => {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/claim`);

    return response.data;
  } catch (error: any) {
    console.log(error);
    console.error("Error claiming post reward:", error.message);
    throw error;
  }
};

// Fetch VIP posts
export const getVipPosts = async () => {
  try {
    const response = await axiosInstance.get("/vip-posts");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching VIP posts:", error.message);
    throw error;
  }
};

// Buy VIP post
export const buyVipPost = async (postId: number | string) => {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/buy`);
    return response.data;
  } catch (error: any) {
    console.error("Error buying VIP post:", error.message);
    throw error;
  }
};

export const getUserVipPosts = async () => {
  try {
    const response = await axiosInstance.get("/user/vip-posts");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user's VIP posts:", error.message);
    throw error;
  }
};

// Reset user's post claims and points
export const resetUserClaims = async () => {
  try {
    const response = await axiosInstance.post("/user/reset-claims");
    return response.data;
  } catch (error: any) {
    console.error("Error resetting user claims:", error.message);
    throw error;
  }
};

// Save push token
export const savePushToken = async (pushToken : string) => {
  try {
    const response = await axiosInstance.post("/save-push-token", {
      expo_push_token: pushToken,
    });
    return response.data;
  } catch (error: any) {
    console.log(error)
    console.error("Error saving push token:", error.message);
    throw error;
  }
};
