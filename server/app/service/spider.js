"use strict";

const {
  BAIDU: { APP_ID, API_KEY, SECRET_KEY },
} = require("./../../config/sys.config");

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { Service } = require("egg");
const request = require("request");
const iconv = require("iconv-lite");
const AipOcrClient = require("baidu-aip-sdk").ocr;
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
const proxyChain = require('proxy-chain');


class SpiderService extends Service {
  
  async updateCurrentMouthcon() {
    const mouthconList = await this.app.mysql.select("mouthcon");
    mouthconList.map(async (m) => {
      await this.app.mysql.update(
        "mouthcon",
        { mouthconUrl: m.mouthconUrl.substr(8) },
        { where: { id: m.id } }
      );
    });
  }

  //车型下的口碑分页列表
  async crawlMouthconList(url, brand) {
    const that = this;
    return new Promise((resolve, reject) => {
      const port=20241+parseInt(Math.random()*100);
      let pageCount = 1;
      // url="https://www.baidu.com/";
      request(
        { url: url, encoding: null,
          timeout:10000,
          proxy:`http://jiaodatest:jiaodatest123@222.186.19.239:${port}`, 
        },
        async (error, response, body) => {
          console.log(error,response,body);
          if (error) {
            console.log("报错了:"+error);
            return  resolve({url:url,end:false});
          }
          const $ = cheerio.load(iconv.decode(body, "gb2312"));
          console.log(iconv.decode(body, "gb2312"));
          // 口碑总页数
          let countStr=0;
          if($(".page-item-info")&&$(".page-item-info").text()){
            countStr=$(".page-item-info").text().replace("共","").replace("页","");
            pageCount=parseInt(countStr);
          }

          console.log(`port:${port}; 总页数:${pageCount}/${$(".page .current").text()} 车型名称：${brand.modelName}`);
          console.log(url);
          if(!$(".page .current").text()){
            return resolve({url:url,end:true});
          }

          if(pageCount>parseInt($(".page .current").text())){
            resolve({url:"https://k.autohome.com.cn"+$(".page .current").next().attr("href"),end:false});
          }else{
           return resolve({url:url,end:true});
          }
          
          // 获取所有的mouthconRows
          const conElements = $(".mouthcon");
        conElements.each(async (i, c) => {
          const id = $(c).attr("id");
          const detailUrl=$(c).find(".help .orange").attr('href');
          let userId =$(c).find(".name-text span").attr("id")||"";
          userId=userId.replace("divAuthAuto_","");
          const userNickName =$(c).find(".name-text a").text();
          const userHeader=$(c).find(".name-pic img").attr("data-src");
          let rzCarModel = $(c).find(".main-text").text()||"无";
          let allText=$(".choose-con").text();
          if(allText.indexOf("购车经销商")===-1){
            $($('.choose-dl').eq(1)).after('<dl class="choose-dl"><dt>购车经销商</dt><dd><a href="" class="js-dearname"   ></a></dd></dl>')
          }
          const chooseDlList=$(c).find(".choose-dl");
          const buyCarModel =$($(chooseDlList.eq(0)).find("dd a").eq(0)).text();
          const buyAddress =$(chooseDlList.eq(1)).find("dd").text();
          const distributorName=$(chooseDlList.eq(2)).find("dd a").text()||"";
          const distributorUrl=$(chooseDlList.eq(2)).find("dd a").attr("href")||"";
          const buyTime=$(chooseDlList.eq(3)).find("dd").text();
          const price=$(chooseDlList.eq(4)).find("dd").text();
          const oilConsumption=$($(chooseDlList.eq(5)).find("dd p").eq(0)).text();
          let mileage = "";
          if($(chooseDlList.eq(5)).find("dd p").length===2){
            mileage=$($(chooseDlList.eq(5)).find("dd p").eq(1)).text();
          }

          const positionRList=$(c).find(".position-r");

          const space=$(positionRList.eq(0)).find("dd").text();
          const power=$(positionRList.eq(1)).find("dd").text();
          const manipulation=$(positionRList.eq(2)).find("dd").text();
          const oilConsumptionScore=$(positionRList.eq(3)).find("dd").text();
          const comfort=$(positionRList.eq(4)).find("dd").text();
          const appearance=$(positionRList.eq(5)).find("dd").text();
          const interiorTrim=$(positionRList.eq(6)).find("dd").text();
          const costPerformance=$(positionRList.eq(7)).find("dd").text();
          const purpose = $(c).find(".choose-dl .fn-clear").text();
          const createTime=$(c).find(".mouth-item b a").text();
          const watchCount=$(c).find(".help .orange").text();
          const likeCount=$(c).find(".supportNumber").text();
          const commentCount=$(c).find(".CommentNumber").text();
          const content=$(c).find(".text-cont").text();

          const $mouthcon = {
              mouthconId: id,
              modelId: brand.modelId,
              modelName: brand.modelName,
              mouthconUrl: detailUrl,
              userId:userId.replace(/\n/g,"").replace(/ /g,""),
              userNickName:userNickName.replace(/\n/g,"").replace(/ /g,""),
              userHeader:userHeader.replace(/\n/g,"").replace(/ /g,""),
              rzCarModel:rzCarModel.replace(/\n/g,"").replace(/ /g,""),
              buyCarModel:buyCarModel.replace(/\n/g,"").replace(/ /g,""),
              buyAddress:buyAddress.replace(/\n/g,"").replace(/ /g,""),
              distributorName:distributorName.replace(/\n/g,"").replace(/ /g,""),
              distributorUrl:distributorUrl.replace(/\n/g,"").replace(/ /g,""),
              buyTime:buyTime.replace(/\n/g,"").replace(/ /g,""),
              price:price.replace(/\n/g,"").replace(/ /g,""),
              oilConsumption:oilConsumption.replace(/\n/g,"").replace(/ /g,""),
              mileage:mileage.replace(/\n/g,"").replace(/ /g,""),
              space:space.replace(/\n/g,"").replace(/ /g,""),
              power:power.replace(/\n/g,"").replace(/ /g,""),
              manipulation:manipulation.replace(/\n/g,"").replace(/ /g,""),
              comfort:comfort.replace(/\n/g,"").replace(/ /g,""),
              appearance:appearance.replace(/\n/g,"").replace(/ /g,""),
              interiorTrim:interiorTrim.replace(/\n/g,"").replace(/ /g,""),
              costPerformance:costPerformance.replace(/\n/g,"").replace(/ /g,""),
              purpose:purpose.replace(/\n/g,"").replace(/ /g,""),
              oilConsumptionScore:oilConsumptionScore.replace(/\n/g,"").replace(/ /g,""),
              content: content.replace(/\n/g,"").replace(/ /g,""),
              createTime:createTime.replace(/\n/g,"").replace(/ /g,""),
              watchCount:watchCount.replace(/\n/g,"").replace(/ /g,""),
              likeCount:likeCount.replace(/\n/g,"").replace(/ /g,""),
              commentCount:commentCount.replace(/\n/g,"").replace(/ /g,""),
            };
            // console.log($mouthcon);
            // this.logger.info(mouthcon);
           const mouthconList= await that.app.mysql.select("mouthcon",{where:{mouthconId:id}});
          if(mouthconList.length===0){
            const result = await that.app.mysql.insert("mouthcon", $mouthcon);
            if (result.affectedRows === 1) {
              this.logger.info(
                "采集成功:" + $mouthcon.userNickName + "对" + $mouthcon.buyCarModel + "的口碑"
              );
            }
          }
        }
      );
    });
    });
  }

