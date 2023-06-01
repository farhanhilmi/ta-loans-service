import FundingService from './funding.service.js';
import LoanService from './loan.service.js';
// import createAutoLend from './createAutoLend.js';
// import requestLoan from './requestLoan.js';

export default (payload) => {
    try {
        console.log('Triggering.... Events');

        payload = JSON.parse(payload);
        console.log('event.... payload', payload);

        const { event, data } = payload;

        // const { userId, roles} = data;

        switch (event) {
            // case 'ADD_TO_WISHLIST':
            case 'LOAN_REQUEST':
                const loanService = new LoanService();
                loanService.createLoan(data);
                // requestLoan(data);
                break;
            case 'CREATE_AUTO_LEND':
                const fundingService = new FundingService();
                console.log('MASUKK');
                fundingService.createAutoLend(data);
                // createAutoLend(data);
                break;
            // case 'ADD_TO_CART':
            //     this.ManageCart(userId, product, qty, false);
            //     break;
            // case 'REMOVE_FROM_CART':
            //     this.ManageCart(userId, product, qty, true);
            //     break;
            // case 'CREATE_ORDER':
            //     this.ManageOrder(userId, order);
            //     break;
            default:
                console.log('No event found!');
                break;
        }
    } catch (error) {
        throw error;
    }
};
