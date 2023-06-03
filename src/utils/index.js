import moment from 'moment-timezone';
import mongoose from 'mongoose';

export const toObjectId = (id) => {
    return new mongoose.Types.ObjectId(id);
};

export const getCurrentJakartaTime = () => {
    return moment.tz(Date.now(), 'Asia/Jakarta');
};

export const formatToJakartaTime = (datetime) => {
    return moment.tz(new Date(datetime), 'Asia/Jakarta');
};

export const toTitleCase = (str) => {
    return str
        .split(' ')
        .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
};

/**
 * Validate request payload for required fields
 * @param {Object} payload - Object of request payload
 * @param {Array} requiredFields - Array of required fields
 * @returns {String} String of error fields
 */
export const validateRequestPayload = (payload, requiredFields = []) => {
    let errorFields = [];
    requiredFields.forEach((field) => {
        if (!payload[field]) {
            errorFields.push(field);
        }
    });

    return errorFields.join(', ');

    // if (errorFields.length > 0) {
    //     return false, errorFields;
    //     // throw new ValidationError(
    //     //     `${errorFields.join(', ')} field(s) are required!`,
    //     // );
    // }

    // return true, errorFields;
};
