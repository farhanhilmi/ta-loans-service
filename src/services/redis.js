// import mongoose from 'mongoose';
// import redis from 'redis';
// import util from 'util';

// const redisUrl = 'redis://127.0.0.1:6379';
// const client = redis.createClient(redisUrl);
// client.hGet = util.promisify(client.hGet);
// const exec = mongoose.Query.prototype.exec;

// mongoose.Query.prototype.cache = function (options = {}) {
//     this.enableCache = true;
//     this.hashKey = JSON.stringify(options.key || 'default');

//     return this;
// };

// mongoose.Query.prototype.exec = async function () {
//     // if cache is not enabled, return the original exec function
//     if (!this.enableCache) {
//         console.log('Data Source: Database');
//         return exec.apply(this, arguments);
//     }

//     const key = JSON.stringify(
//         Object.assign({}, this.getQuery(), {
//             collection: this.mongooseCollection.name,
//         }),
//     );

//     const cachedValue = await client.hGet(this.hashKey, key);

//     // if there is a cached value, return it
//     if (cachedValue) {
//         const parsedCache = JSON.parse(cachedValue);

//         console.log('Data Source: Cache');

//         return Array.isArray(parsedCache)
//             ? parsedCache.map((doc) => new this.model(doc))
//             : new this.model(parsedCache);
//     }

//     // if there is no cached value, return the original exec function from mongoose
//     const result = await exec.apply(this, arguments);

//     client.hSet(this.hashKey, key, JSON.stringify(result), 'EX', 300);

//     console.log('Data Source: Database');
//     return result;
// };

// export const clearCache = (hashKey) => {
//     console.log('Cache cleaned');
//     client.del(JSON.stringify(hashKey));
// };
