import Cart from '../models/cart-orders';

const cartOrdersDetails = (req, callback) => {
    let year = req.body.year;
    let companyCode = req.body.companyCode;
    let monthCode = req.body.monthCode;
    switch (req.params.apiType) {
        case 'Cart_Orders_Bill':
            if (year && companyCode && monthCode) {
                Cart.OfficeWiseBillOfficeAmountBasedOnCompanyInSpecMonth({ year, companyCode, monthCode }, (err, data) => {
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
            if (year && companyCode && monthCode) {
                Cart.OfficeWiseAmountBasedOnCompanyInSpecMonth({ year, companyCode, monthCode }, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            else if (year && companyCode) {
                Cart.MonthWiseRevenueBasedOnYearCompany({ year, companyCode }, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            else if (year) {
                Cart.MonthWiseRevenueBasedOnYear(year, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            } else {   
                Cart.TopFiveProducts((err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            break;
        case 'Cart_Orders_Promo':
            if (year && companyCode && monthCode) {
                Cart.OfficeWiseBillAndPromoAmountBasedOnCompanyInSpecMonth({ year, companyCode, monthCode }, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            } else {
                callback(null, []);
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