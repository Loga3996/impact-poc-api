import Cart from '../models/cart-orders';

const cartOrdersDetails = (req, callback) => {
    let year = req.body.year;
    let code = req.body.code;
    let mcode = req.body.mcode;
    switch (req.params.apiType) {
        case 'Cart_Orders_Bill':
            if (year && code && mcode) {
                Cart.OfficeWisebillOfficeAmountBasedOnCompanyInSpecMonth({ year, code, mcode }, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            } else if (year) {
                Cart.SelectCompanyValues(year, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            } else {
                Cart.SelectYearValues((err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            break;
        case 'Cart_Orders_Amount':
            if (year && code && mcode) {
                Cart.OfficeWiseAmountBasedOnCompanyInSpecMonth({ year, code, mcode }, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            else if (year && code) {
                Cart.MonthWiseCompanyAmountBasedOnYear({ year, code }, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            else if (year) {
                Cart.MonthWiseRevenueBasedOnYear(year, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            break;
        default:
            callback("use correct apiType");
    }
}
module.exports = (() => {
    return {
        'cartOrdersDetails': cartOrdersDetails
    }
})();