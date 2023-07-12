import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  SendOtpConfig,
  SendOtpResponse,
  VerifyOtpConfig,
  VerifyOtpResponse,
} from '../../index.d';
import endpoints from './endpoints';

export default class VERIFICATION {
  static axiosInstance: AxiosInstance;

  sendOTP = async (config: SendOtpConfig): Promise<SendOtpResponse> => {
    try {
      const response: AxiosResponse<unknown> = await VERIFICATION.axiosInstance(
        {
          url: endpoints.SEND_VERIFICATION_OTP,
          method: 'POST',
          data: config,
        },
      );

      return response.data as SendOtpResponse;
    } catch (error) {
      const { response } = error as AxiosError;
      return response?.data as SendOtpResponse;
    }
  };

  verifyOTP = async (config: VerifyOtpConfig): Promise<VerifyOtpResponse> => {
    try {
      const response: AxiosResponse<unknown> = await VERIFICATION.axiosInstance(
        {
          url: endpoints.VERIFY_VERIFICATION_OTP,
          method: 'POST',
          data: config,
        },
      );

      return response.data as VerifyOtpResponse;
    } catch (error) {
      const { response } = error as AxiosError;
      return response?.data as VerifyOtpResponse;
    }
  };
}
