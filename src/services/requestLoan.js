import loansModels from '../database/models/loans.models.js';
import { PublishMessage } from '../utils/messageBroker.js';
import { deleteCache } from '../utils/redis.js';
// import { io } from '../server.js';

export default async (payload) => {
    try {
        const data = {
            userId: payload.user.userId,
            borrowerId: payload.user.borrowerId,
            loanPurpose: payload.loanApplication.loanPurpose,
            amount: payload.loanApplication.amount,
            tenor: payload.loanApplication.tenor,
            interestRate: payload.loanApplication.interestRate,
            description: payload.loanApplication.description,
            repaymentSource: payload.loanApplication.repaymentSource,
        };

        const loan = await loansModels.create(data);
        const messageData = {
            userId: payload.user.userId,
            status: 'on request',
        };
        console.log('new loan', loan);

        deleteCache(true, 'availableLoans-*');
        PublishMessage(messageData, 'UPDATE_BORROWER_STATUS', 'Borrower');

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
        return new Error(error);
    }
};
