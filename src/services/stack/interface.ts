export type StackMetadata = {
  email: string;
  amount: string; // In Kobo
  ref: string; // Other ID,
  channels?: [Channels];
  currency: Currency;
  key?: string;
  bank?: {
    code: string;
    account_number: string;
  };
  label?: string;
  onClose?: () => unknown;
  onBankTransferConfirmationPending?: () => unknown;
};

export enum Currency {
  NGN = 'NGN',
  GHS = 'GHS',
  ZAR = 'ZAR',
  USD = 'USD',
}

export enum Channels {
  card = 'card',
  bank = 'bank',
  ussd = 'ussd',
  qr = 'qr',
  mobile_money = 'mobile_money',
  bank_transfer = 'bank_transfer',
}

export enum StackActions {
  TRANSACTION = 'transaction',
  VERIFY = 'verify',
  CHARGE = 'charge',
  BANK = 'bank',
}

export const country = {
  NGN: 'nigeria',
  GHS: 'ghana',
};
