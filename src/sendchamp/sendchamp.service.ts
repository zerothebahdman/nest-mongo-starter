import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { SendChampConstructor } from 'index';
import VERIFICATION from './otp';
import SMS from './sms';
import { baseUrl } from './endpoints';

@Injectable()
export class SendchampService {
  private axiosInstance: AxiosInstance;
  public SMS: SMS = new SMS();
  public VERIFICATION: VERIFICATION = new VERIFICATION();

  constructor(config: SendChampConstructor) {
    const { publicKey, mode } = config;
    this.axiosInstance = axios.create({
      baseURL: baseUrl[mode || 'LIVE'],
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${publicKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Initialize axios instance of subclasses
    SMS.axiosInstance = this.axiosInstance;
    VERIFICATION.axiosInstance = this.axiosInstance;
  }
}
