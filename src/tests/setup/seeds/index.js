import { readdir } from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

async function seedDatabase() {
    const dir = await readdir(__dirname);
    const seedFiles = dir.filter((f) => f.endsWith('.seed.js'));

    // eslint-disable-next-line no-restricted-syntax
    for (const file of seedFiles) {
        const fileName = file.split('.seed.js')[0];
        const modelName = toTitleCase(fileName);
        const model = mongoose.models[modelName];

        if (!model) throw new Error(`Cannot find Model '${modelName}'`);
        const fileContents = require(path.join(__dirname, file));
        // eslint-disable-next-line no-await-in-loop
        await model.insertMany(fileContents.default);
    }
}

export default seedDatabase;
