import { responseData } from '../utils/responses.js';
import config from '../config/index.js';
// import { io } from '../server.js';
import checkLoanStatus from '../services/checkLoanStatus.js';
import LoanService from '../services/loan.service.js';

// import userServices from '../services/index.js';
export class LoansController {
    constructor() {
        // this.channel = channel;
        // SubscribeMessage(subscribeEvents, 'Loan');
        this.loanService = new LoanService();
    }

    // CONTOH
    async getExample(req, res, next) {
        try {
            // const { userId, roles } = JSON.parse(req.header('user'));
            // const data = await this.authService.getUserData({ userId, roles });

            // const data = await getExample({ userId, roles }, payload);
            // // Publish to message broker (Loans service)
            // PublishMessage(
            //     this.channel,
            //     config.RABBITMQ.CHANNEL.BORROWER_SERVICE,
            //     JSON.stringify({ data, event: 'LOAN_REQUEST' }),
            // );
            const data = {
                event: 'LOAN_REQUEST',
                data: { userId: '1323' },
                message:
                    'Your loan request successfully submitted to loan list',
            };
            const userId = 'diajdai1112';
            // io.emit(`notification#${userId}`, data);
            res.status(200).json(responseData('', '', 'successss'));
        } catch (error) {
            next(error);
        }
    }

    async loanCheck(req, res, next) {
        try {
            const { userId, idCard } = req.params;
            // const { userId, roles } = JSON.parse(req.header('user'));
            const data = await checkLoanStatus(userId, idCard);
            // io.emit(`notification#${userId}`, data);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    async getAllAvailableLoans(req, res, next) {
        try {
            // const { page, limit, sort, order } = req.query;
            const data = await this.loanService.showAvailableLoans(req.query);
            // io.emit(`notification#${userId}`, data);
            res.status(200).json(
                responseData(
                    data.data,
                    'OK',
                    'fetching all available loans success',
                    data.meta,
                ),
            );
        } catch (error) {
            next(error);
        }
    }

    async getLoanById(req, res, next) {
        try {
            // const { page, limit, sort, order } = req.query;
            const data = await this.loanService.getLoanDetails(
                req.params.loanId,
            );
            // io.emit(`notification#${userId}`, data);
            res.status(200).json(
                responseData(data, 'OK', 'fetching loan details success', {}),
            );
        } catch (error) {
            next(error);
        }
    }
}