  //获取口碑详细信息
  async getAutoMouthconInfo(mouthcon) {
    (async () => {
      const port=20241+parseInt(Math.random()*100);
      const newProxyUrl = await proxyChain.anonymizeProxy(`http://jiaodatest:jiaodatest123@222.186.19.239:${port}`);
      const browser = await puppeteer.launch({ headless: false,args: [ '--no-sandbox','--disable-setuid-sandbox',`--proxy-server=${newProxyUrl}` ] });
      const page = await browser.newPage();
      await page.emulate({viewport:{width:1920,height:1080},userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'});
      await page.goto(mouthcon.mouthconUrl);
      await page.evaluate(async ()=>{
        $('.live-video').remove();$('.mouthcon-cont-left').remove();$('.advbox1').remove();$('.sytj-icon').hide();$('#auto-header').hide();$('.mjjh-icon').hide();$('.mouth-item').hide();$('.koubei-final').show();$('#mouth-title-end').hide();$('.cont-title').hide();$('.kou-tit').hide();$('.imgcont').hide();$('.user-cont').hide();$('.path').hide();$('.subnav').hide();$('br').remove();$('.image-div').remove();$('.add-dl').remove();$('.video-container').remove();$('.text-con').css({'font-size':'8px','line-height':'14px','padding':'10px'});
      });
      const headerEle = await page.$$(".mouth-main .koubei-final .text-con");
      const base64= await headerEle[0].screenshot({ path: "baidu.png",encoding:'base64' });
      const ocrResult = await client.generalBasic(base64);
      let ocrContent = "";
      if (ocrResult.hasOwnProperty("words_result_num")) {
        // 获取到ocr内容
        ocrResult.words_result.map((w) => {
          ocrContent += w.words;
        });
      } else if (ocrResult.hasOwnProperty("error_msg")) {
        // 获取ocr报错
        console.log(ocrResult.error_msg);
      }
      mouthcon.content=ocrContent;
      // 关闭浏览器
      await browser.close();
      // 更新口碑详情
      const result = await that.app.mysql.update("mouthcon", mouthcon, {
        where: { mouthconId: mouthcon.mouthconId },
      });

      if (result.affectedRows === 1) {
        this.logger.info(
          "采集成功:" + userNickName + "对" + buyCarModel + "的口碑"
        );
        resolve();
      }

    })();

    // return new Promise(async (resolve, reject) => {
    //   
    // });
  }

  // 批量爬取口碑详情
  async getUnCrawlAutoMouthconList() {
    // const mouthconList = await this.app.mysql.query(
    //   "SELECT * FROM mouthcon WHERE userNickName is NULL LIMIT 1"
    // );
    const mouthconList = await this.app.mysql.query(
      "SELECT * FROM mouthcon WHERE crawlDetail=0 LIMIT 1"
    );

    if (mouthconList && mouthconList.length > 0) {
      // console.log(mouthconList);
      try {
        await this.getAutoMouthconInfo(mouthconList[0]);
        await this.sleep(1000 * 4);
      } catch (error) {
        await this.sleep(1000 * 30);
      }
    }
  }

  // 通过车型链接，获取车型补充信息(百车故障数、用户评分)
  getModelDetaiInfoByURL(brand) {
    const that = this;
    return new Promise((resolve, reject) => {
      const port=20241+parseInt(Math.random()*100);
      request(
        { url: brand.modelMouthcon, encoding: null,
          proxy:`http://jiaodatest:jiaodatest123@222.186.19.239:${port}`, 
        },
        async (error, response, body) => {
          if (error) {
            console.log(error);
            return reject("报错了");
          }
          const $ = cheerio.load(iconv.decode(body, "gb2312"));
          // 车型分类
          const model = $($(".breadnav a")[1]).text();
          // 油耗(需要分排量、手动自动) 集合
          const oilEleList = $(".appraise-cont.current .tab-content-item");
          const oilInfoList = [];
          oilEleList.map((i, o) => {
            let displacement = "";
            if ($(o).attr("id")) {
              displacement = $(o).attr("id").replace("0_o", ""); //排量
              let chartArray = [...displacement];
              chartArray = chartArray.splice(1, 0, ".");
              displacement = chartArray.join(".");
            }
            const oilItems = $(o).find(".tab-content-item-li");
            oilItems.map((k, oi) => {
              let isAutomatic = $(oi).find("span").text(); //手动、自动、电动？
              let oil = $(oi).find(".font-arial").text(); //单位：L/100km kWh/100km
              let personCount = $(oi)
                .find(".c999")
                .text()
                .replace("（", "")
                .replace("）", ""); //参与人数
              oilInfoList.push({ displacement, isAutomatic, oil, personCount });
            });
          });
          // 用户评分
          const score = $($(".score-box span.number-fen")[0]).text() || "0";
          // 用户评分参与人数
          const scorerCount = $(".score-box span.number-ren").text() || "0";

          const status=$(".year-title a.selected").text()==='停售'?'停售':'在售';
          // 新车故障数
          const newcarerScore = $(
            "a[target-id='#quality-chart-box-01'] span"
          ).text();
          // 新车参与人数
          const newcarerCount = $(
            "a[target-id='#quality-chart-box-01']"
          ).text();
          newcarerCount.substr(
            newcarerCount.indexOf("(") + 1,
            newcarerCount.indexOf(")") - newcarerCount.indexOf("(")
          );
          //  新车statistics 故障分布比例图
          const newStatisticsTable = [];

          const newcarItmes = $("#quality-chart-box-01 a.quality-item");
          if (newcarItmes.length > 0) {
            newcarItmes.map((i, a) => {
              const item = {
                text: $(a).find("dt").text(),
                value: $(a).find("dd").text() || "0",
              };
              newStatisticsTable.push(item);
            });
          }

          const newStatistics = {
            score: newcarerScore,
            userCount: newcarerCount,
            table: newStatisticsTable,
          };

          // 可靠性研究故障数
          const researchcarerScore = $(
            "a[target-id='#quality-chart-box-02'] span"
          ).text();
          // 可靠性研究参与人数
          const researchcarerCount = $(
            "a[target-id='#quality-chart-box-02']"
          ).text();
          newcarerCount.substr(
            newcarerCount.indexOf("(") + 1,
            newcarerCount.indexOf(")") - newcarerCount.indexOf("(")
          );
          //  可靠性研究statistics 故障分布比例图

          const researchcarItmes = $("#quality-chart-box-02 a.quality-item");
          const researchStatisticsTable = [];
          if (researchcarItmes.length > 0) {
            researchcarItmes.map((i, a) => {
              const item = {
                text: $(a).find("dt").text(),
                value: $(a).find("dd").text() || "0",
              };
              researchStatisticsTable.push(item);
            });
          }

          const researchStatistics = {
            score: researchcarerScore,
            userCount: researchcarerCount,
            table: researchStatisticsTable,
          };

          // 口碑印象
          const mouthAppraise = [];
          const mouthAppraiseEle = $(".revision-suspend .revision-impress a");
          mouthAppraiseEle.map((i, m) => {
            const text = $(m).text().replace(")", "");
            const item = {
              text: text.split("(")[0],
              value: text.split("(")[1],
              isDust: $(m).hasClass("dust"),
            };
            mouthAppraise.push(item);
          });

          const modelInstance = {
            newBaicheFault: JSON.stringify(newStatistics),
            researchBaicheFault: JSON.stringify(researchStatistics),
            score,
            scorerCount,
            model,
            status,
            oil: JSON.stringify(oilInfoList),
            mouthAppraise: JSON.stringify(mouthAppraise),
          };
          // console.log(modelInstance);
          const result = await that.app.mysql.update("brand", modelInstance, {
            where: { modelId: brand.modelId },
          });
          if (result.affectedRows === 1) {
            console.log(brand.modelName+":抓取并更新成功");
            resolve(true);
          } else {
            reject("抓取或更新失败");
          }
        }
      );
    });
  }

  // 批量爬取车型的百车故障数分布比例、口碑评价label、用户评分
  async getWaitingCrawlMouthconDetailList() {
    // "SELECT * FROM brand WHERE modelPrice !='暂无'"
    const brandList = await this.app.mysql.query(
      "SELECT * FROM brand WHERE score!='0' LIMIT 545,706"
    );
    return brandList;
  }

  // 爬取字母分类表-爬取brand
  async getCarModelInfo(w) {
    const that = this;
    return new Promise((resolve, reject) => {
      const url = `https://www.autohome.com.cn/grade/carhtml/${w}.html`;
      request({ url: url, encoding: null }, function (error, response, body) {
        if (error) {
          return reject(error);
        }
        const $ = cheerio.load(iconv.decode(body, "gb2312"));
        $("dl").map((i, dl) => {
          const brandId = $(dl).attr("id");
          const brandName = $(dl).find("dt").text();
          const brandUrl =
            "https:" + $(dl).find("dt img").parent().attr("href");
          const brandLogo = "https:" + $(dl).find("dt img").attr("src");

          $(dl)
            .find("dd .h3-tit")
            .map((j, dd) => {
              const titName = $(dd).text();
              const titUrl = "https:" + $(dd).find("a").attr("href");

              $(dd)
                .next("ul")
                .find("li")
                .map(async (k, model) => {
                  if ($(model).hasClass("dashline")) return 0;
                  const modelId = $(model).attr("id");
                  const modelName = $(model).find("h4").text();
                  const modelUrl =
                    "https:" + $(model).find("h4 a").attr("href");

                  let modelPrice = "暂无";
                  if ($(model).text().indexOf("指导价：暂无") === -1) {
                    modelPrice = $(model).find("div").first().text();
                  }

                  // 获取口碑的前一个标签，如果tagName===span,则为空
                  const koubeiNode = $(model)
                    .children()
                    .last()
                    .children()
                    .get(4);
                  let modelKoubei = "";
                  if (koubeiNode.tagName === "a") {
                    modelKoubei = "https:" + $(koubeiNode).attr("href");
                  }

                  const forumNode = $(model)
                    .children()
                    .last()
                    .children()
                    .get(3);
                  let modelForum = "";
                  if (forumNode.tagName === "a") {
                    modelForum = "https:" + $(forumNode).attr("href");
                  }

                  const modelInstance = {
                    brandId,
                    brandName,
                    brandUrl,
                    brandLogo,
                    titName,
                    titUrl,
                    modelId,
                    modelName,
                    modelUrl,
                    modelPrice,
                    modelKoubei: modelKoubei,
                    modelForum: modelForum,
                  };
                  // console.log(JSON.stringify(modelInstance));
                  const result = await that.app.mysql.insert(
                    "brand",
                    modelInstance
                  );
                  if (result.affectedRows === 1) {
                    console.log("插入成功");
                    resolve(true);
                  } else {
                    reject(false);
                  }
                });
            });
        });
      });
    });
  }
  async sleep(time = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
}

module.exports = SpiderService;
