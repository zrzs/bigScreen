"use strict";

const { Service } = require("egg");

class ComplaintService extends Service {

  // query brand sales
  async queryBrandComplaint(brandList) {
    let brandComplaintList = await this.app.mysql.select('complaint',{
        where:{
            brandName:JSON.parse(brandList)
        },
        columns:['brandName','year','month','monthNumber'],
        orders:[['year','asc'],['month','asc']]
    });
    return brandComplaintList;
  }

  async queryComplaintBrandGroup() {
    let brandNameList = await this.app.mysql.query("SELECT brandName FROM complaint GROUP BY brandName");
    brandNameList.map(b=>{
        b.text=b.brandName;
        b.val=b.brandName;
        delete b.brandName;
        return b;
    });
    return brandNameList;
  }

  async queryBrandComplaintQuestion(){
    let brandNameList = await this.app.mysql.query("SELECT brandName FROM brandComplaintQuestion GROUP BY brandName");
    brandNameList.map(b=>{
        b.text=b.brandName;
        b.val=b.brandName;
        delete b.brandName;
        return b;
    });
    return brandNameList;
  }

    // 通过品牌名 查询车身投诉问题占比
  async queryBrandComplaintRate(brandList) {
      let brandComplaintList = await this.app.mysql.select('brandComplaintQuestion',{
          where:{
              brandName:JSON.parse(brandList)
          },
          columns:['body','rate']
      });
      return brandComplaintList;
    }
}

module.exports = ComplaintService;
