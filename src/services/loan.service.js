import fundingModel from '../database/models/funding.models.js';
import autoLend from '../database/models/autoLend.models.js';
import loansModels from '../database/models/loans.models.js';
import LoanRepository from '../database/repository/loans.repo.js';

class LoanService {
    constructor() {
        this.loanRepository = new LoanRepository();
        this.fundingModel = fundingModel;
        this.autoLend = autoLend;
        this.loansModels = loansModels;
    }

    async createLoan(payload) {
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

            const loan = await this.loansModels.create(data);

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
    }

    async getAvailableLoans() {}

    async getLoanDetails(loanId) {}
}

export default LoanService;
