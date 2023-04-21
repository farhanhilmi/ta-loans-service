import redis from 'redis-promisify';

const redisClient = redis.createClient();

export const isCached = async (cacheKey) => {
    const cachedItems = await redisClient.getAsync(cacheKey);
    if (cachedItems) return await JSON.parse(cachedItems);
    return false;
};

export const setCache = (cacheKey, data) => {
    try {
        redisClient.setexAsync(cacheKey, 600, JSON.stringify(data)); // in seconds / expired in 10 menit
        // return true;
    } catch (error) {
        throw error;
    }
};

/**
 *
 * @param {*} cacheKey
 * @param {*} data
 * @returns {Object[Boolean]} true if data is cached, false if data is not cached
 * @returns {Object[Data/Null]} cached data if data is cached, null if data is not cached
 */
export const cachedData = async (cacheKey, data) => {
    let cachedItems = await redisClient.getAsync(cacheKey);

    if (cachedItems) {
        return { isCached: true, data: await JSON.parse(cachedItems) };
        // return items;
    }
    // 10 minute in seconds = 600
    // 1 hour in seconds = 3600

    redisClient.setexAsync(cacheKey, 600, JSON.stringify(data)); // in seconds / expired in 1 hour
    return { isCached: false, data: null };
};
