import redis from 'redis-promisify';

const redisClient = () => {
    try {
        const client = redis.createClient();

        client.on('error', (error) => {
            console.error(`Redis error: ${error}`);
            return new Error(error);
            // Handle the error as appropriate for your application
        });
        return client;
    } catch (error) {
        console.log('ERROR REDIS', error);
        throw error;
    }
};

export const isCached = async (cacheKey) => {
    console.log('cacheKey', cacheKey);
    const cachedItems = await redisClient().getAsync(cacheKey);
    if (cachedItems) return await JSON.parse(cachedItems);
    return false;
};

// isCached('userloan:');

export const setCache = (cacheKey, data) => {
    try {
        // 1 hour in seconds = 3600
        redisClient().setexAsync(cacheKey, 3600 * 24, JSON.stringify(data)); // in seconds
        // return true;
    } catch (error) {
        throw error;
    }
};

export const deleteCache = (isBatch, keyPattern) => {
    try {
        if (!isBatch) {
            redisClient().del(keyPattern);
            return;
        }
        // delete matching keys with pattern
        redisClient().keys(keyPattern, (err, key) => {
            if (key.length === 0) return;
            console.log('key', key);
            redisClient().del(key);
        });
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
