import loansModels from '../database/models/loans.models.js';
import { isCached, setCache } from '../utils/redis.js';
import { formatDataPagination } from '../utils/responses.js';

export default async (payload) => {
    try {
        let { page, limit, sort, order } = payload;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        sort = sort || 'createdDate';
        order = order || 'asc';
        // const limit = 10;
        // const page = 1;
        const cacheKey = `availableLoans-${page}-${limit}`;

        const cachedItems = await isCached(cacheKey);
        if (cachedItems) {
            console.log('MASUK KE CACHE');
            return formatDataPagination(
                cachedItems,
                page,
                limit,
                cachedItems.totalItems,
                sort,
                order,
            );
        }
        const [loans, totalItems] = await Promise.all([
            loansModels
                .find({
                    $or: [{ status: 'on request' }, { status: 'on process' }],
                })
                .select({ __v: 0, borrowerId: 0 })
                .sort({ [sort]: order })
                .skip(limit * page - limit)
                .limit(limit),
            loansModels.countDocuments({
                $or: [{ status: 'on request' }, { status: 'on process' }],
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
        );
    } catch (error) {
        throw error;
    }
};
