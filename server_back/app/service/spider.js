"use strict";

require("chromedriver");

const {
  BAIDU: { APP_ID, API_KEY, SECRET_KEY },
  CHROMEPATH,
} = require("./../../config/sys.config");

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { Service } = require("egg");
const request = require("request");
const { Builder, By, Capabilities, Proxy } = require("selenium-webdriver");
const proxy = require("selenium-webdriver/proxy");
const chrome = require("selenium-webdriver/chrome");
const iconv = require("iconv-lite");
const AipOcrClient = require("baidu-aip-sdk").ocr;
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

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

  async getMouthconListByBrand() {
    const offset = await this.app.mysql.get("offset", { id: 1 });
    const brandList = await this.app.mysql.select("brand", {
      // offset: offset.brandOffset
      // limit: 1,
    });
    console.log(offset, brandList.length);
    const options = new chrome.Options();
    options.addArguments("--start-maximized");
    options.addArguments("--disable-infobars");
    // options.addArguments("--incognito");
    // options.addArguments("--headless");
    options.addArguments("--disable-gpu");
    options.setChromeBinaryPath(CHROMEPATH);
    let driver = await new Builder()
      .setChromeOptions(options)
      .withCapabilities(Capabilities.chrome())
      .forBrowser("chrome")
      .build();
    driver.get(brandList[offset.brandOffset].modelMouthcon);
    await this.crawlMouthconList(driver, brandList[offset.brandOffset]);
  }

  //车型下的口碑分页列表
  async crawlMouthconList(driver, brand) {
    let currentPage = 1;
    let pageCount = 1;
    let pageElement = null;
    try {
      const pageCountEle = await driver.findElement(
        By.className("page-item-info")
      ); //获取当前车型口碑总页数
      const pageCountStr = await pageCountEle.getText();
      pageCount = pageCountStr.substr(1, pageCountStr.length - 2);

      pageElement = await driver.findElement(By.className("page-cont"));
      const currentPageElement = await pageElement.findElement(
        By.className("current")
      );
      currentPage = await currentPageElement.getText();
      console.log(pageCount + "/" + currentPage);
    } catch (error) {
      // 如果这里报错产生css selecttor not found exception  那说明只有一页数据
    }

    // 获取所有的mouthconRows
    const conElements = await driver.findElements(By.className("mouthcon"));
    conElements.map(async (c, index) => {
      const id = await c.getAttribute("id");
      const allContElement = await c.findElement(By.className("allcont"));
      const detailEle = allContElement.findElement(By.className("fn-left"));
      const detailUrl = await detailEle.getAttribute("href");

      const MouthconResult = await this.app.mysql.insert("mouthcon", {
        mouthconId: id,
        modelId: brand.modelId,
        modelName: brand.modelName,
        mouthconUrl: detailUrl,
      });
      if (MouthconResult.affectedRows === 1) {
        this.logger.info("写入口碑ID:" + id);
      }
    });

    const mouthconLog = await this.app.mysql.get("mouthconLog", {
      modelId: brand.modelId,
    });

    if (!mouthconLog) {
      const result = await this.app.mysql.insert("mouthconLog", {
        startTime: this.app.mysql.literals.now,
        brandId: brand.brandId,
        modelId: brand.modelId,
        count: 0,
        pageCount,
      });
      if (result.affectedRows === 1) {
        this.logger.info("开始记录口碑爬取信息");
      }
    }

    // 无论是否相等都延迟10秒，防止最后一页数据还未抓取完，driver退出了，造成报错
    await driver.sleep(5 * 1000);
    if (currentPage === pageCount) {
      // 如果当前页等于总页数 则跳出，否则继续
      driver.quit();
      // 获取当前brand ID下limit 0，1
      const firstMouthconOfBrandId = await this.app.mysql.get("mouthcon", {
        modelId: brand.modelId,
      });

      let countNum = firstMouthconOfBrandId
        ? (pageCount - 1) * 15 + conElements.length
        : 0;
      let lastMouthconId = firstMouthconOfBrandId
        ? firstMouthconOfBrandId.mouthconId
        : null;
      const mouthconUpdateResult = await this.app.mysql.update(
        "mouthconLog",
        {
          endTime: this.app.mysql.literals.now,
          count: countNum,
          lastMouthconId,
        },
        { where: { modelId: brand.modelId } }
      );
      if (mouthconUpdateResult.affectedRows === 1) {
        this.logger.info("当前车型口碑列表采集并更新完毕" + brand.modelName);
      }
      const offset = await this.app.mysql.get("offset", { id: 1 });
      // 缺少一个判断，如果当前brand总条数等于brandOffset了，则跳出程序
      const offsetUpdateResult = await this.app.mysql.update(
        "offset",
        {
          brandOffset: offset.brandOffset + 1,
        },
        { where: { id: 1 } }
      );
      if (offsetUpdateResult.affectedRows === 1) {
        this.logger.info("当前车型采集偏移量更新成功");
      }

      await this.sleep(2 * 1000);
      this.getMouthconListByBrand();
      // 并且更新抓取日志表、offset表
    } else {
      const nextElement = pageElement.findElement(
        By.className("page-item-next")
      );
      const e = await nextElement.getAttribute("href");
      console.log(e);
      await driver.executeScript("arguments[0].click();", nextElement);
      // nextElement.click();
      this.crawlMouthconList(driver, brand);
    }
  }

  //获取口碑详细信息
  async getAutoMouthconInfo(mouthcon) {
    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(mouthcon.mouthconUrl);
      await page.screenshot({ path: "example.png" });

      await browser.close();
    })();

    // 新建一个对象，建议只保存一个对象调用服务接口
    // const options = new chrome.Options();
    // options.addArguments("--start-maximized");
    // options.addArguments("--disable-infobars");
    // // options.addArguments("--incognito");
    // // options.addArguments("--headless");
    // options.addArguments("--disable-gpu");
    // options.addArguments("excludeSwitches", ["enable-automation"]);
    // options.setChromeBinaryPath(CHROMEPATH);
    // const service = new chrome.ServiceBuilder("").build();
    // chrome.setDefaultService(service);

    // const driver = await new Builder()
    //   .setProxy(proxy.manual({ http: "117.169.78.54:15413" }))
    //   .forBrowser("chrome")
    //   .withCapabilities(Capabilities.chrome())
    //   .setChromeOptions(options)
    //   .build();
    // const that = this;
    // return new Promise(async (resolve, reject) => {
    //   driver.get(mouthcon.mouthconUrl);
    //   // driver.manage().window().maximize(); //fullscreen
    //   //等待10秒
    //   await driver.sleep(5 * 1000);
    //   try {
    //     await driver.findElement(By.id("hidAuthorId")).getAttribute("value");
    //   } catch (error) {
    //     // 报错了 多半就是高频了，睡1分钟，重新开始
    //     await driver.sleep(30 * 1000);
    //     // driver.quit();
    //     return this.getUnCrawlAutoMouthconList();
    //   }
    //   const jsString =
    //     "$('.live-video').remove();$('.advbox1').remove();$('.sytj-icon').hide();$('#auto-header').hide();$('.mjjh-icon').hide();$('.mouth-item').hide();$('.koubei-final').show();$('#mouth-title-end').hide();$('.cont-title').hide();$('.kou-tit').hide();$('.imgcont').hide();$('.user-cont').hide();$('.path').hide();$('.subnav').hide();$('br').remove();$('.image-div').remove();$('.add-dl').remove();$('.video-container').remove();$('.text-con').css({'font-size':'8px','line-height':'14px','padding':'10px'});";
    //   driver.executeScript(jsString);

    //   const userId = await driver
    //     .findElement(By.id("hidAuthorId"))
    //     .getAttribute("value");
    //   const userNickName = await driver
    //     .findElement(By.id("ahref_UserId"))
    //     .getText();
    //   const userHeader = await driver
    //     .findElement(By.xpath("/html/body/div[2]/div[4]/div/div/dl/dt/a/img"))
    //     .getAttribute("src");
    //   let rzCarModel = "无";
    //   try {
    //     rzCarModel = await driver.findElement(By.id("divAuthSpec")).getText();
    //     // console.log(await driver.findElement(By.id("divAuthSpec")).getText());
    //   } catch (error) {
    //     // 未找到认证车型节点 抛出错误
    //   }

    //   let distributorEle = null;
    //   try {
    //     distributorEle = await driver
    //       .findElement(By.className("js-dearname"))
    //       .getText();
    //   } catch (error) {
    //     // 如果没有经销商节点，那么手动js插入一行经销商节点
    //     const jsString =
    //       '$(\'body > div.content > div:nth-child(8) > div > div > div.mouth-cont > div > div > div.mouthcon-cont-left > div > dl:nth-child(2)\').after(\'<dl class="choose-dl"><dt>购车经销商</dt><dd><a href="" class="js-dearname"   ></a></dd></dl>\');';
    //     driver.executeScript(jsString);
    //   }

    //   const buyCarModel = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[1]/dd"
    //       )
    //     )
    //     .getText();

    //   const buyAddress = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[2]/dd"
    //       )
    //     )
    //     .getText();

    //   const distributorName = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[3]/dd/a"
    //       )
    //     )
    //     .getText();

    //   const distributorUrl = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[3]/dd/a"
    //       )
    //     )
    //     .getAttribute("href");

    //   const buyTime = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[4]/dd"
    //       )
    //     )
    //     .getText();

    //   const price = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[5]/dd"
    //       )
    //     )
    //     .getText();

    //   let oilConsumption = "";

    //   try {
    //     oilConsumption = await driver
    //       .findElement(
    //         By.xpath(
    //           "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[6]/dd/p[1]"
    //         )
    //       )
    //       .getText();
    //   } catch (error) {}

    //   let mileage = "";
    //   try {
    //     mileage = await driver
    //       .findElement(
    //         By.xpath(
    //           "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[6]/dd/p[2]"
    //         )
    //       )
    //       .getText();
    //   } catch (error) {
    //     //
    //   }

    //   const space = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[7]/dd"
    //       )
    //     )
    //     .getText();

    //   const power = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[8]/dd"
    //       )
    //     )
    //     .getText();

    //   const manipulation = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[9]/dd"
    //       )
    //     )
    //     .getText();

    //   const oilConsumptionScore = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[10]/dd"
    //       )
    //     )
    //     .getText();

    //   const comfort = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[11]/dd"
    //       )
    //     )
    //     .getText();

    //   const appearance = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[12]/dd"
    //       )
    //     )
    //     .getText();

    //   const interiorTrim = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[13]/dd"
    //       )
    //     )
    //     .getText();

    //   const costPerformance = await driver
    //     .findElement(
    //       By.xpath(
    //         "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[14]/dd"
    //       )
    //     )
    //     .getText();

    //   let purpose = "";
    //   try {
    //     purpose = await driver
    //       .findElement(
    //         By.xpath(
    //           "/html/body/div[2]/div[4]/div/div/div[2]/div/div/div[1]/div/dl[15]/dd"
    //         )
    //       )
    //       .getText();
    //   } catch (error) {}

    //   const createTime = await driver
    //     .findElement(By.id("hidEvalCreated"))
    //     .getAttribute("value");

    //   const watchCount = await driver.findElement(By.id("koubeipv")).getText();
    //   const likeCount = await driver
    //     .findElement(By.className("supportNumber"))
    //     .getText();
    //   const commentCount = await driver
    //     .findElement(By.className("CommentNumber"))
    //     .getText();

    //   const conElement = await driver
    //     .findElement(By.css(".koubei-final:last-child"))
    //     .findElement(By.className("text-con"));

    //   const base64 = await conElement.takeScreenshot(true);

    //   fs.writeFile(
    //     "shotTargetNode.png",
    //     base64,
    //     { encoding: "base64" },
    //     function (err) {
    //       console.log("File created");
    //     }
    //   );

    //   const ocrResult = await client.generalBasic(base64);
    //   let ocrContent = "";
    //   if (ocrResult.hasOwnProperty("words_result_num")) {
    //     // 获取到ocr内容
    //     ocrResult.words_result.map((w) => {
    //       ocrContent += w.words;
    //     });
    //   } else if (ocrResult.hasOwnProperty("error_msg")) {
    //     // 获取ocr报错
    //     console.log(ocrResult.error_msg);
    //   }

    //   const $mouthcon = {
    //     userId,
    //     userNickName,
    //     userHeader,
    //     rzCarModel,
    //     buyCarModel,
    //     buyAddress,
    //     distributorName,
    //     distributorUrl,
    //     buyTime,
    //     price,
    //     oilConsumption,
    //     mileage,
    //     space,
    //     power,
    //     manipulation,
    //     comfort,
    //     appearance,
    //     interiorTrim,
    //     costPerformance,
    //     purpose,
    //     oilConsumptionScore,
    //     content: ocrContent,
    //     createTime,
    //     watchCount,
    //     likeCount,
    //     commentCount,
    //   };
    //   // console.log($mouthcon);
    //   // this.logger.info(mouthcon);
    //   // console.log(mouthcon);
    //   const result = await that.app.mysql.update("mouthcon", $mouthcon, {
    //     where: { mouthconId: mouthcon.mouthconId },
    //   });
    //   if (result.affectedRows === 1) {
    //     this.logger.info(
    //       "采集成功:" + userNickName + "对" + buyCarModel + "的口碑"
    //     );
    //     driver.quit();
    //     resolve();
    //   }
    //   reject("更新失败");
    // });
  }

  // 批量爬取口碑详情
  async getUnCrawlAutoMouthconList(isNotFrist) {
    // const mouthconList = await this.app.mysql.query(
    //   "SELECT * FROM mouthcon WHERE userNickName is NULL LIMIT 1"
    // );
    const mouthconList = await this.app.mysql.query(
      "SELECT * FROM mouthcon WHERE modelName='朗逸' AND userNickName is NULL LIMIT 1"
    );
    // console.log(mouthconList);

    if (mouthconList && mouthconList.length > 0) {
      // console.log(mouthconList);
      try {
        await this.getAutoMouthconInfo(mouthconList[0], isNotFrist);
        await this.sleep(1000 * 4);
      } catch (error) {
        await this.sleep(1000 * 30);
      }

      this.getUnCrawlAutoMouthconList(true);
    }
  }

  // 通过车型链接，获取车型补充信息(百车故障数、用户评分)
  getModelDetaiInfoByURL(brand) {
    const that = this;
    return new Promise((resolve, reject) => {
      const port=24850+parseInt(Math.random()*100);
      request(
        { url: brand.modelMouthcon, encoding: null,
          proxy:`http://test:test123@114.67.89.237:${port}`, 
        },
        async (error, response, body) => {
          if (error) {
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
          const score = $(".score-box span.number-fen").text() || "0";
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
          const mouthAppraiseEle = $(".revision-impress a");
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
    const brandList = await this.app.mysql.query(
      "SELECT * FROM brand WHERE modelPrice !='暂无'"
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
