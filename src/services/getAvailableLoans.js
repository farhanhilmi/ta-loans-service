import loansModels from '../database/models/loans.models.js';
import LoanRepository from '../database/repository/loans.repo.js';
import { isCached, setCache } from '../utils/redis.js';
import { formatDataPagination } from '../utils/responses.js';

export default async (payload) => {
    try {
        let { page, limit, sort, order, q } = payload;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        sort = sort || 'createdDate';
        order = order || 'asc';
        q = q?.trim();

        const loansRepo = new LoanRepository();

        let cacheKey = `availableLoans-${page}-${limit}-${sort}-${order}`;

        if (q) {
            cacheKey += `-${q.replace(/\s/g, '')}`;
            const cachedItems = await isCached(cacheKey);
            if (cachedItems) {
                console.log('MASUK KE CACHE');
                return formatDataPagination(
                    cachedItems.loans,
                    page,
                    limit,
                    cachedItems.totalItems,
                    sort,
                    order,
                );
            }
            const querySearch = { loanPurpose: { $regex: q, $options: 'i' } };
            const [loans, totalItems] = await Promise.all([
                loansRepo.lookupFind(
                    querySearch,
                    // { loanPurpose: q },
                    page,
                    limit,
                    sort,
                    order,
                ),
                loansModels.countDocuments({
                    $and: [
                        {
                            $or: [
                                { status: 'on request' },
                                { status: 'on process' },
                            ],
                        },
                        { ...querySearch },
                    ],
                }),
            ]);

            console.log('MASUK DB');
            setCache(cacheKey, { loans, totalItems });

            return formatDataPagination(
                loans,
                page,
                limit,
                totalItems,
                sort,
                order,
                q,
            );
        }
        // const limit = 10;
        // const page = 1;

        const cachedItems = await isCached(cacheKey);
        if (cachedItems) {
            console.log('MASUK KE CACHE');
            return formatDataPagination(
                cachedItems.loans,
                page,
                limit,
                cachedItems.totalItems,
                sort,
                order,
            );
        }
        // usersModels
        // const [loans, totalItems] = await Promise.all([
        //     loansModels
        //         .find({
        //             $or: [{ status: 'on request' }, { status: 'on process' }],
        //         })
        //         .populate('user')
        //         .select({ __v: 0, modifyDate: 0, status: 0, borrowerId: 0 })
        //         .sort({ [sort]: order })
        //         .skip(limit * page - limit)
        //         .limit(limit),
        //     loansModels.countDocuments({
        //         $or: [{ status: 'on request' }, { status: 'on process' }],
        //     }),
        // ]);
        const statusMatchQuery = [
            { status: 'on request' },
            { status: 'on process' },
        ];
        const [loans, totalItems] = await Promise.all([
            loansRepo.filterAvailableLoans(
                statusMatchQuery,
                [
                    'password',
                    'salt',
                    'birthDate',
                    'idCardNumber',
                    'idCardImage',
                    'createdDate',
                    'modifyDate',
                    'verified',
                    'roles',
                ],
                page,
                limit,
                sort,
                order,
            ),
            loansModels.countDocuments({
                $or: [{ status: 'on request' }, { status: 'on process' }],
            }),
        ]);
        console.log('loans', loans);

        console.log('MASUK DB');
        setCache(cacheKey, { loans, totalItems });

        return formatDataPagination(
            loans,
            page,
            limit,
            totalItems,
            sort,
            order,
        );
    } catch (error) {
        throw error;
    }
};
