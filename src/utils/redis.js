import redis from 'redis-promisify';

let client;

function redisClient() {
    if (client && client.connected) {
        // If the client is already connected, return the existing client
        return client;
    } else {
        // Create a new Redis client
        client = redis.createClient();

        // Event listener for Redis connection errors
        client.on('error', function (error) {
            console.error('Redis connection error:', error.message);
        });

        // Event listener for Redis reconnection
        client.on('ready', function () {
            console.log('Redis reconnected');
        });

        return client;
    }
}

// const redisClient = () => {
//     try {
//         // const client = redis.createClient({
//         //     retry_strategy: (options) => {
//         //         if (options.attempt > 5) {
//         //             // End reconnecting after a specific number of attempts
//         //             // return new Error('Redis server maximum attempts reached');
//         //             console.log(
//         //                 'redis retry connection attempts:',
//         //                 options.attempt,
//         //             );
//         //             // console.log('Redis server maximum attempts reached');
//         //             // client.quit();
//         //         }

//         //         return Math.min(options.attempt * 2000, 10000);
//         //     },
//         // });

//         const client = redis.createClient();

//         client.on('error', (error) => {
//             console.error(`Redis not connected: ${error}`);
//             return { error: true, client };
//             // return new Error(error);
//             // Handle the error as appropriate for your application
//         });
//         return { error: true, client };

//         // if (redis.connected) {
//         //     console.log('Redis connected');
//         //     return { error: false, client };
//         // } else {
//         //     return { error: true, client };
//         // }
//         // return client;
//     } catch (error) {
//         console.log('ERROR REDIS', error);
//         throw error;
//     }
// };

export const isCached = async (cacheKey) => {
    // const { error, client } = redisClient();
    // if (!error) {
    //     console.log('cacheKey', cacheKey);
    //     if (cachedItems) return await JSON.parse(cachedItems);
    // }
    const redisClientInstance = redisClient();

    // Check if the key exists
    redisClientInstance.exists(cacheKey, async function (error, response) {
        if (error) {
            console.error('Redis key availability check failed:', error);
        } else {
            if (response === 1) {
                const cachedItems = await redisClientInstance.getAsync(
                    cacheKey,
                );
                if (cachedItems) return await JSON.parse(cachedItems);
            } else {
                console.log('[redis] Key does not exist');
                return false;
            }
        }
    });

    return false;
};

// isCached('userloan:');

export const setCache = (cacheKey, data) => {
    try {
        const redisClientInstance = redisClient();

        // Perform the set operation
        redisClientInstance.set(
            cacheKey,
            JSON.stringify(data),
            'EX',
            3600,
            function (error) {
                if (error) {
                    console.error('Redis set operation failed:', error);
                    // Close the Redis connection
                    redisClientInstance.quit();
                    // Handle the error and retry the operation
                    handleRedisError(cacheKey, JSON.stringify(data));
                } else {
                    console.log('[redis] Data cached successfully');
                    // Close the Redis connection
                    redisClientInstance.quit();
                }
            },
        );
    } catch (error) {
        throw error;
    }
};

// Function to handle Redis errors and reconnect
function handleRedisError(key, data) {
    // Implement your retry logic here
    // Example: Retry after 5 seconds
    setTimeout(function () {
        console.log('Retrying Redis set operation');
        cacheData(key, data);
    }, 5000);
}

export const deleteCache = (isBatch, keyPattern) => {
    try {
        const { error, client } = redisClient();
        if (error) return;
        if (!isBatch) {
            client.del(keyPattern);
            return;
        }
        // delete matching keys with pattern
        client.keys(keyPattern, (err, key) => {
            if (key.length === 0) return;
            console.log('key', key);
            client.del(key);
        });
    } catch (error) {
        throw error;
    }
};

// /**
//  *
//  * @param {*} cacheKey
//  * @param {*} data
//  * @returns {Object[Boolean]} true if data is cached, false if data is not cached
//  * @returns {Object[Data/Null]} cached data if data is cached, null if data is not cached
//  */
// export const cachedData = async (cacheKey, data) => {
//     let cachedItems = await redisClient.getAsync(cacheKey);

//     if (cachedItems) {
//         return { isCached: true, data: await JSON.parse(cachedItems) };
//         // return items;
//     }
//     // 10 minute in seconds = 600
//     // 1 hour in seconds = 3600

//     redisClient.setexAsync(cacheKey, 600, JSON.stringify(data)); // in seconds / expired in 1 hour
//     return { isCached: false, data: null };
// };
