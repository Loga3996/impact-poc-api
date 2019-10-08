
import sql from '../db/dataBase';

const selectYearValues = (result) => {
    let sql_query = `select distinct year(ordered_at) as year from cart_orders where ordered_at !=0`;
    sql.query(sql_query, result)
}
const selectCompanyValues = (year, result) => {
    let sql_query = `select company,companyCode from
    (select concat(rc.Number,"-" ,rc.COMPANY_NAME) as company,rc.Number as companyCode 
    from cart_orders as c join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year}) as selection group by company,companyCode;`;
    sql.query(sql_query, year, result)
}

const monthWiseRevenueBasedOnYear = (year, result) => {
    let sql_query = `select DATE_FORMAT(ordered_at,'%b-%Y') as months,month(ordered_at) as monthCode,
    sum(total_amount) as amount from cart_orders 
    where year(ordered_at)=${year} group by months,monthCode order by monthCode`;
    sql.query(sql_query, year, result)
}

const monthWiseRevenueBasedOnYearCompany = ({ year, companyCode }, result) => {
    let sql_query = `select months,sum(amount) as amount,company,companyCode,monthCode,year from
    (select DATE_FORMAT(ordered_at,'%b-%Y') as months,year(ordered_at)as year,
    month(ordered_at) as monthCode, c.company as companyCode ,c.total_amount as amount,
    concat(rc.Number,"-" ,rc.COMPANY_NAME) as company 
    from cart_orders as c join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year} and rc.NUMBER=${companyCode} and c.total_amount !=0 )
    as selection group by company,months,monthCode,year,companyCode order by monthCode;`;
    sql.query(sql_query, { year, companyCode }, result);
}

const officeWiseAmountBasedOnCompanyInSpecMonth = ({ year, companyCode, monthCode }, result) => {
    let sql_query = `select office,sum(Amount) as amount,officeCode,company,months from
    (select c.total_amount as Amount,DATE_FORMAT(ordered_at,'%b-%Y') as months,
    CONCAT(r.OFFICE_NAME,"-",r.NUMBER) as office, r.NUMBER as officeCode,
    concat(rc.Number,"-" ,rc.COMPANY_NAME) as company 
    from cart_orders as c join RMS_OFFICE as r on c.OFFICE = r.NUMBER 
    join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year} and rc.NUMBER =${companyCode} 
    and month(ordered_at)=${monthCode} and c.total_amount !=0)
    as selection group by company,office,officeCode,months`;
    sql.query(sql_query, { year, companyCode, monthCode }, result);
}
const officeWiseBillOfficeAmountBasedOnCompanyInSpecMonth = ({ year, companyCode, monthCode }, result) => {
    let sql_query = `select office,sum(bill) as bill,officeCode,company,months from
    (select c.bill_office as bill,DATE_FORMAT(ordered_at,'%b-%Y') as months,
    CONCAT(r.OFFICE_NAME,"-",r.NUMBER) as office, r.NUMBER as officeCode,
    concat(rc.Number,"-" ,rc.COMPANY_NAME) as company 
    from cart_orders as c join RMS_OFFICE as r on c.OFFICE = r.NUMBER 
    join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year} and rc.NUMBER =${companyCode} 
    and month(ordered_at)=${monthCode} and c.bill_office !=0)
    as selection group by company,office,officeCode,months`;
    sql.query(sql_query, { year, companyCode, monthCode }, result);
}
const officeWiseBillAndPromoAmountBasedOnCompanyInSpecMonth = ({ year, companyCode, monthCode }, result) => {
    let sql_query = `select office,sum(bill)+sum(Promo) as amount,sum(bill) as bill,sum(Promo) as promo, officeCode,company,months from
    (select c.bill_office as bill,c.bill_office_discount_amount as Promo,DATE_FORMAT(ordered_at,'%b-%Y') as months,
    CONCAT(r.OFFICE_NAME,"-",r.NUMBER) as office, r.NUMBER as officeCode,
    concat(rc.Number,"-" ,rc.COMPANY_NAME) as company 
    from cart_orders as c join RMS_OFFICE as r on c.OFFICE = r.NUMBER 
    join RMS_IMPACT_COMPANY as rc on c.COMPANY=rc.NUMBER 
    where year(ordered_at)=${year} and rc.NUMBER =${companyCode}
    and month(ordered_at)=${monthCode} and c.bill_office !=0)
    as selection group by company,office,officeCode,months`;
    sql.query(sql_query, { year, companyCode, monthCode }, result);
}
const topFiveProducts = (result) => {
    let sql_query = `select total, product from
    (select cl.sub_total as total,concat(p.id, '-', cl.part_id, '-', p.short_descr) as product
    from cart_lines as cl join product_part_join as ppj 
    on (ppj.product_id = cl.product_id or ppj.part_id = cl.part_id)
    join products as p on (p.id = ppj.product_id)
	) as selection where product is not null
	group by product,total order by total desc limit 5`;
    sql.query(sql_query, result);
}

module.exports = (() => {
    return {
        'SelectYearValues': selectYearValues,
        'SelectCompanyValues': selectCompanyValues,
        'MonthWiseRevenueBasedOnYear': monthWiseRevenueBasedOnYear,
        'MonthWiseRevenueBasedOnYearCompany': monthWiseRevenueBasedOnYearCompany,
        'OfficeWiseAmountBasedOnCompanyInSpecMonth': officeWiseAmountBasedOnCompanyInSpecMonth,
        'OfficeWiseBillOfficeAmountBasedOnCompanyInSpecMonth': officeWiseBillOfficeAmountBasedOnCompanyInSpecMonth,
        'OfficeWiseBillAndPromoAmountBasedOnCompanyInSpecMonth':officeWiseBillAndPromoAmountBasedOnCompanyInSpecMonth,
        'TopFiveProducts': topFiveProducts
    };
})();
