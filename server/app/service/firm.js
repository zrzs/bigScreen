"use strict";

const { Service } = require("egg");

class FirmService extends Service {

  // query brand sales
  async queryFirmSales(firmList) {
    let firmitemList = await this.app.mysql.select('firmSales',{
        where:{
            firmName:JSON.parse(firmList)
        },
        columns:['firmName','year','month','monthSale'],
        orders:[['year','asc'],['month','asc']]
    });
    return firmitemList;
  }

  async queryFirmSalesGroup() {
    let firmNameList = await this.app.mysql.query("SELECT firmName FROM firmSales GROUP BY firmName");
    firmNameList.map(b=>{
        b.text=b.firmName;
        b.val=b.firmName;
        delete b.firmName;
        return b;
    });
    return firmNameList;
  }
}

module.exports = FirmService;
