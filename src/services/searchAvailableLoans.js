import loansModels from '../database/models/loans.models.js';
import LoanRepository from '../database/repository/loans.repo.js';

export default async (page, limit, sort, order, q, cacheKey) => {
    const cachedItems = await isCached(cacheKey);
    if (cachedItems) {
        console.log('MASUK KE CACHE');
        return {
            loans: cachedItems.loans,
            page,
            limit,
            totalItems: cachedItems.totalItems,
            sort,
            order,
            query: q,
        };
    }
    const querySearch = { purpose: { $regex: q, $options: 'i' } };
    const loanRepository = new LoanRepository();
    const [loans, totalItems] = await Promise.all([
        loanRepository.lookupFind(
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
                    $or: [{ status: 'on request' }, { status: 'on process' }],
                },
                { ...querySearch },
            ],
        }),
    ]);

    console.log('MASUK DB');
    // setCache(cacheKey, { loans, totalItems });

    return {
        loans,
        page,
        limit,
        totalItems,
        sort,
        order,
        query: q,
    };
};
