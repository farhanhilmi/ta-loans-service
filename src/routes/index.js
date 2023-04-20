import { Router } from 'express';
import { LoansController } from '../api/loans.js';

const Routes = (channel) => {
    const router = Router();
    const controller = new LoansController(channel);
    router.get('/', controller.getExample.bind(controller));
    router.get('/check/:userId/:idCard', controller.loanCheck.bind(controller));

    return router;
};

export default Routes;
