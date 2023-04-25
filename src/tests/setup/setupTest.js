// import { jest } from '@jest/globals';
// import { when } from 'jest-when';
import loansModels from '../../database/models/loans.models.js';
import db from './db.js';
import loansSeed from './seeds/loans.seed.js';
import usersSeed from './seeds/users.seed.js';

// import UsersModel from '../database/models/users.js';
// import AuthService from '../services/auth.js';
// import * as Utils from '../utils/mail/index.js';

const loanMockData = [
    {
        _id: {
            $oid: '6445ffa60cfd73ccc903960c',
        },
        userId: {
            $oid: '6445fd1319df4e1b0146d8b8',
        },
        borrowerId: {
            $oid: '6445fd282b6e235e87b2a080',
        },
        loanPurpose: 'Lahiran',
        amount: '8500000',
        tenor: 3,
        interestRate: '250000',
        status: 'on request',
        createdDate: {
            $date: {
                $numberLong: '1682309030199',
            },
        },
        modifyDate: {
            $date: {
                $numberLong: '1682309030199',
            },
        },
        __v: 0,
    },
];

const userMockData = [
    {
        _id: {
            $oid: '6445fd1319df4e1b0146d8b8',
        },
        name: 'isco',
        email: 'isco@yopmail.com',
        phoneNumber: 6285333602646,
        password:
            'bzAhkoUoDtenJPqph0tpPw==.dnbYyJOFNBtHYDQDYqJwW8zv1NY1gqCYog3lx4S5E56wgIIlH6YrQwNgJjuWEYozVQUWKJ8oC3eZTlJrxTSC2A==',
        salt: 'bzAhkoUoDtenJPqph0tpPw==',
        verified: true,
        roles: 'borrower',
        birthDate: 'false',
        idCardNumber: 0,
        idCardImage: 'false',
        faceImage: 'false',
        createdDate: {
            $date: {
                $numberLong: '1682308371168',
            },
        },
        modifyDate: {
            $date: {
                $numberLong: '1682308391600',
            },
        },
        __v: 0,
    },
];

// beforeAll(async () => {
//     // jest.spyOn(UsersModel, 'findById').mockReturnValue(
//     //     Promise.resolve({
//     //         _id: '63edc92b7926224a7188b4ac',
//     //         name: 'Eden Hazard',
//     //         email: 'eden@gmail.com',
//     //         password: '133',
//     //         salt: 'kfaj73ejfe',
//     //         verified: true,
//     //         roles: 'lender',
//     //     }).then(() => ({ exec: jest.spyOn(UsersModel, 'exec') })),
//     // );
//     // UsersModel.findById = jest.fn().mockImplementation(() => ({
//     //     exec: jest
//     //         .fn()
//     //         .mockResolvedValue([
//     //             { _id: '63edc92b7926224a7188b4ac' },
//     //             { _id: '63edc92b7926224a7188b4aa' },
//     //         ]),
//     // }));
//     // const findByIdMock = jest.spyOn(UsersModel, 'findById');
//     // const results = resultData;
//     // const usersRes = jest.fn((ya) => {
//     //     console.log('YAA', ya);
//     // });
//     // const AccountFindResult = {
//     //     exec: usersRes,
//     // };
//     // const AccountFind = jest.fn(() => AccountFindResult);
//     // findByIdMock.mockImplementation(AccountFind);
// });

beforeAll(async () => {
    // Utils.sendMailOTP = jest.fn().mockResolvedValue({
    //     otp: '23456',
    //     otpExpired: '2020-10-10',
    // });
    // jest.setTimeout(60000);
    await db.connect();
    const DB = await db.getDB();
    await DB.collection('users').insertMany(usersSeed);
    await DB.collection('loans').insertMany(loansSeed);
    // const loanss = await DB.collection('users').find({}).toArray();
    // console.log('DB', loanss);
    // console.log('DB', await DB.collection('users').find({}).toArray());
});

beforeEach(async () => {
    // const auth = new AuthService();
    // await Promise.all(resultData.map((item) => auth.createAccount(item)));
    // await UsersModel.findOneAndUpdate(
    //     { email: resultData[1].email },
    //     { verified: true },
    // );
});

afterEach(async () => {
    // await db.clear();
});

afterAll(async () => {
    await db.clear();
    await db.close();
});
