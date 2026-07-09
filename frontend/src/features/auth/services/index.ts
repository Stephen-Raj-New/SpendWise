import Client from "../../../api/index";

export const loginService = async (data: { email: string; password: string }) => {
  try {
    const response = await Client.auth.login(data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message || 'Login failed' };
  }
};
export const registerService = async (data: any) => {
  try {
    const response = await Client.auth.register(data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message || 'Registration failed' };
  }
};

export const verifyOtpService = async (data: { email: string; otp: string }) => {
  try {
    const response = await Client.auth.verifyOtp(data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message || 'OTP verification failed' };
  }
};
