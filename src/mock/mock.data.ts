import { State } from '../common/interface';
import { Role } from '../common/interface';

export enum MODULE {
  CUSTOMER = 'CUSTOMER',
  DESIGNER = 'DESIGNER',
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
    FIND_ALL: {
      ARGS: {
        skip: 0,
        take: 2,
      },
      RESULT: [
        {
          CustomerID: '64be92970c4d228143dafab0',
          CustomerEmail: 'Kemi@gmail.com',
          CustomerAddress: null,
          CreatedAt: '2023-07-24T15:02:47.498Z',
          UpdatedAt: '2023-07-24T15:02:47.498Z',
          CustomerPhoneNumbers: [],
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
      Roles: [Role.DESIGNER, Role.USER],
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    },
  },
  [MODULE.DESIGNER]: {
    CREATE_DESIGNER: {
      DesignerName: 'The Comet',
      DesignerPhoneNumbers: ['+2347023232334'],
      Role: Role.DESIGNER,
      DesignerAddress: {
        StreetNo: 41,
        StreetName: 'Jibowu Estate',
        City: 'Abule-Egba',
        State: State.Lagos,
      },
    },
    FIND_ONE: {
      DesignerName: 'The Comet',
      DesignerPhoneNumbers: ['+2347023232334'],
      DesignerAddress: {
        StreetNo: 41,
        StreetName: 'Jibowu Estate',
        City: 'Abule-Egba',
        State: State.Lagos,
      },
    },
    REMOVE_MESSAGE: 'Designer archived.',
    ERROR_MESSAGE: 'User`s already a designer',
  },
  ARGS: {
    skip: 0,
    take: 2,
  },
};

export const MockData = {
  SERVICES,
};
