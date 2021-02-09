"use strict";

const { Service } = require("egg");

class SalesService extends Service {

  // 分组查询 车级销售排名的月份分组
  async queryCarLevelMonthSales(month) {
    let carLevelList = await this.app.mysql.select('carLevelSales',{
        where:{
            month:JSON.parse(month)
        },
        columns:['carType','carModel','sales']
    });
    return carLevelList;
  }

    //   分组查询车级
  async queryCarLevelGroupMonth() {
    let monthList = await this.app.mysql.query("SELECT month FROM carLevelSales GROUP BY month");
    monthList.map(b=>{
        b.text=b.month;
        b.val=b.month;
        delete b.month;
        return b;
    });
    return monthList;
  }

    // 分组查询 车级销售排名的月份分组
    async queryPriceRangeMonthSales(month) {
        let priceRangeList = await this.app.mysql.select('priceRangeRanking',{
            where:{
                month:JSON.parse(month)
            },
            columns:['priceRange','carModel','sales']
        });
        return priceRangeList;
      }
    
        //   分组查询车级
      async queryPriceRangeGroupMonth() {
        let monthList = await this.app.mysql.query("SELECT month FROM priceRangeRanking GROUP BY month");
        monthList.map(b=>{
            b.text=b.month;
            b.val=b.month;
            delete b.month;
            return b;
        });
        return monthList;
      }
}

module.exports = SalesService;
