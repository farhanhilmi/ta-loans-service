import { ValidationError } from '../utils/errorHandler.js';
import loansModels from '../database/models/loans.models.js';

export default async (userId, idCard) => {
    if (!userId) {
        throw new ValidationError('User Id is required!');
    }

    const loans = await loansModels.find({ userId: userId });
    console.log('loans', loans);

    if (loans.length < 1) return { status: 'OK', message: 'No loans found' };

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

    return { status, message: '' };
};
