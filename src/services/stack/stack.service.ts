import { Axios, AxiosResponse } from 'axios';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StackActions, StackMetadata } from './interface';

@Injectable()
export class StackService {
  private Paystack: Axios;
  private configService: ConfigService = new ConfigService();
  private readonly secretToken =
    this.configService.get<string>('IS_LIVE') === 'true'
      ? this.configService.get<string>('PAYSTACK_SECRET_KEY')
      : this.configService.get<string>('PAYSTACK_SECRET_KEY_TEST');
  constructor() {
    this.Paystack = new Axios({
      baseURL: this.configService.get<string>('PAYSTACK_URL'),
      headers: {
        Authorization: `${this.configService.get<string>(
          'AUTHORIZATION_TYPE',
        )} ${this.secretToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  makeCharge = async (stack: StackMetadata) => {
    try {
      const { email, amount, channels, ref, currency, bank } = stack;
      if (bank) {
        const response: AxiosResponse = await this.Paystack.post(
          `${StackActions.CHARGE}`,
          JSON.stringify({
            email,
            amount,
            ref,
            bank,
            channels,
            currency,
          }),
        );
        if (response.status === 400 && typeof response.data === 'string') {
          throw new BadRequestException(`${JSON.parse(response.data).message}`);
        }
        return response;
      }
      throw new UnprocessableEntityException();
    } catch (error) {
      throw error;
    }
  };

  bankLists = async (country: string) => {
    return await this.Paystack.get(
      `${StackActions.BANK}?country=${country}&perPage=100&pay_with_bank=true`,
    );
  };
}
