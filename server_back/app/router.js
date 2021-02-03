"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  router.get("/crawlMonthconInfo", controller.home.crawlMonthconInfo);
  router.get("/crawlBrandInfo", controller.home.crawlBrandInfo);
  router.get("/login", controller.home.login);
  router.get("/addUser", controller.home.createUser);
  router.get("/addUser", controller.home.createUser);
  router.get("/updateUser", controller.home.updateUser);
  router.get("/user/delete", controller.home.deleteUser);
  router.get("/test", controller.home.writeHeaders);
  router.get("/testProxy", controller.home.testProxy);
};
