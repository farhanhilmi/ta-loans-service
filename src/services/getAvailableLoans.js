import loansModels from '../database/models/loans.models.js';
import LoanRepository from '../database/repository/loans.repo.js';
import { isCached, setCache } from '../utils/redis.js';

export default async (page, limit, sort, order, cacheKey) => {
    console.log('page', page);
    const cachedItems = await isCached(cacheKey);
    if (cachedItems) {
        console.log('MASUK KE CACHE');
        return {
            data: cachedItems.loans,
            page,
            limit,
            totalItems: cachedItems.totalItems,
            sort,
            order,
        };
    }

    const statusMatchQuery = [
        { status: 'on request' },
        { status: 'on process' },
    ];
    const loanRepository = new LoanRepository();
    const [loans, totalItems] = await Promise.all([
        loanRepository.filterAvailableLoans(
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
    // console.log('loans', loans);

    console.log('MASUK DB');
    setCache(cacheKey, { loans, totalItems });

    return {
        loans,
        page,
        limit,
        totalItems,
        sort,
        order,
    };
};
