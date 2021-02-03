"use strict";

const { Service } = require("egg");
const request = require("request");

const list = "ABCDEFGHIJKLMNOPQRSTVWXYZ".split("");
let timerCount = 0;

class AuctionService extends Service {
  async get(uid) {
    const user = await this.app.mysql.get("users", { userId: uid });
    return user;
  }

  // 获取
  async getAuctionList(username, password) {
    let auctionList = await this.app.mysql.query('SELECT * FROM brand WHERE modelPrice !=\'暂无\' AND titName NOT LIKE \'%进口%\' AND score !=0 AND (newBaicheFault !=\'{"score":"","userCount":"","table":[]}\' OR researchBaicheFault !=\'{"score":"","userCount":"","table":[]}\');');
    let $auctionList =[];
    auctionList.map(a=>{
      $auctionList.push({text:a.modelName,j:a.mouthAppraise,val:a.id});
    });
    return $auctionList;
  }
}

module.exports = AuctionService;
