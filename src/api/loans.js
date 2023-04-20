import { PublishMessage, SubscribeMessage } from '../utils/messageBroker.js';
import { responseData } from '../utils/responses.js';
import config from '../config/index.js';
import { io } from '../server.js';
import subscribeEvents from '../services/subscribeEvents.js';
import checkLoanStatus from '../services/checkLoanStatus.js';

// import userServices from '../services/index.js';
export class LoansController {
    constructor(channel) {
        this.channel = channel;
        SubscribeMessage(channel, subscribeEvents);
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
            io.emit(`notification#${userId}`, data);
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
}