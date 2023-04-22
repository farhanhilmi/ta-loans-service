import { ValidationError } from '../utils/errorHandler.js';
import loansModels from '../database/models/loans.models.js';

export default async (userId, idCard) => {
    try {
        // const DATATA = {
        //     status: 'OK',
        //     message: 'No loans found',
        // };
        // let { isCached, data } = await cachedData('userloan:' + userId, DATATA);
        // if (isCached) {
        //     console.log('MASUK KE CACHE');
        //     return data;
        // }
        // console.log('MASUK KE DB');
        // return DATATA;

        // const redisClient = redis.createClient();
        // // await redisClient.connect();
        // if (!userId) {
        //     throw new ValidationError('User Id is required!');
        // }
        // const cacheKey = `user:${userId}`;
        // // Try to retrieve the cached data first
        // let cachedItems = await redisClient.getAsync(cacheKey);
        // if (cachedItems) {
        //     console.log('MASUK KE CACHE');
        //     // Use the cached items if they exist
        //     const items = JSON.parse(cachedItems);
        //     return { message: items.message, status: items.status };
        //     // return res.render('items', { items });
        // }

        // console.log('MASUK KE DB');
        // const DATATA = {
        //     status: 'OK',
        //     message: 'No loans found',
        // };
        // // Retrieve the items from Redis if they are not cached
        // // Cache the retrieved items for future requests
        // redisClient.setexAsync(cacheKey, 3600, JSON.stringify(DATATA));

        // Render the retrieved items in a template
        // return { message: DATATA.message, status: DATATA.status };

        // const cachedItems = await isCached('userloan:' + userId);
        // if (cachedItems) {
        //     console.log('MASUK KE CACHE');
        //     return cachedItems;
        // }

        const loans = await loansModels.find({ userId: userId });
        console.log('loans', loans);

        if (loans.length < 1)
            return { status: 'OK', message: 'No loans found' };

        let status = '';
        for (let i = 0; i < loans.length; i++) {
            if (
                loans[i].status === 'on request' ||
                loans[i].status === 'in borrowing' ||
                loans[i].status === 'unpaid' ||
                loans[i].status === 'on process'
            ) {
                status = loans[i].status;
                break;
            } else {
                status = 'OK';
            }
        }
        const result = { status, message: '' };
        // setCache('userloan:' + userId, result);
        return result;
    } catch (error) {
        console.log('error at service', error);
        throw error; // INI BETUL
    }
};
