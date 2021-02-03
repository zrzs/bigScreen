"use strict";

const request = require("request");

const iconv = require("iconv-lite");
var CronJob = require("cron").CronJob;

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
    // const baiduResult = await client.generalBasicUrl(
    //   "http://redgreenlight.zrzs.xyz/ocr-sim1.png"
    // );

    // console.log(baiduResult);

    ctx.body = "hi, egg.js home page";
  }

  async crawlMonthconInfo() {
    await this.ctx.service.spider.getUnCrawlAutoMouthconList();
    this.ctx.body = "正在抓取口碑信息中....";
  }

  async crawlMonthconDetailInfo() {
    const brandList= await this.ctx.service.spider.getWaitingCrawlMouthconDetailList();
    if(brandList.length<=0){
      return "暂无待爬取的执行标的";
    }
    let cursor=0;
    
    const job = new CronJob(
      "*/1 * * * * *",
      async () => {
        if (cursor===brandList.length-1) {
          job.stop();
          console.log("车型数据爬取完成");
        } else {
          try {
            const brand=brandList[cursor];
            let nextUrl=brandList[cursor];
           const crawlerInfo=await this.ctx.service.spider.getModelDetaiInfoByURL(brand);
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
    this.ctx.body = "正在抓取口碑详情信息中....";
  }

  async crawlBrandInfo() {
   const brandList= await this.ctx.service.spider.getWaitingCrawlMouthconDetailList();
    if(brandList.length<=0){
      return "暂无待爬取的执行标的";
    }
    let cursor=0;
    const job = new CronJob(
      "*/3 * * * * *",
      async () => {
        if (cursor===brandList.length-1) {
          job.stop();
          console.log("车型数据爬取完成");
        } else {
          try {
            const brand=brandList[cursor];
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

  async login() {
    const user = await this.ctx.service.user.loginAndGetUserinfo(
      "most_wanted",
      "whyshinia000"
    );
    this.ctx.logger.info("login successed");
    this.ctx.body = user ? "login successed!" : "login faild";
  }

  async createUser() {
    const result = await this.ctx.service.user.createUser({
      userName: "测试用户",
      password: "238934d",
      address: "经开区职工之家",
    });
    this.ctx.body = "add user successed";
  }

  async updateUser() {
    const result = await this.ctx.service.user.updateUser();
    this.ctx.body = result;
  }

  async deleteUser() {
    const result = await this.ctx.service.user.deleteUser();
    this.ctx.body = result;
  }

  async writeHeaders() {
    console.log(this.ctx.request);
    this.ctx.body =
      this.ctx.request.ip + "\n" + JSON.stringify(this.ctx.request.header);
  }
  async testProxy() {
    this.ctx.service.user.getKoubeiInfo("http://192.168.3.207:7001/test");
    this.ctx.body = "测试webdriver 代理和请求头";
  }
}

module.exports = HomeController;
