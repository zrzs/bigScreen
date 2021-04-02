"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  router.get("/crawlMonthconInfo", controller.home.crawlMonthconInfo);
  router.get("/crawlMonthconDetailInfo", controller.home.crawlMonthconDetailInfo);
  router.get("/crawlBrandInfo", controller.home.crawlBrandInfo);
  router.get("/getChartData", controller.home.getChartData);
  router.get("/getBrandData", controller.home.getBrandData);
  router.get("/getFirmData", controller.home.getFirmData);
  router.get("/getCompaintData", controller.home.getCompaintData);
  router.get("/queryBrandPositionProblem", controller.home.queryBrandPositionProblem);
  router.get("/queryCarLevelMonthSales", controller.home.queryCarLevelMonthSales);
  router.get("/queryPriceRangeMonthSales", controller.home.queryPriceRangeMonthSales);
  router.get("/queryBrandComplaintRate", controller.home.queryBrandComplaintRate);
  router.get("/queryBaicheData", controller.home.queryBaicheData);
};
