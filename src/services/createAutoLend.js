import autoLendModels from '../database/models/autoLend.models.js';
import fundingModels from '../database/models/funding.models.js';
import loansModels from '../database/models/loans.models.js';
import { formatToJakartaTime, getCurrentJakartaTime } from '../utils/index.js';

// check cancel time every one day at 00:00 with setInterval
// if cancel time is passed, then cancel the loan
// setInterval(async () => {
//     const lend = await autoLendModels.find();
//     const expiredAutoLend = await autoLendModels.distinct('_id', {
//         cancelTime: {
//             $gte: getCurrentJakartaTime().toISOString(),
//         },
//     });
//     console.log(`lend ${getCurrentJakartaTime()}`, lend);
//     console.log('expiredAutoLend', expiredAutoLend);

//     // if (expiredAutoLend.length > 0) {
//     //     await autoLendModels.deleteMany({
//     //         _id: {
//     //             $in: expiredAutoLend,
//     //         },
//     //     });
//     // }
// }, 5000); // every 5 second ms = 86400000

export default async (payload) => {
    try {
        const {
            tenorLength,
            borrowingCategory, // array of borrowing category e.g ['personal', 'business']
            yieldRange, // kisaran imbal hasil. e.g ['50000','100000']
            amountToLend, // jumlah yang akan dipinjamkan. e.g '100000'
            cancelTime,
        } = payload;

        // const adad = ['personal', 'business']; // OK BISA

        const matchQuery = {
            interestRate: {
                $gte: yieldRange.start,
                $lte: yieldRange.end,
            },
            tenor: {
                $gte: parseInt(tenorLength.start),
                $lte: parseInt(tenorLength.end),
            },
            borrowingCategory: {
                $in: borrowingCategory,
            },
        };

        // matchQuery['interestRate'] = {
        //     $gte: yieldRangeStart,
        //     $lte: yieldRangeEnd,
        // };

        // if (tenor) {
        //     matchQuery['tenor'] = {
        //         $gte: tenorLengthStart,
        //         $lte: tenorLengthEnd,
        //     };
        // }
        // matchQuery['borrowingCategory'] = {
        //     $in: borrowingCategory,
        // };

        // matchQuery['status'] = {
        //     $and: ['repayment', 'late repayment'],
        // };

        console.log('matchQuery', matchQuery);

        const loans = await loansModels
            .aggregate([
                {
                    $match: {
                        $and: [matchQuery],
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'borrower',
                    },
                },
                {
                    $lookup: {
                        from: 'fundings',
                        localField: '_id',
                        foreignField: 'loanId',
                        pipeline: [{ $project: { amount: 1 } }],
                        as: 'funding',
                    },
                },
                {
                    // check if available loan amount to fund is greater than amount to lend
                    $match: {
                        $expr: {
                            $let: {
                                vars: {
                                    availableToFund: {
                                        // $sum: '$funding.amount',
                                        $subtract: [
                                            {
                                                $toInt: '$amount',
                                            },
                                            {
                                                $toInt: {
                                                    $sum: '$funding.amount',
                                                },
                                            },
                                        ],
                                    },
                                },
                                in: {
                                    $gte: [
                                        '$$availableToFund',
                                        parseInt(amountToLend),
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    // remove array from result only return object
                    $unwind: '$borrower',
                },
                {
                    $project: {
                        modifyDate: 0,
                        borrowerId: 0,
                        __v: 0,
                        'borrower._id': 0,
                        'borrower.password': 0,
                        'borrower.salt': 0,
                        'borrower.idCardNumber': 0,
                        'borrower.birthDate': 0,
                        'borrower.idCardImage': 0,
                        'borrower.createdDate': 0,
                        'borrower.modifyDate': 0,
                        'borrower.__v': 0,
                    },
                },
            ])
            .exec();

        // if auto lend not match with any loans then save to auto_lend table
        // if (loans.length === 0) {
        //     const autoLend = await autoLendModels.create({
        //         userId,
        //         tenorLength,
        //         borrowingCategory,
        //         yieldRange,
        //         amountToLend,
        //         formatToJakartaTime(cancelTime),
        //     });
        //     console.log('autoLend', autoLend);
        //     return autoLend;
        // }
        // // if auto lend match with loans then fund the loans
        // const yieldRate =
        //     loans[0].interestRate * (parseInt(amountToLend) / loans[0].amount);

        // const funding = await fundingModels.create({
        //     userId,
        //     loansId: loans[0]._id,
        //     amount: amountToLend,
        //     yield: yieldRate,
        // });

        console.log('loans', JSON.stringify(loans, null, 2));
    } catch (error) {
        throw error;
    }
};
