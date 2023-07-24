import { State } from '../common/interface';
import { Role } from '../common/interface';

export enum MODULE {
  CUSTOMER = 'CUSTOMER',
  USER = 'USER',
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
    UNAUTHORIZED_MESSAGE: 'Unauthorized to perform this operation',
  },
  [MODULE.USER]: {
    CREATE_USER: {
      Email: 'qud@gmail.com',
      Password: 'boluwatife@mail.com',
      ConfirmPassword: 'boluwatife@mail.com',
      PhoneNumbers: ['+234701187334'],
    },
    CREATE_LESS_PASSWORD: {
      Email: 'qud@gmail.com',
      Password: 'boluw',
      ConfirmPassword: 'boluwatife@mail.com',
      PhoneNumbers: ['+234701187334'],
    },
    CREATE_LESS_PASSWORD_ERROR:
      'Password length should be at least 8 characters.',
    USER: {
      UserID: '1',
      Email: 'qud@gmail.com',
      Password: 'boluwatife@mail.com',
      Roles: [Role.DESIGNER],
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    },
  },
};

export const MockData = {
  SERVICES,
};
