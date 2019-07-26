
import sql from '../db/dataBase';

const yearWiseRevenue = (result) => {
    let sql_query = `select distinct year(ordered_at) as date,sum(total_amount) as amount from 
        cart_orders where ordered_at != 0 group by year(ordered_at)`;
    sql.query(sql_query, result);
}

const monthWiseRevenueBasedOnYear = (year, result) => {
    let sql_query = `select DATE_FORMAT(ordered_at,'%b-%Y') as month ,sum(total_amount) as amount from 
        cart_orders where year(ordered_at)=${year} group by month`;
    sql.query(sql_query, year, result)
}

const companyWiseRevenue = (result) => {
    let sql_query = `select company ,sum(amount) as amount,code from
    (select c.total_amount as amount,rc.COMPANY_NAME as company, rc.Number as code from 
    cart_orders as c join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER)
    as selection group by company,code;`;
    sql.query(sql_query, result);
}

const companyWiseRevenueBasedOnYear = (year, result) => {
    let sql_query = `select date,company,sum(amount) as amount,code from
        (select year(c.ordered_at) as date, c.total_amount as amount,rc.COMPANY_NAME as company,rc.Number as code from 
        cart_orders as c join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
        where year(ordered_at)=${year})
        as selection group by company,code,date;`;
    sql.query(sql_query, year, result);
}

const monthWiseCompanyAmountBasedOnCompany = ({ year, code }, result) => {
    let sql_query = `select month,sum(amount) as amount,company from
        (select DATE_FORMAT(ordered_at,'%b-%Y') as month,c.total_amount as amount,rc.COMPANY_NAME as company from 
        cart_orders as c join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
        where year(ordered_at)=${year} and c.COMPANY=${code})
        as selection group by company,month;`;
    sql.query(sql_query, { year, code }, result);
}

const officeWiseRevenueBasedOnCompany = (code, result) => {
    let sql_query = `select office,sum(Amount) as amount,company from
        (select DATE_FORMAT(c.ordered_at,'%Y-%m-%d') as orderdate,c.total_amount as Amount,
        r.OFFICE_NAME as office,rc.COMPANY_NAME as company from cart_orders as c 
        join RMS_OFFICE as r on c.OFFICE = r.NUMBER 
        join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
        where rc.NUMBER=${code} and c.total_amount !=0)
        as selection group by company,office;`;
    sql.query(sql_query, code, result);
}
const officeWiseRevenueBasedOnSpecficYear = (year, result) => {
    let sql_query = `select office,sum(Amount) as amount,date,code from
        (select year(c.ordered_at) as date,c.total_amount as Amount,
        r.OFFICE_NAME as office,r.NUMBER as code,rc.COMPANY_NAME as company from cart_orders as c 
        join RMS_OFFICE as r on c.OFFICE = r.NUMBER 
        join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
        where year(ordered_at)=${year} and c.total_amount !=0)
        as selection group by company,office,date,code;`;
    sql.query(sql_query, year, result);
}

const officeWiseRevenueBasedOnCompanyInSpecficYear = ({ year, code }, result) => {
    let sql_query = `select office,sum(Amount) as amount,month,code from
        (select DATE_FORMAT(c.ordered_at,'%b-%Y') as month,c.total_amount as Amount,
        r.OFFICE_NAME as office, r.NUMBER as code,rc.COMPANY_NAME as company from cart_orders as c 
        join RMS_OFFICE as r on c.OFFICE = r.NUMBER 
        join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
        where year(ordered_at)=${year} and r.NUMBER=${code} and c.total_amount !=0)
        as selection group by company,office,month,code;`;
    sql.query(sql_query, { year, code }, result);
}

module.exports = (() => {
    return {
        'YearWiseRevenue': yearWiseRevenue,
        'MonthWiseRevenueBasedOnYear': monthWiseRevenueBasedOnYear,
        'CompanyWiseRevenue': companyWiseRevenue,
        'CompanyWiseRevenueBasedOnYear': companyWiseRevenueBasedOnYear,
        'MonthWiseCompanyAmountBasedOnCompany': monthWiseCompanyAmountBasedOnCompany,
        'OfficeWiseRevenueBasedOnCompany': officeWiseRevenueBasedOnCompany,
        'OfficeWiseRevenueBasedOnSpecficYear': officeWiseRevenueBasedOnSpecficYear,
        'OfficeWiseRevenueBasedOnCompanyInSpecficYear': officeWiseRevenueBasedOnCompanyInSpecficYear
    };
})();
