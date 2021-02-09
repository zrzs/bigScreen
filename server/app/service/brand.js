"use strict";

const { Service } = require("egg");

class BrandService extends Service {

  // query brand sales
  async queryBrandSales(brandList) {
    let branditemList = await this.app.mysql.select('brandSales',{
        where:{
            brandName:JSON.parse(brandList)
        },
        columns:['brandName','year','month','monthSale'],
        orders:[['year','asc'],['month','asc']]
    });
    return branditemList;
  }

  async queryBrandSalesGroup() {
    let brandNameList = await this.app.mysql.query("SELECT brandName FROM brandSales GROUP BY brandName");
    brandNameList.map(b=>{
        b.text=b.brandName;
        b.val=b.brandName;
        delete b.brandName;
        return b;
    });
    return brandNameList;
  }

//   获取车型排名前100的
  async queryTop100ScoreOfBrand(){
      let brandList=await this.app.mysql.query("SELECT modelName,score FROM brand ORDER BY score DESC LIMIT 100;");
      brandList.map(b=>{
          b.score=parseFloat(b.score)
      });
      return brandList;
  }

    // 查询车型部位投诉问题数据
    async queryBrandPositionProblem(brandName) {
      let brandList = await this.app.mysql.select('brandProblem',{
          where:{
              brandName:brandName
          },
          columns:['position','problem','compaintNumber'],
          orders:[['position','asc']]
      });
      return brandList;
    }
  // 查询车型部位投诉表中  车型集合
    async queryBrandPositonProblemGroup() {
      let brandNameList = await this.app.mysql.query("SELECT brandName FROM brandProblem GROUP BY brandName");
      brandNameList.map(b=>{
          b.text=b.brandName;
          b.val=b.brandName;
          delete b.brandName;
          return b;
      });
      return brandNameList;
    }
  // 根据百车研究数据查询车型列表
  async queryBrandByBaiche(type) {
    let sql=`SELECT modelName FROM brand WHERE ${type} NOT LIKE '%暂无%' AND ${type} !='{"score":"","userCount":"","table":[]}'`;
    let modelNameList = await this.app.mysql.query(sql);
    modelNameList.map(b=>{
        b.text=b.modelName;
        b.val=b.modelName;
        delete b.modelName;
        return b;
    });
    return modelNameList;
  }

  async queryBaicheData(type,modelNames){
    console.log(modelNames);
    modelNames=JSON.parse(modelNames);
    let sql=`SELECT ${type} as json,modelName FROM brand WHERE modelName in (${modelNames.join(',')})`;
    let jsonList = await this.app.mysql.query(sql);
    return jsonList;
  }
}

module.exports = BrandService;
