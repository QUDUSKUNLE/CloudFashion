import { State } from '../common/interface';
import { Role } from '../common/interface';

export enum MODULE {
  CUSTOMER = 'CUSTOMER',
  DESIGNER = 'DESIGNER',
  USER = 'USER',
  PRODUCT = 'PRODUCT',
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
        Skip: 0,
        Take: 2,
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
    FIND_ALL: [
      {
        DesignerName: 'The Comet',
        DesignerPhoneNumbers: ['+2347023232334'],
        DesignerAddress: {
          StreetNo: 41,
          StreetName: 'Jibowu Estate',
          City: 'Abule-Egba',
          State: State.Lagos,
        },
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
    REMOVE_MESSAGE: 'Designer archived.',
    ERROR_MESSAGE: 'User`s already a designer',
  },
  [MODULE.PRODUCT]: {
    FindAll: {
      Skip: 2,
      Take: 5,
    },
    FindAllMockResponse: [
      {
        ProductID: '64c2d0a7f04e125b10071272',
        ProductName: 'Kaftan',
        ProductVideo:
          'https://res.cloudinary.com/halalmeat/video/upload/v1690489007/dpnvbfs8urpfkazaabnw.mp4',
        CreatedAt: '2023-07-27T20:16:39.176Z',
        UpdatedAt: '2023-07-27T20:16:50.557Z',
      },
      {
        ProductID: '64c2d3100971510d557f35bd',
        ProductName: 'Kaftan',
        ProductVideo:
          'https://res.cloudinary.com/halalmeat/video/upload/v1690489624/k6k1qwjoo3poq0kfyqbg.mp4',
        CreatedAt: '2023-07-27T20:26:55.455Z',
        UpdatedAt: '2023-07-27T20:27:06.975Z',
      },
    ],
  },
  ARGS: {
    Skip: 0,
    Take: 2,
  },
};

export const MockData = {
  SERVICES,
};
