import mongoose from 'mongoose';

const objectId = mongoose.Types.ObjectId;

export default [
    {
        _id: '6445ffa60cfd73ccc903960c',
        userId: new objectId('6445fd1319df4e1b0146d8b8'),
        borrowerId: new objectId('6445fd282b6e235e87b2a080'),
        loanPurpose: 'Lahiran',
        amount: '8500000',
        tenor: 3,
        interestRate: '250000',
        status: 'on request',
        createdDate: '1682309030199',
        modifyDate: '1682309030199',
        __v: 0,
    },
];
