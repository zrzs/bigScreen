"use strict";

const puppeteer = require("puppeteer");
const { Service } = require("egg");
// const request = require("request");
var rp = require("request-promise");
const fs = require("fs");
const iconv = require("iconv-lite");
const urlList = [
  "http://ccc.cvc.org.cn/Login.aspx",
  "http://zxgk.court.gov.cn/zhzxgk/",
  "https://auction.jd.com/sifa.html",
  "https://sf.taobao.com/",
];

class SifaService extends Service {
  //获取口碑详细信息
  async test(mouthcon) {
    (async () => {
      const browser = await puppeteer.launch({
        headless: false,
        ignoreDefaultArgs: ["--enable-automation"],
      });

      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3477.0 Safari/537.36"
      );
      await page.setViewport({
        width: 1920,
        height: 1080,
      });
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", {
          get: () => false,
        });
      });
      await page.goto(urlList[0]);

      await page.type("#pName", "唐儒碧", { delay: 200 });
      //   await page.type("#accountName", "唐儒碧", { delay: 100 });
      //   await page.type("#accountPassword", "131126196405040024", { delay: 100 });
      await page.type("#pCardNum", "131126196405040024", { delay: 200 });
      // 获取到验证码元素
      await page.click("#captchaImg");

      const image = await page.waitForSelector("#captchaImg");
      //   const image = await page.waitForSelector("#loginCodeImg");
      //   保存在本地
      await image.screenshot({
        path: "captchaImg.png",
        omitBackground: false,
      });

      const buff = fs.readFileSync("captchaImg.png");
      const base64data = buff.toString("base64");
      const options = {
        method: "POST",
        uri: "http://api.ttshitu.com/base64",
        form: {
          username: "woyaotujiandama",
          password: "E6hb93r.RTH5",
          typeid: "3",
          image: base64data,
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded", // Is set automatically
        },
      };

      rp(options)
        .then(async function (body) {
          console.log(body);
          body = JSON.parse(body);
          if (body.success === true) {
            await page.type("#yzm", body.data.result, { delay: 100 });
            // await page.type("#verifyCode", body.data.result, { delay: 100 });
            await page.click("#yzm-group .btn.btn-zxgk.btn-block");
            // await page.click("#loginbtn");
            console.log("查询完成");
          }
        })
        .catch(function (err) {
          console.log(err);
        });

      //   await browser.close();
    })();
  }
  async sleep(time = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
}

module.exports = SifaService;
