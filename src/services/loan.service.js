import fundingModel from '../database/models/funding.models.js';
import autoLend from '../database/models/autoLend.models.js';
import loansModels from '../database/models/loans.models.js';
import LoanRepository from '../database/repository/loans.repo.js';
import { formatDataPagination } from '../utils/responses.js';
import { NotFoundError, ValidationError } from '../utils/errorHandler.js';

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

    async showAvailableLoans(params) {
        try {
            let {
                page,
                limit,
                sort,
                order,
                q,
                tenor_min,
                tenor_max,
                yield_min,
                yield_max,
            } = params;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            sort = sort || 'createdDate';
            order = order || 'asc';
            q = q?.trim();

            let queryFilter = [];
            let cacheKey = `availableLoans-${page}-${limit}-${sort}-${order}`;

            if (tenor_min && tenor_max) {
                queryFilter.push({
                    tenor: {
                        $gte: parseInt(tenor_min),
                        $lte: parseInt(tenor_max),
                    },
                });
                cacheKey += `-[tenor_min:${tenor_min}-tenor_max:${tenor_max}]`;
            } else if (tenor_min) {
                queryFilter.push({ tenor: { $gte: parseInt(tenor_min) } });
                cacheKey += `-[tenor_min:${tenor_min}]`;
            } else if (tenor_max) {
                queryFilter.push({ tenor: { $lte: parseInt(tenor_max) } });
                cacheKey += `-[tenor_max:${tenor_max}]`;
            }

            if (yield_min && yield_max) {
                queryFilter.push({
                    yieldReturn: {
                        $gte: parseInt(yield_min),
                        $lte: parseInt(yield_max),
                    },
                });
                cacheKey += `-[yield_min:${yield_min}-yield_max:${yield_max}]`;
            } else if (yield_min) {
                queryFilter.push({
                    yieldReturn: { $gte: parseInt(yield_min) },
                });
                cacheKey += `-[yield_min:${yield_min}]`;
            } else if (yield_max) {
                queryFilter.push({
                    yieldReturn: { $lte: parseInt(yield_max) },
                });
                cacheKey += `-[yield_max:${yield_max}]`;
            }

            if (q) {
                queryFilter.push({ purpose: { $regex: q, $options: 'i' } });
                cacheKey += `-[query:${q.replace(/\s/g, '')}]`;
            }

            const [loans, totalItems] = await Promise.all([
                this.loanRepository.lookupFind(
                    { $and: queryFilter },
                    // { loanPurpose: q },
                    page,
                    limit,
                    sort,
                    order,
                ),
                this.loansModels.countDocuments({
                    $and: [
                        {
                            $or: [
                                { status: 'on request' },
                                { status: 'on process' },
                            ],
                        },
                        ...queryFilter,
                    ],
                }),
            ]);

            return formatDataPagination(
                loans,
                page,
                limit,
                totalItems,
                sort,
                order,
                q,
                tenor_min,
                tenor_max,
                yield_min,
                yield_max,
            );
        } catch (error) {
            throw error;
        }
    }

    async getLoanDetails(loanId) {
        try {
            if (!loanId) throw new ValidationError('loanId is required');
            const loan = await this.loanRepository.findLoanById(loanId);
            if (!loan) throw new NotFoundError('Loan not found');
            return loan;
        } catch (error) {
            throw error;
        }
    }
}

export default LoanService;
