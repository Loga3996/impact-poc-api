
import sql from '../db/dataBase';

const selectYearValues = (result) => {
    let sql_query = `select distinct year(ordered_at) as year from cart_orders where ordered_at !=0`;
    sql.query(sql_query, result)
}
const selectCompanyValues = (year,result) => {
    let sql_query = `select company,code from
    (select concat(rc.Number,"-" ,rc.COMPANY_NAME) as company,rc.Number as code from 
    cart_orders as c join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year})
    as selection group by company,code;`;
    sql.query(sql_query,year, result)
}

const monthWiseRevenueBasedOnYear = (year, result) => {
    let sql_query = `select DATE_FORMAT(ordered_at,'%b-%Y') as months,month(ordered_at) as mcode,
    sum(total_amount) as amount from cart_orders 
    where year(ordered_at)=${year} group by months,mcode order by mcode`;
    sql.query(sql_query, year, result)
}

const monthWiseCompanyAmountBasedOnYear = ({ year, code }, result) => {
    let sql_query = `select months,sum(amount) as amount,company,mcode,year,code from
    (select DATE_FORMAT(ordered_at,'%b-%Y') as months,year(ordered_at)as year,
    month(ordered_at) as mcode, c.company as code ,c.total_amount as amount,
    concat(rc.Number,"-" ,rc.COMPANY_NAME) as company from cart_orders as c 
    join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year} and rc.NUMBER=${code})
    as selection group by company,months,mcode,year,code order by mcode;`;
    sql.query(sql_query, { year, code }, result);
}

const monthWiseOfficeAmountBasedOnCompanyInSpecMonth = ({ year, code ,mcode}, result) => {
    let sql_query = `select office,sum(Amount) as amount,code,company,months from
    (select c.total_amount as Amount,DATE_FORMAT(ordered_at,'%b-%Y') as months,
    CONCAT(r.OFFICE_NAME,"-",r.NUMBER) as office, r.NUMBER as code,
    concat(rc.Number,"-" ,rc.COMPANY_NAME) as company from cart_orders as c 
    join RMS_OFFICE as r on c.OFFICE = r.NUMBER 
    join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year} and rc.NUMBER =${code} and month(ordered_at)=${mcode})
    as selection group by company,office,code,months`;
    sql.query(sql_query, { year, code,mcode }, result) ;
}
const monthWisebillOfficeAmountBasedOnCompanyInSpecMonth = ({ year, code ,mcode}, result) => {
    let sql_query = `select office,sum(bill) as bill,code,company,months from
    (select c.bill_office as bill,DATE_FORMAT(ordered_at,'%b-%Y') as months,
    CONCAT(r.OFFICE_NAME,"-",r.NUMBER) as office, r.NUMBER as code,
    concat(rc.Number,"-" ,rc.COMPANY_NAME) as company from cart_orders as c 
    join RMS_OFFICE as r on c.OFFICE = r.NUMBER 
    join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year} and rc.NUMBER =${code} and month(ordered_at)=${mcode} and c.bill_office !=0)
    as selection group by company,office,code,months`;
    sql.query(sql_query, { year, code,mcode }, result) ;
}

module.exports = (() => {
    return {
        'SelectYearValues':selectYearValues,
        'SelectCompanyValues':selectCompanyValues,
        'MonthWiseRevenueBasedOnYear': monthWiseRevenueBasedOnYear,
        'MonthWiseCompanyAmountBasedOnYear': monthWiseCompanyAmountBasedOnYear,
        'MonthWiseOfficeAmountBasedOnCompanyInSpecMonth':monthWiseOfficeAmountBasedOnCompanyInSpecMonth,
        'MonthWisebillOfficeAmountBasedOnCompanyInSpecMonth':monthWisebillOfficeAmountBasedOnCompanyInSpecMonth
    };
})();
