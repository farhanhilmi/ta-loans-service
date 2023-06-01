import loansModels from '../database/models/loans.models.js';
// import { PublishMessage } from '../utils/messageBroker.js';
// import { deleteCache } from '../utils/redis.js';
// import { io } from '../server.js';

export default async (payload) => {
    try {
        const data = {
            userId: payload.user.userId,
            borrowerId: payload.user.borrowerId,
            purpose: payload.loanApplication.purpose,
            amount: payload.loanApplication.amount,
            tenor: payload.loanApplication.tenor,
            yieldReturn: payload.loanApplication.yieldReturn,
            paymentSchema: payload.loanApplication.paymentSchema,
            borrowingCategory: payload.loanApplication.borrowingCategory,
        };

        const loan = await loansModels.create(data);
        // const messageData = {
        //     userId: payload.user.userId,
        //     status: 'on request',
        // };
        console.log('new loan', loan);

        // deleteCache(true, 'availableLoans-*');
        // PublishMessage(messageData, 'UPDATE_BORROWER_STATUS', 'Borrower');

        const notifMessage = {
            event: 'LOAN_REQUEST',
            data: { userId: payload.user.userId, loanId: loan._id },
            message:
                'Your loan request has been successfully displayed and lenders can view your loan.',
        };

        // io.emit(`notification#${payload.user.userId}`, notifMessage);
        return true;
    } catch (error) {
        console.log('error at service', error);
        throw error;
    }
};
