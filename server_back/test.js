"use strict";
const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors"); // puppeteer内置的一些常见设备的模拟参数
const iPhone = devices.devicesMap["iPhone 6"];
// console.log(iPhone, devices);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto("https://www.baidu.com");

  //   先获取元素，再截当前元素内容的屏

  page.once("domcontentloaded", async (e) => {
    console.log("page onload");
    const headerEle = await page.$("#header");
    headerEle.screenshot({ path: "baide-header.png" });
    await browser.close();
  });

  //   await page.screenshot({ path: "baidu.png" });
})();
