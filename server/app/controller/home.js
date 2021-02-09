"use strict";

const request = require("request");

const iconv = require("iconv-lite");
var CronJob = require("cron").CronJob;
const xlsx = require("node-xlsx");
const path = require("path");

const Controller = require("egg").Controller;

const AipOcrClient = require("baidu-aip-sdk").ocr;
var fs = require("fs");

// 设置APPID/AK/SK
const APP_ID = "18937312";
const API_KEY = "BxenLUbxYGtt2MUUcc7GrGX6";
const SECRET_KEY = "aKgx7OQDp74qWOR43OZfj9BrgolQ4HRI";

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // https://k.autohome.com.cn/264
    request(
      { url: "https://k.autohome.com.cn/264", encoding: null,
      },
      async (error, response, body) => {
        fs.writeFile('brand.html', iconv.decode(body, "gb2312"),  function(err) {
          if (err) {
              return console.error(err);
          }
       });
      }
    );

    // const user = await ctx.service.user.get(1);

    // await ctx.service.spider.crawlMouthconDetailList();//更新车型后采集的字段
    // await ctx.service.spider.getMouthconListByBrand(); //爬取口碑详情

    // const base64 = await ctx.service.spider.getAutoMouthconInfo(
    //   "1195625-0",
    //   "https://k.autohome.com.cn/detail/view_01ccgv5d9w68r32c9q60s00000.html?st=2162&piap=0|3170|0|0|1|0|0|0|0|0|1#pvareaid=2112108"
    // );

    // console.log(baiduResult);

    ctx.body = "hi, egg.js home page";
  }

  async crawlMonthconInfo() {
    const job = new CronJob(
      "*/20 * * * * *",
      async () => {
        await this.ctx.service.spider.getUnCrawlAutoMouthconList();
      },
      null,
      true, 
      "Asia/Chongqing"
    );
    
    this.ctx.body = "正在抓取口碑信息中....";
  }

  async crawlMonthconDetailInfo() {
    const brandList= await this.ctx.service.spider.getWaitingCrawlMouthconDetailList();
    if(brandList.length<=0){
      return "暂无待爬取的口碑信息";
    }
    let cursor=0;
    let crawlerInfo={url:cursor===1916?'https://k.autohome.com.cn/530/StopSelling/index_204.html': brandList[cursor].modelMouthcon,end:false};
    const job = new CronJob(
      "*/3 * * * * *",
      async () => {
        if (cursor===brandList.length-1) {
          job.stop();
          console.log("口碑数据数据爬取完成");
        } else {
          try {
            console.log(crawlerInfo,cursor);
          crawlerInfo=await this.ctx.service.spider.crawlMouthconList(crawlerInfo.url,brandList[cursor]);
          console.log("after:",crawlerInfo,cursor);
          if(crawlerInfo.end){
            cursor=cursor+1;
            crawlerInfo={url:brandList[cursor].modelMouthcon,end:false};
           }
          } catch (error) {
            console.log(error);
          }
        }
      },
      null,
      true, 
      "Asia/Chongqing"
    );
    this.ctx.body = "正在抓取口碑详情信息中....";
  }

  async crawlBrandInfo() {
   const brandList= await this.ctx.service.spider.getWaitingCrawlMouthconDetailList();
    if(brandList.length<=0){
      return "暂无待爬取的车型数据";
    }
    let cursor=0;
    // 创建定时任务每3秒 爬取一次车型数据
    const job = new CronJob(
      "*/2 * * * * *",
      async () => {
        if (cursor===brandList.length-1) {
          job.stop();
          console.log("车型数据爬取完成");
        } else {
          try {
            const brand=brandList[cursor];
            console.log(cursor+" / "+brandList.length);
            await this.ctx.service.spider.getModelDetaiInfoByURL(brand);
            cursor=cursor+1;
          } catch (error) {
            console.log(error);
          }
        }
      },
      null,
      true,
      "Asia/Chongqing"
    );
    this.ctx.body = "车型数据爬取中....";
  }

  // 动态获取1-2屏的品牌销量数据
  async getBrandData(){
    const brandList=await this.ctx.service.brand.queryBrandSales(this.ctx.request.query.brandList);
    let brandMap={},_brandList=[];
    brandList.map(b=>{
     let bitems= brandMap[b.brandName];
     if(bitems&&bitems.length>0){
      brandMap[b.brandName].push([b.year+'-'+(b.month>=10?b.month:"0"+b.month),b.monthSale]);
     }else{
      brandMap[b.brandName]=[[b.year+'-'+(b.month>=10?b.month:"0"+b.month),b.monthSale]];
     }
    });
    for(let attr in brandMap){
      _brandList.push({name:attr,data:brandMap[attr]});
    }
    this.ctx.body=_brandList;
  }

  // 动态获取1-5厂商销量数据
  async getFirmData(){
    const firmList=await this.ctx.service.firm.queryFirmSales(this.ctx.request.query.firmList);
    let firmMap={},_firmList=[];
    firmList.map(b=>{
     let bitems= firmMap[b.firmName];
     if(bitems&&bitems.length>0){
      firmMap[b.firmName].push([b.year+'-'+(b.month>=10?b.month:"0"+b.month),b.monthSale]);
     }else{
      firmMap[b.firmName]=[[b.year+'-'+(b.month>=10?b.month:"0"+b.month),b.monthSale]];
     }
    });
    for(let attr in firmMap){
      _firmList.push({name:attr,data:firmMap[attr]});
    }
    this.ctx.body=_firmList;
  }

    // 动态获取3-1品牌投诉数据
    async getCompaintData(){
      const brandList=await this.ctx.service.complaint.queryBrandComplaint(this.ctx.request.query.brandList);
      let brandMap={},_brandList=[];
      brandList.map(b=>{
       let bitems= brandMap[b.brandName];
       if(bitems&&bitems.length>0){
        brandMap[b.brandName].push([b.year+'-'+(b.month>=10?b.month:"0"+b.month),b.monthNumber]);
       }else{
        brandMap[b.brandName]=[[b.year+'-'+(b.month>=10?b.month:"0"+b.month),b.monthNumber]];
       }
      });
      for(let attr in brandMap){
        _brandList.push({name:attr,data:brandMap[attr]});
      }
      this.ctx.body=_brandList;
    }

    // 获取车型部位投诉问题数据
    // queryBrandPositionProblem
    async queryBrandPositionProblem(){
      const brandList=await this.ctx.service.brand.queryBrandPositionProblem(this.ctx.request.query.brandName);
      let positionMap={};
      brandList.map(b=>{
       let bitems= positionMap[b.position];
       if(bitems&&bitems.length>0){
        positionMap[b.position].push([b.problem,b.compaintNumber]);
       }else{
        positionMap[b.position]=[[b.problem,b.compaintNumber]];
       }
      });
      this.ctx.body=positionMap;
    }


    // 动态获取1-4屏的车级销量数据
    async queryCarLevelMonthSales(){
      const saleList=await this.ctx.service.sale.queryCarLevelMonthSales(this.ctx.request.query.month);
      let carTypeMap={},_saleList=[];
      saleList.map(b=>{
       let bitems= carTypeMap[b.carType];
       if(bitems&&bitems.length>0){
        carTypeMap[b.carType].push([b.carModel,b.sales]);
       }else{
        carTypeMap[b.carType]=[[b.carModel,b.sales]];
       }
      });
      for(let attr in carTypeMap){
        _saleList.push({name:attr,data:carTypeMap[attr]});
      }
      this.ctx.body=_saleList;
    }

        // 动态获取1-6屏的售价区间销量数据
    async queryPriceRangeMonthSales(){
      const saleList=await this.ctx.service.sale.queryPriceRangeMonthSales(this.ctx.request.query.month);
      let priceRangeMap={},_saleList=[];
      saleList.map(b=>{
       let bitems= priceRangeMap[b.priceRange];
       if(bitems&&bitems.length>0){
        priceRangeMap[b.priceRange].push([b.carModel,b.sales]);
       }else{
        priceRangeMap[b.priceRange]=[[b.carModel,b.sales]];
       }
      });
      for(let attr in priceRangeMap){
        _saleList.push({name:attr,data:priceRangeMap[attr]});
      }
      this.ctx.body=_saleList;
    }

    // 查询百车研究数据
    async queryBaicheData(){
      const {type,modelNames}=this.ctx.request.query;
      const json= await this.ctx.service.brand.queryBaicheData(type,modelNames);
      this.ctx.body=json;
    }

    
  async getChartData() {
    const auctionList=await this.ctx.service.auction.getAuctionList();
    const brandNameList=await this.ctx.service.brand.queryBrandSalesGroup();
    const top100ScoreBrand=await this.ctx.service.brand.queryTop100ScoreOfBrand();
    const firmNameList=await this.ctx.service.firm.queryFirmSalesGroup();
    const compaintList=await this.ctx.service.complaint.queryComplaintBrandGroup();
    const brandPositinProblemList=await this.ctx.service.brand.queryBrandPositonProblemGroup();
    const carLevelMonthList=await this.ctx.service.sale.queryCarLevelGroupMonth();
    const priceRankingMonthList=await this.ctx.service.sale.queryPriceRangeGroupMonth();
    const newBaicheFaultNameList=await this.ctx.service.brand.queryBrandByBaiche("newBaicheFault");
    const researchBaicheFaultNameList=await this.ctx.service.brand.queryBrandByBaiche("researchBaicheFault");


    let data_1_1 = xlsx.parse(path.join("xlsx", "1-1.xlsx"));
    let data_1_2 = brandNameList;
    let data_1_3 = xlsx.parse(path.join("xlsx", "1-3.xlsx"));
    let data_1_4 = carLevelMonthList;
    let data_1_5 = firmNameList;
    let data_1_6 = priceRankingMonthList;

    let data_2_1 = top100ScoreBrand;
    let data_2_2 = xlsx.parse(path.join("xlsx", "2-2.xlsx"));
    let data_2_3 = xlsx.parse(path.join("xlsx", "2-3.xlsx"));
    let data_2_4 = xlsx.parse(path.join("xlsx", "2-4.xlsx"));
    let data_2_5 = newBaicheFaultNameList;
    let data_2_6 = researchBaicheFaultNameList;

    let data_3_1 = compaintList;
    let data_3_2 = xlsx.parse(path.join("xlsx", "3-2.xlsx"));
    let data_3_3 = xlsx.parse(path.join("xlsx", "3-3.xlsx"));
    let data_3_4 = brandPositinProblemList;
    let data_3_5 = xlsx.parse(path.join("xlsx", "3-5.xlsx"));
    let data_3_6 = xlsx.parse(path.join("xlsx", "3-6.xlsx"));

    this.ctx.body = {
      data_1_1,data_1_2,data_1_3,data_1_4,data_1_5,data_1_6,
      data_2_1,data_2_2,data_2_3,data_2_4,data_2_5,data_2_6,
      data_3_1,data_3_2,data_3_3,data_3_4,data_3_5,data_3_6,  
      auctionList:auctionList
    };
  }
}

module.exports = HomeController;
