import { State } from '../common/interface';
import { Role } from '../common/interface';

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
    UNAUTHORIZED_MESSAGE: 'Unauthorized to perform this operation',
  },
  USER: {
    UserID: '1',
    Email: 'qud@gmail.com',
    Password: '',
    Roles: [Role.DESIGNER],
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  },
};

export const MockData = {
  SERVICES,
};
