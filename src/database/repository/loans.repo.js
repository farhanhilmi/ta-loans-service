import loansModels from '../models/loans.models.js';

export default class LoanRepository {
    constructor() {
        this.model = loansModels;
    }

    // function kajaj() {

    // }

    async filterAvailableLoans(
        matchQuery,
        excludeUserFields = [],
        page = 1,
        limit = 10,
        sort = 'createdDate',
        order = 'desc',
    ) {
        try {
            let fields = {
                modifyDate: 0,
                borrowerId: 0,
                __v: 0,
                'borrower._id': 0,
                'borrower.__v': 0,
                funding: 0,
            };
            for (let i = 0; i < excludeUserFields.length; i++) {
                fields[`borrower.${excludeUserFields[i]}`] = 0;
            }
            // console.log('fields', fields);
            const sortOrder = order === 'asc' ? 1 : -1;
            return await this.model
                .aggregate([
                    {
                        $match: {
                            $or: matchQuery,
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
                            as: 'funding',
                        },
                    },
                    {
                        $addFields: {
                            // subtract amount loan with amount funding
                            totalFunding: {
                                // check if funding is empty array, return 0, else return total funding
                                $cond: {
                                    if: { $eq: ['$funding', []] },
                                    then: 0,
                                    else: {
                                        $toInt: {
                                            $sum: '$funding.amount',
                                        },
                                        // $subtract: [
                                        //     {
                                        //         $toInt: '$amount',
                                        //     },
                                        //     {
                                        //         $toInt: {
                                        //             $sum: '$funding.amount',
                                        //         },
                                        //     },
                                        // ],
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
                        $project: fields,
                        // $project: {
                        //     modifyDate: 0,
                        //     borrowerId: 0,
                        //     __v: 0,
                        //     'user._id': 0,
                        //     'user.password': 0,
                        //     'user.salt': 0,
                        //     'user.idCardNumber': 0,
                        //     'user.birthDate': 0,
                        //     'user.idCardImage': 0,
                        //     'user.createdDate': 0,
                        //     'user.modifyDate': 0,
                        //     'user.__v': 0,
                        // },
                    },
                    {
                        $sort: { [sort]: sortOrder },
                    },
                    {
                        $skip: limit * page - limit,
                    },
                    {
                        $limit: limit,
                    },
                ])
                .exec();
        } catch (error) {
            throw error;
        }
    }

    async lookupFind(
        query,
        page = 1,
        limit = 10,
        sort = 'createdDate',
        order = 'desc',
    ) {
        try {
            const statusMatchQuery = [
                { status: 'on request' },
                { status: 'on process' },
            ];
            const sortOrder = order === 'asc' ? 1 : -1;
            return await this.model
                .aggregate([
                    {
                        $match: {
                            $and: [{ $or: statusMatchQuery }, { ...query }],
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
                            as: 'funding',
                        },
                    },
                    {
                        $addFields: {
                            // subtract amount loan with amount funding
                            totalFunding: {
                                // check if funding is empty array, return 0, else return total funding
                                $cond: {
                                    if: { $eq: ['$funding', []] },
                                    then: 0,
                                    else: {
                                        $toInt: {
                                            $sum: '$funding.amount',
                                        },
                                        // $subtract: [
                                        //     {
                                        //         $toInt: '$amount',
                                        //     },
                                        //     {
                                        //         $toInt: {
                                        //             $sum: '$funding.amount',
                                        //         },
                                        //     },
                                        // ],
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
                            funding: 0,
                            'borrower._id': 0,
                            'borrower.__v': 0,
                            'borrower.password': 0,
                            'borrower.salt': 0,
                            'borrower.idCardNumber': 0,
                            'borrower.birthDate': 0,
                            'borrower.idCardImage': 0,
                            'borrower.createdDate': 0,
                            'borrower.modifyDate': 0,
                            'borrower.verified': 0,
                            'borrower.roles': 0,
                        },
                    },
                    {
                        $sort: { [sort]: sortOrder },
                    },
                    {
                        $skip: limit * page - limit,
                    },
                    {
                        $limit: limit,
                    },
                ])
                .exec();
        } catch (error) {
            throw error;
        }
    }
}
