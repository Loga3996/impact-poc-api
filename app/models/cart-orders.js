
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
    let sql_query = `select DATE_FORMAT(ordered_at,'%b-%Y') as months,month(ordered_at) as mcode ,sum(total_amount) as amount from 
    cart_orders where year(ordered_at)=${year} group by months,mcode order by mcode`;
    sql.query(sql_query, year, result)
}

// const monthWiseCompanyAmountBasedOnYear = ({ year, company }, result) => {
//     let sql_query = `select months,sum(amount) as amount,company,mcode,year,code from
//     (select DATE_FORMAT(ordered_at,'%b-%Y') as months,year(ordered_at)as year,month(ordered_at) as mcode, c.company as code ,c.total_amount as amount,rc.COMPANY_NAME as company from 
//     cart_orders as c join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
//     where year(ordered_at)=${year} and rc.COMPANY_NAME='${company}')
//     as selection group by company,months,mcode,year,code order by mcode;`;
    
//     console.log("sql", sql_query)
//     sql.query(sql_query, { year, company }, result);
// }

const monthWiseCompanyAmountBasedOnYear = ({ year, code }, result) => {
    let sql_query = `select months,sum(amount) as amount,company,mcode,year,code from
    (select DATE_FORMAT(ordered_at,'%b-%Y') as months,year(ordered_at)as year,month(ordered_at) as mcode, c.company as code ,c.total_amount as amount,rc.COMPANY_NAME as company from 
    cart_orders as c join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year} and rc.NUMBER=${code})
    as selection group by company,months,mcode,year,code order by mcode;`;
    sql.query(sql_query, { year, code }, result);
}

const monthWiseOfficeAmountBasedOnCompanyInSpecYear = ({ year, code ,mcode}, result) => {
    let sql_query = `select office,sum(Amount) as amount,code from
    (select c.total_amount as Amount,
    CONCAT(r.OFFICE_NAME,"-",r.NUMBER) as office, r.NUMBER as code,rc.COMPANY_NAME as company from cart_orders as c 
    join RMS_OFFICE as r on c.OFFICE = r.NUMBER 
    join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year} and rc.NUMBER =${code} and month(ordered_at)=${mcode})
    as selection group by company,office,code`;
    sql.query(sql_query, { year, code,mcode }, result);
}

module.exports = (() => {
    return {
        'SelectYearValues':selectYearValues,
        'SelectCompanyValues':selectCompanyValues,
        'MonthWiseRevenueBasedOnYear': monthWiseRevenueBasedOnYear,
        'MonthWiseCompanyAmountBasedOnYear': monthWiseCompanyAmountBasedOnYear,
        'MonthWiseOfficeAmountBasedOnCompanyInSpecYear':monthWiseOfficeAmountBasedOnCompanyInSpecYear
    };
})();
