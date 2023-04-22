import { Router } from 'express';
import { LoansController } from '../api/loans.js';

const Routes = () => {
    const router = Router();
    const controller = new LoansController();
    router.get('/', controller.getExample.bind(controller));
    router.get('/check/:userId/:idCard', controller.loanCheck.bind(controller));
    router.get('/available', controller.getAllAvailableLoans.bind(controller));

    return router;
};

export default Routes;
