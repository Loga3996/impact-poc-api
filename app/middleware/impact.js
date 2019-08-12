import Cart from '../models/cart-orders';

const companyAmountDetails = (req, callback) => {
    let year = req.body.year;
    let code = req.body.code;
    let mcode = req.body.mcode;
    switch (req.params.apiType) {
        case 'Ym':
            if (year) {
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
        case 'Cart_Orders':
            if (year && code && mcode) {
                Cart.MonthWiseOfficeAmountBasedOnCompanyInSpecYear({ year, code, mcode }, (err, data) => {
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
        'CompanyAmountDetails': companyAmountDetails
    }
})();