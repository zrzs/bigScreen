"use strict";

require("chromedriver");

const cheerio = require("cheerio");
const { Service } = require("egg");
const request = require("request");
const iconv = require("iconv-lite");
const { Builder, By, Capabilities, Proxy } = require("selenium-webdriver");
const proxy = require("selenium-webdriver/proxy");
const chrome = require("selenium-webdriver/chrome");

const {
  BAIDU: { APP_ID, API_KEY, SECRET_KEY },
  CHROMEPATH,
} = require("./../../config/sys.config");
// const chromePath =
//   "/Users/mark/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome";
// const fs = require("fs");

const list = "ABCDEFGHIJKLMNOPQRSTVWXYZ".split("");
let timerCount = 0;

class UserService extends Service {
  async get(uid) {
    const user = await this.app.mysql.get("users", { userId: uid });
    return user;
  }

  // 登录逻辑
  async loginAndGetUserinfo(username, password) {
    const user = await this.app.mysql.get("users", {
      userName: username,
      password,
    });
    this.ctx.logger.info(JSON.stringify(user));
    if (user) {
      return user;
    }
    return false;
  }

  // 创建用户 入库
  async createUser(user) {
    const result = await this.app.mysql.insert("users", user);
    this.logger.info("create a user :", result);
    return result;
  }

  // 更新用户信息
  async updateUser() {
    const result = await this.app.mysql.update(
      "users",
      {
        userName: "___@_@__",
        address: "78263jsdhfaskjd的接口撒",
      },
      { where: { userId: 2 } }
    );
    // result.affectedRows===1
    this.logger.info("update result", result);
    return result;
  }

  // 删除用户
  async deleteUser() {
    const result = this.app.mysql.delete("users", { userId: 2 });
    this.logger.info("delete user result", result);
    return result;
  }

  async getKoubeiInfo(url) {
    return new Promise(async (resolve, reject) => {

      const options = new chrome.Options();
      options.addArguments("--start-maximized");
      options.addArguments("--disable-infobars");
      // options.addArguments("--incognito");
      // options.addArguments("--headless");
      options.addArguments("--disable-gpu");
      options.setChromeBinaryPath(CHROMEPATH);
      const service = new chrome.ServiceBuilder("").build();
      chrome.setDefaultService(service);

      const driver = await new Builder()
        .setProxy(proxy.manual({ http: "117.169.78.54:15413" }))
        .forBrowser("chrome")
        .withCapabilities(Capabilities.chrome())
        .setChromeOptions(options)
        .build();
      driver.get(url);
      //等待10秒
      // driver.sleep(10 * 1000).then(async function () {
      //   try {
      //     await driver.findElement(By.id("kahdfiasdf"));
      //   } catch (error) {
      //     console.log("asdfghjkl;");
      //     console.log(JSON.stringify(error));
      //     console.log("asdfghjkl;");
      //   }

      //   const conElement = await driver
      //     .findElement(By.className("koubei-final"))
      //     .findElement(By.className("text-con"));
      //   const jsString =
      //     "$('br').remove();$('.image-div').remove();$('.text-con').css({'font-size':'8px','line-height':'14px','padding':'10px'});";
      //   driver.executeScript(jsString);
      //   const text = await conElement.getText();
      //   console.log(text);
      //   const base64 = await conElement.takeScreenshot(true);
      //   resolve(base64);
        // fs.writeFile(
        //   "shotTargetNode.png",
        //   base64,
        //   { encoding: "base64" },
        //   function(err) {
        //     console.log("File created");
        //   }
        // );
      // });
    });
  }

  async getAutoKoubei(url) {
    const that = this;
    return new Promise((resolve, reject) => {
      request({ url: url, encoding: null }, function (error, response, body) {
        if (error) {
          reject(error);
        }
        const $ = cheerio.load(iconv.decode(body, "gb2312"));
        // 获取到每一个口香糖(口碑信息)
        $(".mouthcon").map((i, m) => {
          const userId = $(m)
            .find(".name-pic a")
            .attr("href")
            .replace("//i.autohome.com.cn/", "");
          const userNickName = $(m).find(".name-pic img").attr("alt");
          const userHeader = "https:" + $(m).find(".name-pic img").data("src");
          const rzCarModel = $(m).find(".usercont-main a").text();
          const infos = $(m).find(".choose-con .choose-dl");
          const buyCarModel = $(infos.get(0)).find("dd").text();
          const buyAddress = $(infos.get(1)).find("dd").text();
          const distributorName = $(infos.get(2)).find("a").text();
          const distributorUrl = $(infos.get(2)).find("a").attr("href");
          const buyTime = $(infos.get(2)).find("dd").text();
          const price = $(infos.get(3)).find("dd").text();
          const oilConsumption = $(
            $(infos.get(5)).find("dd").children().first()
          ).text();
          const mileage = $(
            $(infos.get(5)).find("dd").children().last(1)
          ).text();
          const space = $(infos.get(6)).find("dd .font-arial").text();
          const power = $(infos.get(7)).find("dd .font-arial").text();
          const manipulation = $(infos.get(8)).find("dd .font-arial").text();
          const oilConsumptionScore = $(infos.get(9))
            .find("dd .font-arial")
            .text();
          const comfort = $(infos.get(10)).find("dd .font-arial").text();
          const appearance = $(infos.get(11)).find("dd .font-arial").text();
          const interiorTrim = $(infos.get(12)).find("dd .font-arial").text();
          const costPerformance = $(infos.get(13))
            .find("dd .font-arial")
            .text();
          const purpose = $(infos.get(15)).find("dd").text();
          let content = "";
          // 判断是否有图片
          if ($(m).find(".img-list img").length > 0) {
            $(m)
              .find(".img-list img")
              .map((k, img) => {
                content += "https:" + $(img).attr("src") + ",";
              });
          }
          content += $(m).find(".text-con").text();

          const createTime = $(m).find(".title-name b").text();
          const watchCount = $(m).find(".orange").text();
          const likeCount = $(m).find(".supportNumber").text();
          const commentCount = $(m).find(".CommentNumber").text();

          const koubei = {
            userId,
            userNickName,
            userHeader,
            rzCarModel,
            buyCarModel,
            buyAddress,
            distributorName,
            distributorUrl,
            buyTime,
            price,
            oilConsumption,
            mileage,
            space,
            power,
            manipulation,
            comfort,
            appearance,
            interiorTrim,
            costPerformance,
            purpose,
            oilConsumptionScore,
            content,
            createTime,
            watchCount,
            likeCount,
            commentCount,
          };
          console.log(koubei);
        });
      });
    });
  }

  // 通过字母获取车型信息，无U开头的车型
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
  // 批量获取字母表下的车型
  getCarModelByWord() {
    // const that = this;
    setTimeout(async () => {
      const result = await this.getCarModelInfo(list[timerCount]);
      if (result) {
        timerCount += 1;
        this.getCarModelByWord();
      }
    }, 3000);
  }
}

module.exports = UserService;
