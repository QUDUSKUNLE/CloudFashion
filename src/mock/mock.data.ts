import { State } from '../common/interface';

export enum MODULE {
  CUSTOMER = 'CUSTOMER',
}

export const SERVICES = {
  [MODULE.CUSTOMER]: {
    CREATE_CUSTOMER: {
      CreateCustomers: [
        {
          CustomerName: 'CUSTOMER',
          CustomerEmail: 'customer@gmail.com',
          CustomerPhoneNumbers: [''],
          CustomerAddress: {
            StreetNo: 41,
            StreetName: 'Jibowu Estate',
            City: 'Abule-Egba',
            State: State.Lagos,
          },
        },
      ],
    },
    CreateEmpty: {
      CreateCustomers: [],
    },
    ERROR_MESSAGE: 'Customer Name can not be empty',
  },
};

export const MockData = {
  SERVICES,
};
