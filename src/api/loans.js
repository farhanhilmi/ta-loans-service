import { PublishMessage, SubscribeMessage } from '../utils/messageBroker.js';
import { responseData } from '../utils/responses.js';
import config from '../config/index.js';

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
            const data = await getExample({ userId, roles }, payload);
            // Publish to message broker (Loans service)
            PublishMessage(
                this.channel,
                config.RABBITMQ.CHANNEL.BORROWER_SERVICE,
                JSON.stringify({ data, event: 'LOAN_REQUEST' }),
            );
            res.status(200).json(responseData({}));
        } catch (error) {
            next(error);
        }
    }
}
