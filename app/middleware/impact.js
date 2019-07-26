import Cart from '../models/cart-orders';

const companyAmountDetails = (req, callback) => {
    let year = req.body.year;
    let code = req.body.code;
    switch (req.params.apiType) {
        case 'YM':
            if (year) {
                Cart.MonthWiseRevenueBasedOnYear(year, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            } else {
                Cart.YearWiseRevenue((err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            break;
        case 'Company':
            if (year && code) {
                Cart.MonthWiseCompanyAmountBasedOnCompany({ year, code }, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            else if (year) {
                Cart.CompanyWiseRevenueBasedOnYear(year, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            } else {
                Cart.CompanyWiseRevenue((err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            break;
        case 'Office':
            if (year && code) {
                Cart.OfficeWiseRevenueBasedOnCompanyInSpecficYear({ year, code }, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            else if (code) {
                Cart.OfficeWiseRevenueBasedOnCompany(code, (err, data) => {
                    if (err) return callback(err);
                    callback(null, data);
                })
            }
            else if (year) {
                Cart.OfficeWiseRevenueBasedOnSpecficYear(year, (err, data) => {
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