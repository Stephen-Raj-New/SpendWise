import Client from "../../../api/index";

export const loginService = async (data: { email: string; password: string }) => {
  try {
    const response = await Client.auth.login(data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message || 'Login failed' };
  }
};
